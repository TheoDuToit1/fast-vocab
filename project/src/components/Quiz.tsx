import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Home, Volume2, VolumeX, HelpCircle, Trophy, Clock, Pause, Play } from 'lucide-react';
import DraggableItem from './DraggableItem';
import DropZone from './DropZone';
import ScoreAnimation from './ScoreAnimation';
import GameModeModal from './modals/GameModeModal';
import LeaderboardModal from './modals/LeaderboardModal';
import HelpModal from './modals/HelpModal';
import TimeUpModal from './modals/TimeUpModal';
import CountdownTimer from './CountdownTimer';
import TimerBar, { TimerBarHandle } from './TimerBar';
import { starterAnimals, moverSet, flyerSet } from '../data/animals';
import { starterColors, moverSet as colorMoverSet, flyerSet as colorFlyerSet } from '../data/colors';
import { MatchedPair, FloatingScore, Player } from '../types/game';
import { alphabetItems } from '../data/alphabet';
import { categories } from '../data/categories';
import { useGame } from '../context/GameContext';
import { useGameTimer } from '../hooks/useGameTimer';
import { getNumberQuizItem, generateRandomNumbers, NumberQuizItem } from '../data/numbers';

interface QuizProps {
  onBackToHome: () => void;
}

const Quiz: React.FC<QuizProps> = ({ onBackToHome }) => {
  const { gameState, updateGameState, addPlayer, players, clearLeaderboard } = useGame();

  // UI state
  const [showModeModal, setShowModeModal] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const [showTimeUp, setShowTimeUp] = useState(false);

  // Game mechanics state
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<MatchedPair[]>([]);
  const [floatingScores, setFloatingScores] = useState<FloatingScore[]>([]);
  const [incorrectDrop, setIncorrectDrop] = useState<string | null>(null);

  // Timer for timed mode
  const { timeLeft, resetTimer, isTimeUp } = useGameTimer(60, gameState.isPlaying && gameState.mode === 'timed' && !gameState.isPaused);

  // --- Move these to the top ---
  const validCategories = ['animals', 'colors', 'alphabet', 'numbers'];
  const validDifficulties = ['starter', 'mover', 'flyer'];

  const match = window.location.pathname.match(/quiz\/(\w+)/);
  const categoryId = match ? match[1] : '';
  const categoryData = (categories as any)[categoryId] || { name: 'Quiz', icon: '' };

  const getSafeCategory = () => {
    if (validCategories.includes(categoryId)) return categoryId;
    if (window.location.pathname.includes('alphabet')) return 'alphabet';
    if (window.location.pathname.includes('colors')) return 'colors';
    if (window.location.pathname.includes('animals')) return 'animals';
    return 'unknown';
  };
  const getSafeDifficulty = () => {
    if (validDifficulties.includes(gameState.difficulty)) return gameState.difficulty;
    if (window.location.search.includes('difficulty=starter')) return 'starter';
    if (window.location.search.includes('difficulty=mover')) return 'mover';
    if (window.location.search.includes('difficulty=flyer')) return 'flyer';
    return 'unknown';
  };
  // --- End move ---

  // --- Numbers state for stable sets ---
  const [numberQuizSets, setNumberQuizSets] = useState<any[][]>([]);
  const [numberQuizSetIndex, setNumberQuizSetIndex] = useState(0);
  useEffect(() => {
    if (categoryId === 'numbers') {
      let digitCount = 2; // starter = 2 digits
      if (gameState.difficulty === 'flyer') digitCount = 4;
      else if (gameState.difficulty === 'mover') digitCount = 3;
      // starter: 2 digits, mover: 3 digits, flyer: 4 digits
      const totalSets = 10;
      const allNumbers = [];
      for (let i = 0; i < totalSets; i++) {
        const numbers = generateRandomNumbers(3, digitCount);
        allNumbers.push(numbers.map(getNumberQuizItem));
      }
      setNumberQuizSets(allNumbers);
      setNumberQuizSetIndex(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId, gameState.difficulty, gameState.mode]);

  // --- Animal shuffle state for Challenge Mode ---
  const [shuffledAnimalPaths, setShuffledAnimalPaths] = useState<string[]>([]);

  let quizItems: any[] = [];
  if (categoryId === 'alphabet') {
    quizItems = alphabetItems;
  } else if (categoryId === 'colors') {
    if (gameState.mode === 'normal') {
      // Practice Mode: ordered sets
      if (gameState.difficulty === 'flyer') {
        quizItems = [
          ...starterColors,
          ...colorMoverSet,
          ...colorFlyerSet
        ];
      } else if (gameState.difficulty === 'mover') {
        quizItems = [
          ...starterColors,
          ...colorMoverSet
        ];
      } else {
        quizItems = starterColors;
      }
    } else {
      // Challenge Mode: randomized
      if (gameState.difficulty === 'flyer') {
        quizItems = shuffleArray(colorFlyerSet);
      } else if (gameState.difficulty === 'mover') {
        quizItems = shuffleArray(colorMoverSet);
      } else {
        quizItems = shuffleArray(starterColors);
      }
    }
  } else if (categoryId === 'numbers') {
    quizItems = numberQuizSets[numberQuizSetIndex] || [];
  } else {
    // Animals logic
    if (gameState.mode === 'normal') {
      // Practice Mode: ordered sets
      let starter = starterAnimals.map(imgPath => {
        const fileName = imgPath.split('/').pop() || '';
        const base = fileName.replace(/\.[^/.]+$/, '');
        let displayName = base.replace(/[-_][0-9]+$/, '').replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        if (/^stingray/i.test(base)) displayName = 'Stingray';
        else if (/^seahorse/i.test(base)) displayName = 'Seahorse';
        else if (/^panda-bear/i.test(base)) displayName = 'Panda';
        return {
          id: base,
          name: displayName,
          image: imgPath,
          category: '',
        };
      });
      let moverOnly = moverSet.filter(m => !starterAnimals.includes(m)).map(imgPath => {
        const fileName = imgPath.split('/').pop() || '';
        const base = fileName.replace(/\.[^/.]+$/, '');
        let displayName = base.replace(/[-_][0-9]+$/, '').replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        if (/^stingray/i.test(base)) displayName = 'Stingray';
        else if (/^seahorse/i.test(base)) displayName = 'Seahorse';
        else if (/^panda-bear/i.test(base)) displayName = 'Panda';
        return {
          id: base,
          name: displayName,
          image: imgPath,
          category: '',
        };
      });
      let flyerOnly = flyerSet.filter(f => !starterAnimals.includes(f) && !moverSet.includes(f)).map(imgPath => {
        const fileName = imgPath.split('/').pop() || '';
        const base = fileName.replace(/\.[^/.]+$/, '');
        let displayName = base.replace(/[-_][0-9]+$/, '').replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        if (/^stingray/i.test(base)) displayName = 'Stingray';
        else if (/^seahorse/i.test(base)) displayName = 'Seahorse';
        else if (/^panda-bear/i.test(base)) displayName = 'Panda';
        return {
          id: base,
          name: displayName,
          image: imgPath,
          category: '',
        };
      });
      if (gameState.difficulty === 'flyer') {
        quizItems = [...starter, ...moverOnly, ...flyerOnly];
      } else if (gameState.difficulty === 'mover') {
        quizItems = [...starter, ...moverOnly];
      } else {
        quizItems = starter;
      }
    } else {
      // Challenge Mode: use shuffledAnimalPaths from state
      quizItems = shuffledAnimalPaths.map(imgPath => {
        const fileName = imgPath.split('/').pop() || '';
        const base = fileName.replace(/\.[^/.]+$/, '');
        let displayName = base.replace(/[-_][0-9]+$/, '').replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        if (/^stingray/i.test(base)) displayName = 'Stingray';
        else if (/^seahorse/i.test(base)) displayName = 'Seahorse';
        else if (/^panda-bear/i.test(base)) displayName = 'Panda';
        return {
          id: base,
          name: displayName,
          image: imgPath,
          category: '',
        };
      });
    }
  }
  // Split into sets of 3
  let quizSets: any[][] = [];
  if (categoryId === 'numbers') {
    quizSets = numberQuizSets;
  } else {
    // Existing logic for other categories
    for (let i = 0; i < quizItems.length; i += 3) {
      quizSets.push(quizItems.slice(i, i + 3));
    }
    if (quizSets.length > 1 && quizSets[quizSets.length - 1].length < 3) {
      const last = quizSets.pop() ?? [];
      quizSets[quizSets.length - 1].push(...last);
    }
  }
  const [currentSet, setCurrentSet] = useState(0);
  const currentItems = quizSets[currentSet] || [];
  const isSetComplete = matchedPairs.length === currentItems.length && matchedPairs.length > 0;

  // Vietnamese voice state
  const [vnVoice, setVnVoice] = useState<SpeechSynthesisVoice | null>(null);

  // Audio enabled state
  const [audioEnabled, setAudioEnabled] = useState(true);

  // For Numbers: store a shuffled version of the current set's numbers for drop zones
  const [shuffledDropZones, setShuffledDropZones] = useState<any[]>([]);
  useEffect(() => {
    if (categoryId === 'numbers' && currentItems.length > 0) {
      setShuffledDropZones(shuffleArray(currentItems));
    }
  }, [categoryId, currentItems]);

  // Shuffle utility
  function shuffleArray<T>(array: T[]): T[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // Shuffle currentItems only once per set
  const [shuffledItems, setShuffledItems] = useState(() => shuffleArray(currentItems));
  useEffect(() => {
    setShuffledItems(shuffleArray(currentItems));
  }, [currentSet]);

  // Create drop zones for alphabet, animals, or numbers
  const dropZones = React.useMemo(() => {
    if (categoryId === 'alphabet') {
      return shuffledItems.map(item => ({
        id: item.id,
        label: item.id.toLowerCase(),
        color: 'yellow-400',
      }));
    } else if (categoryId === 'numbers') {
      return shuffledDropZones.map((item: any) => ({
        id: item.id,
        label: item.word,
        color: 'green-400',
      }));
    } else {
      return shuffledItems.map(item => ({
        id: item.name,
        label: item.name,
        color: 'blue-400',
      }));
    }
  }, [shuffledItems, categoryId, shuffledDropZones]);

  // Calculate combo multiplier
  const getComboMultiplier = (combo: number): number => {
    if (combo >= 12) return 5;
    if (combo >= 6) return 3;
    if (combo >= 3) return 2;
    return 1;
  };

  // Initialize game based on mode
  useEffect(() => {
    if (gameState.mode === 'timed' && !showCountdown && !gameState.isPlaying) {
      setShowCountdown(true);
    } else if (gameState.mode !== 'timed' && !gameState.isPlaying) {
      updateGameState({ isPlaying: true });
    }
  }, [gameState.mode, gameState.isPlaying, showCountdown, updateGameState]);

  // Start game after countdown for timed mode
  const handleCountdownComplete = useCallback(() => {
    setShowCountdown(false);
    // Small delay to ensure countdown is removed before starting game
    setTimeout(() => {
    updateGameState({ isPlaying: true });
    if (gameState.mode === 'timed') {
      resetTimer();
    }
    }, 100);
  }, [gameState.mode, updateGameState, resetTimer]);

  // Handle drag events
  const handleDragStart = useCallback((itemId: string) => {
    setDraggedItem(itemId);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggedItem(null);
    setHoveredZone(null);
  }, []);

  const handleDragOver = useCallback((zoneId: string) => {
    setHoveredZone(zoneId);
  }, []);

  const handleDragLeave = useCallback(() => {
    setHoveredZone(null);
  }, []);

  // Add floating score animation
  const addFloatingScore = useCallback((points: number, x: number, y: number) => {
    const id = Date.now().toString();
    setFloatingScores(prev => [...prev, { id, points, x, y }]);
    
    setTimeout(() => {
      setFloatingScores(prev => prev.filter(score => score.id !== id));
    }, 1500);
  }, []);

  // Handle drop
  const handleDrop = useCallback((zoneId: string, event: React.DragEvent) => {
    event.preventDefault();
    if (!draggedItem || !gameState.isPlaying) return;
    const item = currentItems.find(item => item.id === draggedItem);
    let isCorrect;
    if (categoryId === 'numbers') {
      isCorrect = item?.id === zoneId;
    } else {
      isCorrect = item?.name === zoneId;
    }
    
    if (isCorrect) {
      // Correct drop
      const multiplier = getComboMultiplier(gameState.combo + 1);
      const basePoints = 250;
      const totalPoints = basePoints * multiplier;
      
      updateGameState({
        score: gameState.score + totalPoints,
        combo: gameState.combo + 1
      });
      
      setMatchedPairs(prev => [...prev, { itemId: draggedItem, zoneId }]);
      
      // Add floating score animation
      const rect = event.currentTarget.getBoundingClientRect();
      addFloatingScore(totalPoints, rect.left + rect.width / 2, rect.top);
      
      // Play TTS audio for correct drop
      if (item) {
        if (categoryId === 'numbers') {
          speakWord(item.word);
        } else {
          speakWord(item.name);
        }
      }
      // Add time for correct drop in Practice mode
      if (gameState.mode === 'normal' && timerBarRef.current) {
        timerBarRef.current.addTime(5); // +5% time
      }
    } else {
      // Incorrect drop - enhanced effect
      const pointsLost = 100;
      updateGameState({
        score: Math.max(0, gameState.score - pointsLost),
        combo: 0
      });
      
      setIncorrectDrop(draggedItem);
      
      // Add negative floating score
      const rect = event.currentTarget.getBoundingClientRect();
      addFloatingScore(-pointsLost, rect.left + rect.width / 2, rect.top);
      
      setTimeout(() => {
        setIncorrectDrop(null);
      }, 1000); // Longer duration for better feedback
      // Subtract time for incorrect drop in Practice mode
      if (gameState.mode === 'normal' && timerBarRef.current) {
        timerBarRef.current.subtractTime(7); // -7% time
      }
    }
    
    setDraggedItem(null);
    setHoveredZone(null);
  }, [draggedItem, gameState.isPlaying, gameState.combo, gameState.score, currentItems, addFloatingScore, updateGameState, gameState.mode]);

  // Check if item is matched
  const isItemMatched = useCallback((itemId: string) => {
    return matchedPairs.some(pair => pair.itemId === itemId);
  }, [matchedPairs]);

  // Get matched item for zone
  const getMatchedItem = useCallback((zoneId: string) => {
    const pair = matchedPairs.find(pair => pair.zoneId === zoneId);
    return pair ? (currentItems.find(item => item.id === pair.itemId) || null) : null;
  }, [matchedPairs, currentItems]);

  // Set progression effect: advance to next set or show leaderboard
  useEffect(() => {
    if (isSetComplete) {
      const timer = setTimeout(() => {
        if (gameState.mode === 'timed') {
          setCurrentSet((currentSet + 1) % quizSets.length);
        } else {
          if (currentSet + 1 < quizSets.length) {
            setCurrentSet(currentSet + 1);
          } else {
            endGame();
          }
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isSetComplete, currentSet, gameState.mode, quizSets.length]);

  // Reset all relevant state when currentSet changes
  useEffect(() => {
    setMatchedPairs([]);
    setDraggedItem(null);
    setHoveredZone(null);
    setIncorrectDrop(null);
  }, [currentSet]);

  // Handle game over (time up)
  useEffect(() => {
    if (isTimeUp && gameState.isPlaying) {
      endGame();
    }
  }, [isTimeUp, gameState.isPlaying]);

  // End game
  const endGame = () => {
    updateGameState({ isPlaying: false });
    
    // Debug log
    console.log('PATH:', window.location.pathname);
    console.log('categoryId:', categoryId);
    console.log('gameState.difficulty:', gameState.difficulty);
    const safeCategory = getSafeCategory();
    const safeDifficulty = getSafeDifficulty();
    console.log('Saving player:', {
      name: gameState.playerName || 'Guest',
      score: gameState.score,
      mode: gameState.mode,
      timestamp: Date.now(),
      category: safeCategory,
      difficulty: safeDifficulty,
    });

    // Always add the most recent game result to the leaderboard
    const newPlayer: Player = {
      name: gameState.playerName || 'Guest',
      score: gameState.score,
      mode: gameState.mode,
      timestamp: Date.now(),
      category: safeCategory,
      difficulty: safeDifficulty,
      speed: typeof gameState.speed === 'string' ? gameState.speed : '',
    };
    addPlayer(newPlayer);
    setShowLeaderboard(true);
    if (gameState.mode === 'timed') {
      setShowCountdown(false);
    }
  };

  // Toggle pause (timed mode only)
  const togglePause = () => {
    if (gameState.mode === 'timed') {
      updateGameState({ isPaused: !gameState.isPaused });
    }
  };

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      const viVoice = availableVoices.find(v => v.lang.startsWith('vi')) || null;
      setVnVoice(viVoice);
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const speakWord = (word: string) => {
    if (!audioEnabled) return;
    const utterance = new window.SpeechSynthesisUtterance(word);
    if (vnVoice) {
      utterance.voice = vnVoice;
      utterance.lang = vnVoice.lang;
    }
    window.speechSynthesis.speak(utterance);
  };

  // Handle time up
  const handleTimeUp = useCallback(() => {
    if (gameState.isPlaying) {
      updateGameState({ isPlaying: false });
      setShowTimeUp(true);
    }
  }, [gameState.isPlaying, updateGameState]);

  // Handle time up modal close
  const handleTimeUpClose = useCallback(() => {
    setShowTimeUp(false);
    endGame();
  }, []);

  const timerBarRef = useRef<TimerBarHandle>(null);

  useEffect(() => {
    if (categoryId === 'animals' && gameState.mode === 'timed') {
      let animalPaths: string[] = [];
      if (gameState.difficulty === 'flyer') {
        animalPaths = flyerSet;
      } else if (gameState.difficulty === 'mover') {
        animalPaths = moverSet;
      } else {
        animalPaths = starterAnimals;
      }
      setShuffledAnimalPaths(shuffleArray(animalPaths));
    }
  }, [categoryId, gameState.difficulty, gameState.mode]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Floating Scores */}
      {floatingScores.map(floatingScore => (
        <ScoreAnimation
          key={floatingScore.id}
          points={floatingScore.points}
          x={floatingScore.x}
          y={floatingScore.y}
        />
      ))}

      {/* Header */}
      <div className="flex items-center justify-between p-6 max-w-7xl mx-auto">
        {/* Left side - Home and Title */}
        <div className="flex items-center gap-4">
          <button 
            onClick={onBackToHome}
            className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center hover:bg-blue-200 transition-colors"
          >
            <Home className="w-6 h-6 text-blue-600" />
          </button>
          <span className="text-4xl font-bold text-purple-600 flex items-center gap-2">
            <span className="text-3xl">{categoryData.icon}</span>
            {categoryData.name}
          </span>
        </div>

        {/* Right side - Stats and Controls */}
        <div className="flex items-center gap-4">
          <div className="bg-orange-100 text-orange-800 px-4 py-2 rounded-full font-semibold">
            Player: {gameState.playerName || 'Guest'}
          </div>
          <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-semibold">
            Set {currentSet + 1}
          </div>
          <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full font-semibold">
            Score {gameState.score.toLocaleString()}
          </div>
          {gameState.combo > 0 && (
            <div className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full font-semibold animate-pulse">
              Combo {gameState.combo}x
            </div>
          )}
          {gameState.mode === 'timed' && (
            <div className={`px-4 py-2 rounded-full font-semibold flex items-center gap-2 ${
              timeLeft <= 10 ? 'bg-red-100 text-red-800 animate-pulse' : 'bg-yellow-100 text-yellow-800'
            }`}>
              <Clock className="w-4 h-4" />
              {timeLeft}s
            </div>
          )}
          {gameState.mode === 'timed' && gameState.isPlaying && (
            <button
              onClick={togglePause}
              className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              {gameState.isPaused ? <Play className="w-6 h-6 text-gray-600" /> : <Pause className="w-6 h-6 text-gray-600" />}
            </button>
          )}
          <button
            onClick={() => setAudioEnabled(a => !a)}
            className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
            aria-label={audioEnabled ? 'Mute audio' : 'Unmute audio'}
          >
            {audioEnabled ? (
            <Volume2 className="w-6 h-6 text-gray-600" />
            ) : (
              <VolumeX className="w-6 h-6 text-gray-600" />
            )}
          </button>
          <button 
            onClick={() => setShowLeaderboard(true)}
            className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <Trophy className="w-6 h-6 text-gray-600" />
          </button>
          <button 
            onClick={() => setShowHelp(true)}
            className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <HelpCircle className="w-6 h-6 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Timer Bar - Only show in Practice mode with speed settings, below header */}
      {gameState.mode === 'normal' && gameState.isPlaying && !showLeaderboard && (
        <div className="max-w-7xl mx-auto px-6">
          <TimerBar
            ref={timerBarRef}
            speed={gameState.speed}
            isPlaying={gameState.isPlaying}
            isPaused={gameState.isPaused}
            onTimeUp={handleTimeUp}
          />
        </div>
      )}

      {/* Game Over Modal for Timed Mode */}
      {isTimeUp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 text-center shadow-2xl transform animate-in zoom-in duration-500">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Time's Up!</h2>
            <p className="text-gray-600 mb-6">
              Final Score: <span className="font-bold text-purple-600">{gameState.score.toLocaleString()}</span>
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLeaderboard(true)}
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                View Leaderboard
              </button>
              <button
                onClick={onBackToHome}
                className="flex-1 border-2 border-gray-200 text-gray-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
              >
                Play Again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Game Area - Hide when leaderboard is open */}
      {!showLeaderboard && (
      <div className="max-w-6xl mx-auto px-6">
        {/* Game Container */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-xl border border-white/20">
          
          {/* Mode Indicator */}
          <div className="text-center mb-8">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold ${
              gameState.mode === 'timed' 
                ? 'bg-orange-100 text-orange-800' 
                : 'bg-blue-100 text-blue-800'
            }`}>
              {gameState.mode === 'timed' ? <Clock className="w-4 h-4" /> : <Trophy className="w-4 h-4" />}
              {gameState.mode === 'timed' ? 'Challenge Mode' : 'Practice Mode'}
            </div>
          </div>

          {/* Animals Row */}
            <div className="flex flex-wrap justify-center gap-20 mt-6">
              {currentItems.map((item) => (
                categoryId === 'numbers' ? (
                  <DraggableItem
                    key={item.id}
                    item={item}
                    isDragging={draggedItem === item.id}
                    isMatched={isItemMatched(item.id)}
                    isIncorrect={incorrectDrop === item.id}
                    onDragStart={() => handleDragStart(item.id)}
                    onDragEnd={handleDragEnd}
                    customContent={
                      <span
                        className={`text-5xl font-bold font-sans ${['text-pink-500','text-blue-500','text-green-500','text-yellow-500','text-purple-500','text-orange-500','text-emerald-500','text-cyan-500','text-fuchsia-500','text-lime-500'][item.value % 10]}`}
                        style={{ fontFamily: 'Comic Sans MS, Comic Sans, cursive, sans-serif' }}
                      >
                        {item.value}
                      </span>
                    }
                  />
                ) : (
                  <DraggableItem
                    key={item.id}
                    item={item}
                    isDragging={draggedItem === item.id}
                    isMatched={isItemMatched(item.id)}
                    isIncorrect={incorrectDrop === item.id}
                    onDragStart={() => handleDragStart(item.id)}
                    onDragEnd={handleDragEnd}
                  />
                )
              ))}
            </div>

          {/* Drop Zones Row */}
            <div className="flex justify-center items-center gap-24 mt-20">
              {dropZones.map((zone) => (
                <DropZone
                  key={zone.id}
                  zone={zone}
                  isHovered={hoveredZone === zone.id}
                  matchedItem={getMatchedItem(zone.id)}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                />
              ))}
            </div>
        </div>
      </div>
      )}

      {/* Modals */}
      <GameModeModal
        isOpen={showModeModal}
        onSelectSettings={(settings) => {
          updateGameState(settings);
          setShowModeModal(false);
        }}
        onClose={() => setShowModeModal(false)}
      />

      <LeaderboardModal
        isOpen={showLeaderboard}
        onClose={() => {
          setShowLeaderboard(false);
          if (showTimeUp || gameState.mode === 'timed') {
            onBackToHome();
          }
        }}
        players={(() => {
          const currentResult = {
            name: gameState.playerName || 'Guest',
            score: gameState.score,
            mode: gameState.mode,
            timestamp: Date.now(),
            category: categoryId,
            difficulty: typeof gameState.difficulty === 'string' ? gameState.difficulty : '',
            speed: typeof gameState.speed === 'string' ? gameState.speed : '',
          };
          // Patch all players to ensure category, difficulty, and speed exist
          const patchedPlayers = players.map(p => ({
            ...p,
            category: typeof p.category === 'string' ? p.category : '',
            difficulty: typeof p.difficulty === 'string' ? p.difficulty : '',
            speed: typeof p.speed === 'string' ? p.speed : '',
          }));
          // Only add the current result if it's not already in the list
          const alreadyIncluded = patchedPlayers.some(
            p =>
              p.name === currentResult.name &&
              p.score === currentResult.score &&
              p.mode === currentResult.mode &&
              p.category === currentResult.category &&
              p.difficulty === currentResult.difficulty &&
              p.speed === currentResult.speed
          );
          const result = alreadyIncluded ? patchedPlayers : [currentResult, ...patchedPlayers];
          console.log('[LeaderboardModal] Players passed to leaderboard:', result);
          return result;
        })()}
        clearLeaderboard={clearLeaderboard}
      />

      <HelpModal
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
      />

      <TimeUpModal
        isOpen={showTimeUp}
        onClose={handleTimeUpClose}
        score={gameState.score}
      />

      {/* Only show countdown for timed mode if not showing leaderboard or time up */}
      {showCountdown && gameState.mode === 'timed' && !gameState.isPlaying && !showLeaderboard && !showTimeUp && (
        <CountdownTimer 
          onComplete={handleCountdownComplete} 
          mode={gameState.mode}
        />
      )}

      {/* Optional: Overlay when leaderboard is open */}
      {showLeaderboard && (
        <div className="fixed inset-0 bg-black/30 z-40 pointer-events-none" />
      )}
    </div>
  );
};

export default Quiz;