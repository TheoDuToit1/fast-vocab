export interface QuizItem {
  id: string;
  name: string;
  image: string;
  category: string;
}

export interface DropZoneData {
  id: string;
  label: string;
  color: string;
}

export interface MatchedPair {
  itemId: string;
  zoneId: string;
}

export interface FloatingScore {
  id: string;
  points: number;
  x: number;
  y: number;
}

export interface Player {
  name: string;
  score: number;
  mode: GameMode;
  timestamp: number;
  category: string;
  difficulty?: string;
  speed?: string;
}

export type GameMode = 'study' | 'normal' | 'timed';

export type GameSpeed = 'slow' | 'normal' | 'fast';
export type GameDifficulty = 'starter' | 'mover' | 'flyer';

export interface GameSettings {
  mode: GameMode;
  speed?: GameSpeed;
  difficulty?: GameDifficulty;
}

export interface GameState {
  mode: GameMode;
  score: number;
  continuousBonus: number;
  currentSet: number;
  timeLeft: number;
  isPlaying: boolean;
  isPaused: boolean;
  playerName: string;
  category: string;
  gameSessionId?: number;
  difficulty?: GameDifficulty;
}