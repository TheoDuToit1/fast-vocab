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
import { flyerSet, starterAnimals, moverSet } from '../data/animals';
import { flyerColors } from '../data/colors';
import { MatchedPair, FloatingScore, Player } from '../types/game';
import { alphabetItems } from '../data/alphabet';
import { categories } from '../data/categories';
import { useGame } from '../context/GameContext';
import { useGameTimer } from '../hooks/useGameTimer';
import { generateRandomNumbers, getNumberQuizItem } from '../data/numbers';

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

  // --- Move timerBarRef above handleDrop to fix linter error ---
  const timerBarRef = useRef<TimerBarHandle>(null);

  // --- Add state for speed bonus ---
  const [recentCorrectTimestamps, setRecentCorrectTimestamps] = useState<number[]>([]);
  const [showSpeedBonus, setShowSpeedBonus] = useState(false);

  // --- Move these to the top ---
  const validCategories = ['animals', 'colors', 'alphabet', 'numbers'];

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

  // Add local state for all shuffled sets
  const [shuffledSets, setShuffledSets] = useState<any[][]>([]);

  // Build and shuffle all sets/items ONCE per game session
  useEffect(() => {
    // Build items array as before
    let items: any[] = [];
    if (categoryId === 'alphabet') {
      items = alphabetItems.map(item => ({ ...item, category: '', hex: undefined, image: item.image }));
    } else if (categoryId === 'colors') {
      const normalizeColor = (item: any) => ({ ...item, category: '', image: item.image ?? undefined, hex: item.hex ?? undefined });
      items = flyerColors.map(normalizeColor); // Use all for Practice Mode
    } else if (categoryId === 'numbers') {
      const nums = generateRandomNumbers(27, 1); // Use 1-digit numbers for demo
      items = nums.map(n => {
        const quizItem = getNumberQuizItem(n);
        return {
          id: quizItem.id,
          name: quizItem.word,
          value: quizItem.value,
          display: quizItem.value,
          category: '',
          hex: '#6366f1',
        };
      });
    } else if (categoryId === 'animals') {
      // Use correct set based on difficulty
      const difficulty = (gameState as any).difficulty || 'starter';
      const normalizeAnimal = (imgPath: string) => {
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
          hex: undefined,
        };
      };
      if (difficulty === 'starter') {
        items = starterAnimals.map(normalizeAnimal);
      } else if (difficulty === 'mover') {
        items = moverSet.map(normalizeAnimal);
      } else if (difficulty === 'flyer') {
        // Shuffle flyerSet before mapping
        const shuffledFlyer = shuffleArray(flyerSet);
        items = shuffledFlyer.map(normalizeAnimal);
      } else {
        items = flyerSet.map(normalizeAnimal); // fallback
      }
    } else {
      // fallback
      items = flyerSet.map(imgPath => ({ id: imgPath, name: imgPath, image: imgPath, category: '', hex: undefined }));
    }
    // Split into sets of 3
    const sets = [];
    for (let i = 0; i < items.length; i += 3) {
      sets.push(items.slice(i, i + 3));
    }
    if (sets.length > 1 && sets[sets.length - 1].length < 3) {
      const last = sets.pop() ?? [];
      sets[sets.length - 1].push(...last);
    }
    // Shuffle each set ONCE
    setShuffledSets(sets.map(set => shuffleArray(set)));
  }, [categoryId, gameState.mode, gameState.gameSessionId, (gameState as any).difficulty]);

  const [currentSet, setCurrentSet] = useState(0);
  const currentItems = shuffledSets[currentSet] || [];
  const isSetComplete = matchedPairs.length === currentItems.length && matchedPairs.length > 0;

  // Vietnamese voice state
  const [vnVoice, setVnVoice] = useState<SpeechSynthesisVoice | null>(null);

  // Audio enabled state
  const [audioEnabled, setAudioEnabled] = useState(true);

  // Add audio refs for correct/wrong/ticking sounds
  const correctAudioRef = useRef<HTMLAudioElement | null>(null);
  const wrongAudioRef = useRef<HTMLAudioElement | null>(null);
  const tickingAudioRef = useRef<HTMLAudioElement | null>(null);

  // Generate drop zones from the same shuffled currentItems array
  // (delete the entire dropZones declaration)

  // Calculate combo multiplier
  // (delete the entire getComboMultiplier function)

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

  // --- State for set-based bonus ---
  const [perfectSetsInARow, setPerfectSetsInARow] = useState(0);
  const [comboMultiplier, setComboMultiplier] = useState(1.0); // starts at 1.0, goes up to 2.5
  const [comboActive, setComboActive] = useState(false);
  const [currentSetMistake, setCurrentSetMistake] = useState(false);
  // Track total combos, correct, and wrong answers
  const [totalCombos, setTotalCombos] = useState(0);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [totalWrong, setTotalWrong] = useState(0);

  // --- Scoring logic ---
  const BASE_POINTS = 10; // Practice Mode only

  // --- Drop logic ---
  const handleDrop = useCallback((zoneId: string, event: React.DragEvent) => {
    event.preventDefault();
    if (!draggedItem || !gameState.isPlaying) return;
    const item = currentItems.find(item => item.id === draggedItem);
    const isCorrect = item?.name === zoneId;
    const now = Date.now();

    if (gameState.mode === 'timed') {
      // Challenge Mode: only count matches, no scoring
      if (isCorrect) {
        setMatchedPairs(prev => [...prev, { itemId: draggedItem, zoneId }]);
        setTotalCorrect(prev => prev + 1);
        playCorrectSound();
        if (item) setTimeout(() => speakWord(item.name), 600);
      } else {
        setIncorrectDrop(draggedItem);
        setTimeout(() => setIncorrectDrop(null), 1000);
        setTotalWrong(prev => prev + 1);
        playWrongSound();
      }
      setDraggedItem(null);
      setHoveredZone(null);
      return;
    }

    // Practice Mode scoring
    let points = BASE_POINTS;
    let speedBonusTriggered = false;
    let speedBonusPoints = 0;
    if (isCorrect) {
      setTotalCorrect(prev => prev + 1);
      // Speed bonus logic
      const updatedTimestamps = [...recentCorrectTimestamps, now].filter(ts => now - ts <= 2000);
      setRecentCorrectTimestamps(updatedTimestamps);
      // Combo multiplier logic
      if (comboActive) {
        points = Math.round(points * comboMultiplier);
      }
      if (updatedTimestamps.length >= 3) {
        setShowSpeedBonus(true);
        setTimeout(() => setShowSpeedBonus(false), 1200);
        setRecentCorrectTimestamps([]);
        // Multiply combo-multiplied points for this answer by 1.6 for speed bonus
        speedBonusPoints = Math.round(points * 1.6);
        updateGameState({ score: gameState.score + speedBonusPoints });
        speedBonusTriggered = true;
        // Floating score for speed bonus
        const rect = event.currentTarget.getBoundingClientRect();
        addFloatingScore(speedBonusPoints, rect.left + rect.width / 2, rect.top - 40);
      } else {
        updateGameState({ score: gameState.score + points });
        // Floating score for normal/correct answer
        const rect = event.currentTarget.getBoundingClientRect();
        addFloatingScore(points, rect.left + rect.width / 2, rect.top);
      }
      setMatchedPairs(prev => [...prev, { itemId: draggedItem, zoneId }]);
      setCurrentSetMistake(false);
      playCorrectSound();
      if (item) setTimeout(() => speakWord(item.name), 600);
      if (timerBarRef.current) timerBarRef.current.addTime(5);
    } else {
      setCurrentSetMistake(true);
      // Reset speed bonus
      setRecentCorrectTimestamps([]);
      setShowSpeedBonus(false);
      // Reset combo
      setComboActive(false);
      setComboMultiplier(1.0);
      setPerfectSetsInARow(0);
      setIncorrectDrop(draggedItem);
      setTimeout(() => setIncorrectDrop(null), 1000);
      setTotalWrong(prev => prev + 1);
      playWrongSound();
      if (timerBarRef.current) timerBarRef.current.subtractTime(7);
    }
    setDraggedItem(null);
    setHoveredZone(null);
  }, [draggedItem, gameState.isPlaying, gameState.score, currentItems, addFloatingScore, updateGameState, gameState.mode, timerBarRef, recentCorrectTimestamps, comboActive, comboMultiplier]);

  // --- Set completion effect: update perfect set streak and combo multiplier ---
  useEffect(() => {
    if (isSetComplete && gameState.mode !== 'timed') {
      if (!currentSetMistake) {
        setPerfectSetsInARow(prev => {
          const newStreak = prev + 1;
          if (newStreak === 3) {
            setComboActive(true);
            setComboMultiplier(1.5);
            setTotalCombos(prev => prev + 1);
          } else if (newStreak > 3) {
            setComboActive(true);
            setComboMultiplier(prevMultiplier => Math.min(prevMultiplier + 0.5, 2.5));
            setTotalCombos(prev => prev + 1);
          }
          return newStreak;
        });
      } else {
        setPerfectSetsInARow(0);
        setComboActive(false);
        setComboMultiplier(1.0);
      }
      setCurrentSetMistake(false);
    }
  }, [isSetComplete, currentSetMistake, gameState.mode]);

  // --- Reset perfect set streak on set change ---
  useEffect(() => {
    setMatchedPairs([]);
    setDraggedItem(null);
    setHoveredZone(null);
    setIncorrectDrop(null);
    setCurrentSetMistake(false);
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
    const safeCategory = getSafeCategory();
    console.log('Saving player:', {
      name: gameState.playerName || 'Guest',
      score: gameState.mode === 'timed' ? challengeCorrectTotal : gameState.score,
      mode: gameState.mode,
      timestamp: Date.now(),
      category: safeCategory,
    });

    // Always add the most recent game result to the leaderboard
    const newPlayer: Player = {
      name: gameState.playerName || 'Guest',
      score: gameState.mode === 'timed' ? challengeCorrectTotal : gameState.score,
      mode: gameState.mode,
      timestamp: Date.now(),
      category: safeCategory,
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

  // Fisher-Yates shuffle algorithm
  function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  // Add local state for independently shuffled drop zones
  const [shuffledDropZones, setShuffledDropZones] = useState<any[]>([]);

  // Shuffle drop zones independently whenever currentItems changes
  useEffect(() => {
    setShuffledDropZones(shuffleArray(currentItems));
  }, [currentItems]);

  // Define isItemMatched and getMatchedItem as before
  const isItemMatched = useCallback((itemId: string) => {
    return matchedPairs.some(pair => pair.itemId === itemId);
  }, [matchedPairs]);
  const getMatchedItem = useCallback((zoneId: string) => {
    const pair = matchedPairs.find(pair => pair.zoneId === zoneId);
    return pair ? (currentItems.find(item => item.id === pair.itemId) || null) : null;
  }, [matchedPairs, currentItems]);

  // Advance to next set when current set is complete
  useEffect(() => {
    if (isSetComplete && currentSet < shuffledSets.length - 1) {
      setTimeout(() => {
        setCurrentSet(currentSet + 1);
        setMatchedPairs([]);
        setDraggedItem(null);
        setHoveredZone(null);
        setIncorrectDrop(null);
        setCurrentSetMistake(false);
      }, 1000); // 1 second delay for feedback
    }
  }, [isSetComplete, currentSet, shuffledSets.length]);

  // Add state for challenge mode stats
  const [challengeCorrectTotal, setChallengeCorrectTotal] = useState(0);
  const [challengeSetsCompleted, setChallengeSetsCompleted] = useState(0);

  // Track correct answers in challenge mode
  useEffect(() => {
    if (gameState.mode === 'timed') {
      setChallengeCorrectTotal(0);
      setChallengeSetsCompleted(0);
    }
  }, [gameState.mode, gameState.gameSessionId]);

  useEffect(() => {
    if (gameState.mode === 'timed' && isSetComplete) {
      setChallengeSetsCompleted(currentSet + 1);
      setChallengeCorrectTotal(prev => prev + matchedPairs.length);
    }
  }, [isSetComplete, gameState.mode, currentSet, matchedPairs.length]);

  // Play correct sound
  const playCorrectSound = useCallback(() => {
    if (audioEnabled && correctAudioRef.current) {
      correctAudioRef.current.currentTime = 0;
      correctAudioRef.current.volume = 0.4;
      correctAudioRef.current.play();
    }
  }, [audioEnabled]);
  // Play wrong sound
  const playWrongSound = useCallback(() => {
    if (audioEnabled && wrongAudioRef.current) {
      wrongAudioRef.current.currentTime = 0;
      wrongAudioRef.current.volume = 0.4;
      wrongAudioRef.current.play();
    }
  }, [audioEnabled]);

  // Track TimerBar percent for practice mode
  const [timerBarPercent, setTimerBarPercent] = useState(100);

  // Play ticking sound (loop)
  useEffect(() => {
    const shouldTick = (
      (gameState.mode === 'timed' && timeLeft <= 10) ||
      (gameState.mode === 'normal' && timerBarPercent <= 10)
    ) && gameState.isPlaying && !gameState.isPaused && audioEnabled;
    if (shouldTick) {
      if (tickingAudioRef.current) {
        tickingAudioRef.current.volume = 0.7;
        tickingAudioRef.current.loop = true;
        tickingAudioRef.current.playbackRate = 1.0;
        if (tickingAudioRef.current.paused) {
          tickingAudioRef.current.currentTime = 0;
          tickingAudioRef.current.play();
          console.log('Ticking sound started');
        }
      }
    } else {
      if (tickingAudioRef.current) {
        if (!tickingAudioRef.current.paused) {
          tickingAudioRef.current.pause();
          tickingAudioRef.current.currentTime = 0;
          console.log('Ticking sound stopped');
        }
      }
    }
  }, [gameState.mode, gameState.isPlaying, gameState.isPaused, timeLeft, audioEnabled, timerBarPercent]);

  // Stop ticking sound when time is up or Time's Up modal is shown
  useEffect(() => {
    if (isTimeUp || showTimeUp) {
      if (tickingAudioRef.current) {
        tickingAudioRef.current.pause();
        tickingAudioRef.current.currentTime = 0;
        console.log('Ticking sound stopped (time up/modal)');
      }
    }
  }, [isTimeUp, showTimeUp]);

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
            {gameState.mode === 'timed' ? (
              <>Sets: {challengeSetsCompleted}</>
            ) : (
              <>Set {currentSet + 1}</>
            )}
          </div>
          {gameState.mode === 'timed' ? (
            <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full font-semibold">
              Correct: {challengeCorrectTotal}
            </div>
          ) : (
          <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full font-semibold">
            Score {gameState.score.toLocaleString()}
          </div>
          )}
          {/* Combo Indicator */}
          {comboActive && (
            <div className="bg-gradient-to-r from-purple-400 to-pink-400 text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg flex items-center gap-2 animate-pulse border-2 border-white">
              <span role="img" aria-label="combo">🔥</span> Combo x{comboMultiplier.toFixed(1)}
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
            isPlaying={gameState.isPlaying}
            isPaused={gameState.isPaused}
            onTimeUp={handleTimeUp}
            onPercentChange={setTimerBarPercent}
          />
        </div>
      )}

      {/* Game Over Modal for Timed Mode */}
      {isTimeUp && gameState.mode === 'timed' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 text-center shadow-2xl transform animate-in zoom-in duration-500">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Time's Up!</h2>
            <p className="text-gray-600 mb-2">
              <span className="font-bold text-blue-600">Sets Completed: {challengeSetsCompleted}</span>
            </p>
            <p className="text-gray-600 mb-6">
              <span className="font-bold text-green-600">Correct Answers: {challengeCorrectTotal}</span>
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
            <div className="flex flex-wrap justify-center gap-8 mt-6">
              {currentItems.map((item, idx) => (
              <DraggableItem
                key={item.id + '-' + idx}
                item={item}
                isDragging={draggedItem === item.id}
                isMatched={isItemMatched(item.id)}
                isIncorrect={incorrectDrop === item.id}
                  onDragStart={() => handleDragStart(item.id)}
                onDragEnd={handleDragEnd}
              />
            ))}
          </div>

          {/* Drop Zones Row */}
            <div className="flex justify-center items-center gap-16 mt-16">
              {shuffledDropZones.map((item, idx) => (
              <DropZone
                key={item.id + '-' + idx}
                zone={{
                  id: categoryId === 'alphabet' ? item.id : item.name,
                  label: categoryId === 'alphabet' ? item.id.toLowerCase() : item.name,
                  color: categoryId === 'alphabet' ? 'yellow-400' : 'blue-400',
                }}
                isHovered={hoveredZone === (categoryId === 'alphabet' ? item.id : item.name)}
                matchedItem={getMatchedItem(categoryId === 'alphabet' ? item.id : item.name)}
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
        onBackToCategories={onBackToHome}
        players={(() => {
          const currentResult = {
            name: gameState.playerName || 'Guest',
            score: gameState.mode === 'timed' ? challengeCorrectTotal : gameState.score,
            mode: gameState.mode,
            timestamp: Date.now(),
            category: categoryId,
          };
          // Patch all players to ensure category exists
          const patchedPlayers = players.map(p => ({
            ...p,
            category: typeof p.category === 'string' ? p.category : '',
          }));
          // Only add the current result if it's not already in the list
          const alreadyIncluded = patchedPlayers.some(
            p =>
              p.name === currentResult.name &&
              p.score === currentResult.score &&
              p.mode === currentResult.mode &&
              p.category === currentResult.category
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
        combos={totalCombos}
        correct={totalCorrect}
        wrong={totalWrong}
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

      {/* In the UI, show speed bonus flash --- */}
      {showSpeedBonus && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="text-center animate-in zoom-in duration-300">
            <div className="inline-flex items-center gap-4 px-12 py-6 rounded-3xl bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-2xl border-4 border-white transform animate-pulse scale-110">
              <span className="text-6xl font-black tracking-wider">⚡ Speed Bonus!</span>
            </div>
          </div>
        </div>
      )}

      {/* Audio elements for correct/wrong/ticking sounds */}
      <audio ref={correctAudioRef} src="/correct-6033.mp3" preload="auto" />
      <audio ref={wrongAudioRef} src="/negative_beeps-6008.mp3" preload="auto" />
      <audio ref={tickingAudioRef} src="/clock-ticking-sound-effect-240503.mp3" preload="auto" />
    </div>
  );
};

export default Quiz;