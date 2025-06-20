import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { GameState, GameMode, Player } from '../types/game';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface GameContextType {
  gameState: GameState;
  players: Player[];
  updateGameState: (updates: Partial<GameState> | ((prev: GameState) => Partial<GameState>)) => void;
  resetGame: () => void;
  resetWithMode: (mode: GameMode) => void;
  addPlayer: (player: Player) => void;
  clearLeaderboard: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const initialGameState: GameState = {
  mode: 'normal',
  score: 0,
  currentSet: 0,
  timeLeft: 60,
  isPlaying: false,
  isPaused: false,
  playerName: '',
  category: '',
  gameSessionId: Date.now(),
};

type GameAction = 
  | { type: 'UPDATE_STATE'; payload: Partial<GameState> | ((prev: GameState) => Partial<GameState>); isFunctional?: boolean }
  | { type: 'RESET_GAME' }
  | { type: 'RESET_WITH_MODE'; payload: GameMode };

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'UPDATE_STATE':
      if (action.isFunctional && typeof action.payload === 'function') {
        return { ...state, ...action.payload(state) };
      }
      return { ...state, ...action.payload };
    case 'RESET_GAME':
      return { ...initialGameState, gameSessionId: Date.now() };
    case 'RESET_WITH_MODE':
      return { ...initialGameState, mode: action.payload, gameSessionId: Date.now() };
    default:
      return state;
  }
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [gameState, dispatch] = useReducer(gameReducer, initialGameState);
  const [players, setPlayers] = useLocalStorage<Player[]>('vocab-game-players', []);
  console.log('[GameContext] Loaded players on mount:', players);

  // Patch: ensure all players have category and difficulty for backward compatibility
  React.useEffect(() => {
    const patched = players.map(p => ({
      ...p,
      category: typeof p.category === 'string' ? p.category : '',
      difficulty: typeof p.difficulty === 'string' ? p.difficulty : '',
    }));
    // Only update localStorage if patching was needed
    if (JSON.stringify(players) !== JSON.stringify(patched)) {
      setPlayers(patched);
    }
    // eslint-disable-next-line
  }, []);

  const patchedPlayers = players.map(p => ({
    ...p,
    category: typeof p.category === 'string' ? p.category : '',
    difficulty: typeof p.difficulty === 'string' ? p.difficulty : '',
  }));

  const updateGameState = (updates: Partial<GameState> | ((prev: GameState) => Partial<GameState>)) => {
    dispatch({
      type: 'UPDATE_STATE',
      payload: updates,
      isFunctional: typeof updates === 'function'
    });
  };

  const resetGame = () => {
    dispatch({ type: 'RESET_GAME' });
  };

  const resetWithMode = (mode: GameMode) => {
    dispatch({ type: 'RESET_WITH_MODE', payload: mode });
  };

  const addPlayer = (player: Player) => {
    setPlayers(prev => {
      const updated = [...prev, player];
      console.log('[addPlayer] Saving players:', updated);
      return updated;
    });
  };

  const clearLeaderboard = () => {
    setPlayers([]);
    console.log('[clearLeaderboard] Leaderboard cleared');
  };

  return (
    <GameContext.Provider value={{
      gameState,
      players: patchedPlayers,
      updateGameState,
      resetGame,
      resetWithMode,
      addPlayer,
      clearLeaderboard
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}