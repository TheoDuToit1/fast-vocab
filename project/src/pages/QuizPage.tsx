import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Quiz from '../components/Quiz';
import StudyMode from '../components/StudyMode';
import NameInputModal from '../components/modals/NameInputModal';
import GameModeModal from '../components/modals/GameModeModal';
import { useGame } from '../context/GameContext';
import { GameMode, GameSettings } from '../types/game';

const QuizPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { gameState, updateGameState, resetGame } = useGame();
  const [showNameModal, setShowNameModal] = useState(false);
  const [showGameModeModal, setShowGameModeModal] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  const mode = searchParams.get('mode') as GameMode || 'normal';
  const speed = searchParams.get('speed') || undefined;
  const difficulty = searchParams.get('difficulty') || undefined;

  // If all settings are present, skip GameModeModal
  // For Challenge Mode (timed), only mode and difficulty are required
  const skipModeModal = mode !== 'study' && mode && (
    (mode === 'timed' && difficulty) ||
    (mode !== 'timed' && speed && difficulty)
  );

  useEffect(() => {
    // Reset game state and set initial mode
    if (!isInitialized) {
      resetGame();
      updateGameState({ mode, speed, difficulty });
      setIsInitialized(true);
      if (skipModeModal) {
        setShowGameModeModal(false);
        setShowNameModal(true);
        if (mode === 'timed') {
          updateGameState({ isPlaying: true });
        }
      }
    }
  }, [mode, speed, difficulty, updateGameState, resetGame, isInitialized, skipModeModal]);

  const handleGameSettings = (settings: GameSettings) => {
    console.log('handleGameSettings called with:', settings);
    updateGameState({
      mode: settings.mode,
      speed: settings.speed || 'normal',
      difficulty: settings.difficulty || 'normal',
      isPlaying: false
    });
    console.log('Game state updated, showing name modal');
    setShowGameModeModal(false);
    setShowNameModal(true);
  };

  const handleNameSubmit = (name: string) => {
    updateGameState({ playerName: name });
    setShowNameModal(false);
  };

  const handleBackToHome = () => {
    resetGame();
    navigate('/categories');
  };

  const handleStartQuiz = () => {
    // Switch from study mode to normal mode
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('mode', 'normal');
    navigate(newUrl.pathname + newUrl.search, { replace: true });
  };

  // Show study mode if mode is 'study'. Skip all modals.
  if (mode === 'study') {
    return (
      <div className="min-h-screen">
        <StudyMode 
          onBackToHome={handleBackToHome}
          onStartQuiz={handleStartQuiz}
        />
      </div>
    );
  }

  // Don't render Quiz until game state is initialized
  if (!isInitialized) {
    return null;
  }

  return (
    <div className="min-h-screen">
      {/* Only render Quiz after name is entered */}
      {!showNameModal && gameState.playerName && (
      <Quiz onBackToHome={handleBackToHome} />
      )}
      
      {showGameModeModal && !skipModeModal && (
        <GameModeModal
          isOpen={true}
          onSelectSettings={handleGameSettings}
          onClose={() => navigate('/')}
        />
      )}

      {showNameModal && (
      <NameInputModal
          isOpen={true}
        onSubmit={handleNameSubmit}
        onClose={() => navigate('/')}
      />
      )}
    </div>
  );
};

export default QuizPage;