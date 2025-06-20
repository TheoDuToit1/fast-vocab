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
import { animalsData } from '../data/animals';
import { flyerColors } from '../data/colors';
import { MatchedPair, FloatingScore, Player, QuizItem } from '../types/game';
import { alphabetData } from '../data/alphabet';
import { clothesData } from '../data/clothes';
import { foodData } from '../data/food';
import { categories } from '../data/categories';
import { useGame } from '../context/GameContext';
import { useGameTimer } from '../hooks/useGameTimer';
import { generateRandomNumbers, getNumberQuizItem, numbersData } from '../data/numbers';

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
  const validCategories = ['animals', 'colors', 'alphabet', 'numbers', 'clothes', 'food'];

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

  // At the top of the component, after useState declarations:
  const colorPoolRef = useRef<any[]>([]);
  const animalPoolRef = useRef<any[]>([]);

  // Build and shuffle all sets/items ONCE per game session
  useEffect(() => {
    // --- Rebuild: treat alphabet exactly like animals ---
    let items: any[] = [];
    if (categoryId === 'alphabet') {
      // Use the same logic as animals for building pool, sets, and shuffling
      const normalizeAlphabet = (item: { name: string, image: string }, i: number) => ({
        id: item.name.toLowerCase() + '-' + i,
        name: item.name,
        image: item.image,
        category: 'alphabet',
        hex: undefined,
      });
      items = alphabetData.starter.map(normalizeAlphabet);
      console.log('[ALPHABET DEBUG] items:', items);
    } else if (categoryId === 'animals') {
      const difficulty = (gameState as any).difficulty || 'starter';
      const normalizeAnimal = (imgPath: string) => {
        const fileName = imgPath.split('/').pop() || '';
        const base = fileName.replace(/\.[^/.]+$/, '');
        let displayName = base.replace(/[-_][0-9]+$/, '').replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        if (imgPath.includes('parrot-1864474.png')) displayName = 'Bird';
        else if (/^stingray/i.test(base)) displayName = 'Stingray';
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
        items = animalsData.starter.map(normalizeAnimal);
      } else if (difficulty === 'mover') {
        items = [...animalsData.starter, ...animalsData.mover].map(normalizeAnimal);
      } else if (difficulty === 'flyer') {
        const combinedFlyerSet = [...animalsData.starter, ...animalsData.mover, ...animalsData.flyer];
        const shuffledFlyer = shuffleArray(combinedFlyerSet);
        items = shuffledFlyer.map(normalizeAnimal);
      } else {
        items = [...animalsData.starter, ...animalsData.mover, ...animalsData.flyer].map(normalizeAnimal); // fallback
      }
    } else if (categoryId === 'colors') {
      const difficulty = (gameState as any).difficulty || 'starter';
      // Define color sets
      const starterColors = [
        { name: 'Red', hex: '#FF0000' },
        { name: 'Blue', hex: '#0000FF' },
        { name: 'Yellow', hex: '#FFFF00' },
        { name: 'Green', hex: '#008000' },
        { name: 'Orange', hex: '#FFA500' },
        { name: 'Purple', hex: '#800080' },
        { name: 'Pink', hex: '#FFC0CB' },
        { name: 'Brown', hex: '#A52A2A' },
        { name: 'Black', hex: '#000000' },
        { name: 'White', hex: '#FFFFFF' },
      ];
      const moverColors = [
        { name: 'Gray', hex: '#808080' },
        { name: 'Cyan', hex: '#00FFFF' },
        { name: 'Magenta', hex: '#FF00FF' },
        { name: 'Lime', hex: '#00FF00' },
        { name: 'Navy', hex: '#000080' },
        { name: 'Teal', hex: '#008080' },
        { name: 'Maroon', hex: '#800000' },
        { name: 'Olive', hex: '#808000' },
        { name: 'Gold', hex: '#FFD700' },
        { name: 'Silver', hex: '#C0C0C0' },
      ];
      const flyerColors = [
        { name: 'Violet', hex: '#EE82EE' },
        { name: 'Indigo', hex: '#4B0082' },
        { name: 'Coral', hex: '#FF7F50' },
        { name: 'Turquoise', hex: '#40E0D0' },
        { name: 'Beige', hex: '#F5F5DC' },
        { name: 'Peach', hex: '#FFDAB9' },
        { name: 'Mint', hex: '#98FF98' },
        { name: 'Lavender', hex: '#E6E6FA' },
        { name: 'Aqua', hex: '#00FFFF' },
        { name: 'Chocolate', hex: '#D2691E' },
      ];
      let colorPool = [];
      if (difficulty === 'starter') {
        colorPool = starterColors;
      } else if (difficulty === 'mover') {
        colorPool = [...starterColors, ...moverColors];
      } else {
        colorPool = [...starterColors, ...moverColors, ...flyerColors];
      }
      colorPool = colorPool.map(c => ({ ...c, id: c.name.toLowerCase(), name: c.name, image: c.hex, category: '' }));
      colorPoolRef.current = colorPool;
      items = colorPool;
    } else if (categoryId === 'numbers') {
      // Use the same number generation as Study Mode for the current difficulty
      let digits = 2;
      const difficulty = (gameState as any).difficulty || 'starter';
      if (difficulty === 'flyer') digits = 4;
      else if (difficulty === 'mover') digits = 3;
      else digits = 2;
      const nums = generateRandomNumbers(40, digits);
      items = nums.map((n, i) => {
        const quizItem = getNumberQuizItem(n);
        return {
          id: quizItem.id + '-' + i,
          name: quizItem.word, // word for drop zone
          display: quizItem.value, // numeral for draggable
          value: quizItem.value,
          hex: '#6366f1',
        };
      });
      items = items.filter(item => item.id && item.name);
    } else if (categoryId === 'clothes') {
      const difficulty = (gameState as any).difficulty || 'starter';
      const normalizeClothes = (item: { name: string, image: string }) => ({
        ...item,
        id: item.name.toLowerCase().replace(/\s+/g, '-'),
        category: '',
        hex: undefined,
      });

      if (difficulty === 'starter') {
        items = clothesData.starter.map(normalizeClothes);
      } else if (difficulty === 'mover') {
        items = [...clothesData.starter, ...clothesData.mover].map(normalizeClothes);
      } else if (difficulty === 'flyer') {
        const combinedFlyerSet = [...clothesData.starter, ...clothesData.mover, ...clothesData.flyer];
        const shuffledFlyer = shuffleArray(combinedFlyerSet);
        items = shuffledFlyer.map(normalizeClothes);
      } else {
        items = [...clothesData.starter, ...clothesData.mover, ...clothesData.flyer].map(normalizeClothes);
      }
    } else if (categoryId === 'food') {
      const difficulty = (gameState as any).difficulty || 'starter';
      const normalizeFood = (item: { name: string, image: string }) => ({
        ...item,
        id: item.name.toLowerCase().replace(/\s+/g, '-'),
          category: '',
        hex: undefined,
      });

      if (difficulty === 'starter') {
        items = foodData.starter.map(normalizeFood);
      } else if (difficulty === 'mover') {
        items = [...foodData.starter, ...foodData.mover].map(normalizeFood);
      } else if (difficulty === 'flyer') {
        const combinedFlyerSet = [...foodData.starter, ...foodData.mover, ...foodData.flyer];
        const shuffledFlyer = shuffleArray(combinedFlyerSet);
        items = shuffledFlyer.map(normalizeFood);
      } else {
        items = [...foodData.starter, ...foodData.mover, ...foodData.flyer].map(normalizeFood);
      }
    } else {
      // fallback
      items = [...animalsData.starter, ...animalsData.mover, ...animalsData.flyer].map(imgPath => ({ id: imgPath, name: imgPath, image: imgPath, category: '', hex: undefined }));
    }
    // For colors, use a pool of 10/20/30, but sets of 3
    let setSize = 3;
    let colorPool: any[] = [];
    if (categoryId === 'colors') {
      const difficulty = (gameState as any).difficulty || 'starter';
      const starterColors = [
        { name: 'Red', hex: '#FF0000' },
        { name: 'Blue', hex: '#0000FF' },
        { name: 'Yellow', hex: '#FFFF00' },
        { name: 'Green', hex: '#008000' },
        { name: 'Orange', hex: '#FFA500' },
        { name: 'Purple', hex: '#800080' },
        { name: 'Pink', hex: '#FFC0CB' },
        { name: 'Brown', hex: '#A52A2A' },
        { name: 'Black', hex: '#000000' },
        { name: 'White', hex: '#FFFFFF' },
      ];
      const moverColors = [
        { name: 'Gray', hex: '#808080' },
        { name: 'Cyan', hex: '#00FFFF' },
        { name: 'Magenta', hex: '#FF00FF' },
        { name: 'Lime', hex: '#00FF00' },
        { name: 'Navy', hex: '#000080' },
        { name: 'Teal', hex: '#008080' },
        { name: 'Maroon', hex: '#800000' },
        { name: 'Olive', hex: '#808000' },
        { name: 'Gold', hex: '#FFD700' },
        { name: 'Silver', hex: '#C0C0C0' },
      ];
      const flyerColors = [
        { name: 'Violet', hex: '#EE82EE' },
        { name: 'Indigo', hex: '#4B0082' },
        { name: 'Coral', hex: '#FF7F50' },
        { name: 'Turquoise', hex: '#40E0D0' },
        { name: 'Beige', hex: '#F5F5DC' },
        { name: 'Peach', hex: '#FFDAB9' },
        { name: 'Mint', hex: '#98FF98' },
        { name: 'Lavender', hex: '#E6E6FA' },
        { name: 'Aqua', hex: '#00FFFF' },
        { name: 'Chocolate', hex: '#D2691E' },
      ];
      if (difficulty === 'starter') {
        colorPool = starterColors;
      } else if (difficulty === 'mover') {
        colorPool = [...starterColors, ...moverColors];
      } else {
        colorPool = [...starterColors, ...moverColors, ...flyerColors];
      }
      colorPool = colorPool.map(c => ({ ...c, id: c.name.toLowerCase(), name: c.name, image: c.hex, category: '' }));
      items = colorPool;
    }
    // Split into sets of 3
    const sets = [];
    for (let i = 0; i < items.length; i += setSize) {
      sets.push(items.slice(i, i + setSize));
    }
    if (sets.length > 1 && sets[sets.length - 1].length < setSize) {
      const last = sets.pop() ?? [];
      sets[sets.length - 1].push(...last);
    }
    setShuffledSets(sets.map(set => shuffleArray(set)));
  }, [categoryId, gameState.mode, gameState.gameSessionId]);

  const [currentSet, setCurrentSet] = useState(0);
  const currentItems = shuffledSets[currentSet] || [];
  const currentItemsRef = useRef<any[]>(currentItems);
  currentItemsRef.current = currentItems; // Always update on render
  const isSetComplete = matchedPairs.length === currentItems.length && matchedPairs.length > 0;

  // Vietnamese voice state
  const [vnVoice, setVnVoice] = useState<SpeechSynthesisVoice | null>(null);

  // Audio enabled state
  const [audioEnabled, setAudioEnabled] = useState(true);

  // Add audio refs for correct/wrong/ticking sounds
  const correctAudioRef = useRef<HTMLAudioElement | null>(null);
  const wrongAudioRef = useRef<HTMLAudioElement | null>(null);
  const tickingAudioRef = useRef<HTMLAudioElement | null>(null);

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

  // Use a ref for draggedItem to avoid stale closure issues
  const draggedItemRef = useRef<string | null>(null);

  const handleDragStart = useCallback((itemId: string) => {
    setDraggedItem(itemId);
    draggedItemRef.current = itemId;
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggedItem(null);
    draggedItemRef.current = null;
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
  const [comboMultiplier, setComboMultiplier] = useState(1.0); // starts at 1.0, goes up to 2.5
  const [comboActive, setComboActive] = useState(false);
  const [currentSetMistake, setCurrentSetMistake] = useState(false);
  // Track total combos, correct, and wrong answers
  const [totalCombos, setTotalCombos] = useState(0);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [totalWrong, setTotalWrong] = useState(0);

  // --- Scoring logic ---
  const BASE_POINTS = 100; // Practice Mode only

  // --- Tap-to-match state for mobile ---
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

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
  // Speak word function (move above handleItemDrop)
  const speakWord = (word: string) => {
    if (!audioEnabled) return;
    window.speechSynthesis.cancel(); // Stop any current speech
    const utterance = new window.SpeechSynthesisUtterance(word);
    if (vnVoice) {
      utterance.voice = vnVoice;
      utterance.lang = vnVoice.lang;
    }
    window.speechSynthesis.speak(utterance);
  };

  // --- Core drop logic ---
  const handleItemDrop = useCallback((itemId: string, zoneId: string, event?: any) => {
    if (!itemId || !gameState.isPlaying) return;
    const item = currentItemsRef.current.find((item: QuizItem) => item.id === itemId);
    const isCorrect = item?.id === zoneId;
    if (!item) {
      setTimeout(() => setDropWarning(null), 2000);
      return;
    }
    if (!currentItemsRef.current.some(i => i.id === zoneId)) {
      setTimeout(() => setDropWarning(null), 2000);
      return;
    }
    const now = Date.now();

    const speakQuizWord = (item: QuizItem) => {
      if (!item) return;
      if (categoryId === 'alphabet') {
        speakWord(item.name);
      } else {
        speakWord(item.name);
      }
    };

    const advanceSet = () => {
      setIsSliding(true);
      setTimeout(() => {
        let nextSet = currentSet + 1;
        if (nextSet >= shuffledSets.length) {
          const allItems = shuffledSets.flat();
          const reshuffled = shuffleArray(allItems).slice(0, 3);
          setShuffledSets([reshuffled]);
          setCurrentSet(0);
        } else {
          setCurrentSet(nextSet);
        }
        setMatchedPairs([]);
        setDraggedItem(null);
        setHoveredZone(null);
        setIncorrectDrop(null);
        setCurrentSetMistake(false);
        setTimeout(() => setIsSliding(false), 400); // 400ms animation
      }, 10); // slight delay to allow exit animation if needed
    };

    if (isCorrect) {
      const points = BASE_POINTS * comboMultiplier;
      updateGameState(prev => ({ score: prev.score + points }));
      // Practice Mode: Add time for correct answer
      if (gameState.mode === 'normal' && timerBarRef.current) {
        timerBarRef.current.addTime(2);
      }
      setMatchedPairs(prev => {
        const updated = [...prev, { itemId, zoneId }];
        if (updated.length === currentItemsRef.current.length) {
          setTimeout(advanceSet, 1200);
        }
        return updated;
      });
      setTotalCorrect(prev => prev + 1);
      playCorrectSound();
      if (item) setTimeout(() => speakQuizWord(item), 600);
      const rect = event?.currentTarget?.getBoundingClientRect?.() || { left: 0, top: 0, width: 0, height: 0 };
      addFloatingScore(points, rect.left + rect.width / 2, rect.top);
    } else {
      setIncorrectDrop(itemId);
      setCurrentSetMistake(true);
      // Practice Mode: Subtract time for wrong answer
      if (gameState.mode === 'normal' && timerBarRef.current) {
        timerBarRef.current.subtractTime(3);
      }
      const rect = event?.currentTarget?.getBoundingClientRect?.() || { left: 0, top: 0, width: 0, height: 0 };
      addFloatingScore(-50, rect.left + rect.width / 2, rect.top);
      setTimeout(() => setIncorrectDrop(null), 1000);
      setTotalWrong(prev => prev + 1);
      playWrongSound();
    }
    setDraggedItem(null);
    setHoveredZone(null);
    return;
  }, [gameState.isPlaying, currentSet, shuffledSets, categoryId, addFloatingScore, playCorrectSound, playWrongSound, speakWord]);

  // --- Drop logic for drag-and-drop ---
  const handleDrop = useCallback((zoneId: string, event: React.DragEvent) => {
    event.preventDefault();
    if (!draggedItemRef.current || !gameState.isPlaying) return;
    handleItemDrop(draggedItemRef.current, zoneId, event);
  }, [gameState.isPlaying, handleItemDrop]);

  // --- Tap-to-drop handler ---
  const handleZoneTap = useCallback((zoneId: string) => {
    if (!gameState.isPlaying || !selectedItemId) return;
    // Use the same drop logic
    handleItemDrop(selectedItemId, zoneId, { currentTarget: { getBoundingClientRect: () => ({ left: 0, top: 0, width: 0, height: 0 }) } });
    setSelectedItemId(null);
  }, [gameState.isPlaying, selectedItemId, handleItemDrop]);

  // --- Set completion effect: update perfect set streak and combo multiplier ---
  useEffect(() => {
    if (isSetComplete && gameState.mode !== 'timed') {
      if (!currentSetMistake) {
        setComboActive(true);
        setComboMultiplier(1.5);
        setTotalCombos(prev => prev + 1);
        } else {
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
      const preferredNames = [
        'Google US English',
        'Microsoft Zira Desktop - English (United States)',
        'Samantha'
      ];
      let enVoice = availableVoices.find(v => preferredNames.includes(v.name));
      if (!enVoice) {
        enVoice = availableVoices.find(v => v.lang.startsWith('en'));
      }
      setVnVoice(enVoice || null);
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

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
        }
      }
    } else {
      if (tickingAudioRef.current) {
        if (!tickingAudioRef.current.paused) {
          tickingAudioRef.current.pause();
          tickingAudioRef.current.currentTime = 0;
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
      }
    }
  }, [isTimeUp, showTimeUp]);

  // DEBUG: Run-once guard for numbers infinite set effect
  let numbersInfiniteSetRanOnce = false;

  // --- Infinite Loop Logic ---
  useEffect(() => {
    if (isSetComplete && (gameState.mode === 'normal' || gameState.mode === 'timed')) {
      if (categoryId === 'numbers' && numbersInfiniteSetRanOnce) {
        return;
      }
      setTimeout(() => {
        let pool = [];
        if (categoryId === 'colors') pool = colorPoolRef.current;
        else if (categoryId === 'animals') pool = animalPoolRef.current;
        else if (categoryId === 'alphabet') pool = alphabetData.starter.map((item, i) => ({ ...item, id: item.name.toLowerCase() + '-' + i }));
        else if (categoryId === 'numbers') {
          // Use numbersData.starter as the pool, just like animals
          pool = numbersData.starter.map((item, i) => ({
            ...item,
            id: item.name.toLowerCase().replace(/\s/g, '-') + '-' + i,
            display: parseInt(item.name, 10).toString() === 'NaN' ? item.name : parseInt(item.name, 10), // show the number as text if possible
            image: undefined // Remove image so DraggableItem uses display
          }));
          pool = pool.filter(item => item.id && item.name);
          // Split into sets of 3
          const setSize = 3;
          const sets = [];
          for (let i = 0; i < pool.length; i += setSize) {
            sets.push(pool.slice(i, i + setSize));
          }
          if (sets.length > 1 && sets[sets.length - 1].length < setSize) {
            const last = sets.pop() ?? [];
            sets[sets.length - 1].push(...last);
          }
          // If at the last set, reshuffle and start over
          if (currentSet + 1 >= sets.length) {
            const reshuffledSets = shuffleArray(sets.flat()).reduce<any[][]>((acc, item, idx) => {
              const setIdx = Math.floor(idx / setSize);
              if (!acc[setIdx]) acc[setIdx] = [];
              acc[setIdx].push(item);
              return acc;
            }, []);
            setShuffledSets(reshuffledSets);
            setCurrentSet(0);
          } else {
            setCurrentSet(currentSet + 1);
          }
          setMatchedPairs([]);
          setDraggedItem(null);
          setHoveredZone(null);
          setIncorrectDrop(null);
          setCurrentSetMistake(false);
          return;
        }
        else if (categoryId === 'clothes') pool = clothesData.starter.map((item, i) => ({ ...item, id: item.name.toLowerCase().replace(/\s/g, '-') + '-' + i }));
        else if (categoryId === 'food') pool = foodData.starter.map((item, i) => ({ ...item, id: item.name.toLowerCase().replace(/\s/g, '-') + '-' + i }));
        if (!pool || pool.length === 0) {
          return; // GUARD: Don't update state if pool is empty
        }
        const reshuffled = shuffleArray(pool).slice(0, 3);
        setShuffledSets([reshuffled]);
        setCurrentSet(0);
        setMatchedPairs([]);
        setDraggedItem(null);
        setHoveredZone(null);
        setIncorrectDrop(null);
        setCurrentSetMistake(false);
      }, 1200); // Increased delay for feedback in Challenge Mode
    }
  }, [isSetComplete, gameState.mode, categoryId, currentSet]);

  // Helper: detect mobile (simple check)
  const isMobile = typeof window !== 'undefined' && /Mobi|Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);

  // --- Tap-to-select handler ---
  const handleItemTap = useCallback((itemId: string) => {
    if (!gameState.isPlaying) return;
    setSelectedItemId(itemId);
  }, [gameState.isPlaying]);

  // Add drop warning state and UI
  const [dropWarning, setDropWarning] = useState<string | null>(null);

  const [isSliding, setIsSliding] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Audio elements for sound effects */}
      <audio ref={correctAudioRef} src="/correct-6033.mp3" preload="auto" />
      <audio ref={wrongAudioRef} src="/negative_beeps-6008.mp3" preload="auto" />
      <audio ref={tickingAudioRef} src="/clock-ticking-sound-effect-240503.mp3" preload="auto" />
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
      <div className="max-w-6xl mx-auto px-2 sm:px-6">
        {/* Game Container */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-3 sm:p-12 shadow-xl border border-white/20 overflow-y-auto min-h-[70vh]">
          {/* Mode Indicator */}
          <div className="text-center mb-4 sm:mb-8">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold ${
              gameState.mode === 'timed' 
                ? 'bg-orange-100 text-orange-800' 
                : 'bg-blue-100 text-blue-800'
            }`}>
              {gameState.mode === 'timed' ? <Clock className="w-4 h-4" /> : <Trophy className="w-4 h-4" />}
              {gameState.mode === 'timed' ? 'Challenge Mode' : 'Practice Mode'}
            </div>
          </div>

          {/* Draggable Items Row */}
          <div className={`transition-all duration-400 ${isSliding ? 'opacity-0 translate-x-10' : 'opacity-100 translate-x-0'}`}>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-8 mt-4 sm:mt-6">
              {currentItems.map((item, idx) => (
                <DraggableItem
                  key={item.id + '-' + idx}
                  item={item}
                  isDragging={draggedItem === item.id}
                  isMatched={isItemMatched(item.id)}
                  isIncorrect={incorrectDrop === item.id}
                  onDragStart={() => handleDragStart(item.id)}
                  onDragEnd={handleDragEnd}
                  onClick={isMobile ? () => handleItemTap(item.id) : undefined}
                  isSelected={isMobile && selectedItemId === item.id}
                />
              ))}
            </div>
          </div>

          {/* Drop Zones Row */}
          <div className={`transition-all duration-400 ${isSliding ? 'opacity-0 translate-x-10' : 'opacity-100 translate-x-0'}`}>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-16 mt-8 sm:mt-16">
              {shuffledDropZones.map((item, idx) => (
                <DropZone
                  key={item.id + '-' + idx}
                  zone={{
                    id: item.id,
                    label: categoryId === 'alphabet' ? item.name.toLowerCase() : item.name,
                    color: categoryId === 'alphabet' ? 'yellow-400' : 'blue-400',
                  }}
                  isHovered={hoveredZone === item.id}
                  matchedItem={getMatchedItem(item.id)}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={isMobile ? () => handleZoneTap(item.id) : undefined}
                  isActive={isMobile && !!selectedItemId}
                />
              ))}
            </div>
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
        onClose={() => setShowLeaderboard(false)}
        onBackToCategories={onBackToHome}
        players={players}
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

      {(!currentItems || currentItems.length === 0) && (
        <div className="text-center text-red-600 font-bold text-xl mt-12">
          No valid items found for this category. Please check your data source.
        </div>
      )}

      {dropWarning && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-xl shadow-lg z-50 font-bold animate-bounce">
          {dropWarning}
        </div>
      )}
    </div>
  );
};

export default Quiz;