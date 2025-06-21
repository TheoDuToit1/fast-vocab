import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Home, Volume2, VolumeX, HelpCircle, Trophy, Clock, Pause, Play, ArrowLeft } from 'lucide-react';
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
import { colorsData } from '../data/colors';
import { MatchedPair, FloatingScore, Player, QuizItem } from '../types/game';
import { alphabetData } from '../data/alphabet';
import { clothesData } from '../data/clothes';
import { foodData } from '../data/food';
import { categories, getCategory } from '../data/categories';
import { useGame } from '../context/GameContext';
import { useGameTimer } from '../hooks/useGameTimer';
import { generateRandomNumbers, getNumberQuizItem, numbersData } from '../data/numbers';
import { classroom } from '../data/classroom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

interface QuizProps {
  onBackToHome: () => void;
}

// Helper function to shuffle an array
const shuffleArray = (array: any[]) => {
  let currentIndex = array.length,
    randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
  return array;
};

// Helper function to generate a set for the quiz
const generateQuizSet = (items: QuizItem[], count: number) => {
  const shuffled = shuffleArray([...items]);
  return shuffled.slice(0, count);
};

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

  // --- Add state to track if game is finished ---
  const [isGameFinished, setIsGameFinished] = useState(false);

  // --- Move timerBarRef above handleDrop to fix linter error ---
  const timerBarRef = useRef<TimerBarHandle>(null);

  // --- Add state for speed bonus ---
  const [recentCorrectTimestamps, setRecentCorrectTimestamps] = useState<number[]>([]);
  const [showSpeedBonus, setShowSpeedBonus] = useState(false);

  // --- Move these to the top ---
  const validCategories = ['animals', 'colors', 'alphabet', 'numbers', 'clothes', 'food', 'classroom'];

  const match = window.location.pathname.match(/quiz\/(\w+)/);
  const categoryId = match ? match[1] : '';
  const category = getCategory(categoryId as any);

  const getSafeCategory = () => {
    if (validCategories.includes(categoryId)) return categoryId;
    if (window.location.pathname.includes('alphabet')) return 'alphabet';
    if (window.location.pathname.includes('colors')) return 'colors';
    if (window.location.pathname.includes('animals')) return 'animals';
    if (window.location.pathname.includes('classroom')) return 'classroom';
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
    const difficulty = (gameState as any).difficulty || 'starter';
    
    if (categoryId === 'classroom') {
      items = classroom.items.map((item: { name: string; image: string }) => ({
        id: item.name,
        name: item.name,
        image: item.image,
        category: 'classroom',
      }));
    } else if (categoryId === 'alphabet') {
      // Use the same logic as animals for building pool, sets, and shuffling
      const normalizeAlphabet = (item: { name: string, image: string }, i: number) => ({
        id: item.name.toLowerCase() + '-' + i,
        name: item.name,
        image: item.image,
        category: 'alphabet',
        hex: undefined,
      });
      items = alphabetData.starter.map(normalizeAlphabet);
    } else if (categoryId === 'animals') {
      const normalizeAnimal = (item: any) => {
        // If the item is already properly structured
        if (item && item.name && item.image) {
          return {
            id: item.id || item.name.toLowerCase().replace(/\s+/g, '-'),
            name: item.name,
            image: item.image,
            category: 'animals',
            hex: undefined,
          };
        }
        
        // Otherwise, assume it's an image path
        const imgPath = typeof item === 'string' ? item : item.image;
        const fileName = imgPath.split('/').pop() || '';
        const base = fileName.replace(/\.[^/.]+$/, '');
        let displayName = base.replace(/[-_][0-9]+$/, '').replace(/[-_]/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase());
        
        if (imgPath.includes('parrot-1864474.png')) displayName = 'Bird';
        else if (/^stingray/i.test(base)) displayName = 'Stingray';
        else if (/^seahorse/i.test(base)) displayName = 'Seahorse';
        else if (/^panda-bear/i.test(base)) displayName = 'Panda';
        
        return {
          id: base,
          name: displayName,
          image: imgPath,
          category: 'animals',
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
      let colorPool = [];
      if (difficulty === 'starter') {
        colorPool = [...colorsData.starter];
      } else if (difficulty === 'mover') {
        colorPool = [...colorsData.starter, ...colorsData.mover];
      } else {
        colorPool = [...colorsData.starter, ...colorsData.mover, ...colorsData.flyer];
      }
      
      // Ensure we have enough colors
      if (colorPool.length === 0) {
        console.error('No colors in pool!');
        colorPool = [
          { id: 'red', name: 'Red', hex: '#FF0000' },
          { id: 'green', name: 'Green', hex: '#00FF00' },
          { id: 'blue', name: 'Blue', hex: '#0000FF' }
        ];
      }
      
      colorPool = colorPool.map(c => ({ 
        id: c.id || c.name.toLowerCase().replace(/\s+/g, '-'), 
        name: c.name, 
        image: '', 
        hex: c.hex, 
        category: '' 
      }));
      
      items = colorPool;
    } else if (categoryId === 'numbers') {
      // Use the same fixed set as Study Mode instead of random generation
      const allNumberItems = [...numbersData.starter];
      
      items = allNumberItems.map((item) => ({
        id: item.id,
        name: item.name, // word for drop zone
        display: parseInt(item.id), // numeral for draggable
        value: parseInt(item.id),
        image: item.image,
        hex: '#6366f1',
      }));

      items = items.filter(item => item.id && item.name);
    } else if (categoryId === 'clothes') {
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
    
    // Ensure we limit to 12 items for starter mode
    if (difficulty === 'starter' && items.length > 12) {
      items = items.slice(0, 12);
    }
    
    // For all categories, split into sets of 3
    const setSize = 3;
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
  const [practiceSetNumber, setPracticeSetNumber] = useState(1);
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

  const [currentSetMistake, setCurrentSetMistake] = useState(false);
  // Track total correct and wrong answers
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [totalWrong, setTotalWrong] = useState(0);

  // --- Add state for the combo bonus system ---
  const [consecutivePerfectSets, setConsecutivePerfectSets] = useState(0);
  const [comboMultiplier, setComboMultiplier] = useState(1.0);
  const [showComboBonus, setShowComboBonus] = useState(false);
  const MAX_COMBO_MULTIPLIER = 2.5;

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

  // --- Handle logic for when a set is completed ---
  useEffect(() => {
    if (isSetComplete) {
      if (!currentSetMistake) {
        // Perfect set, increment counter
        const newCount = consecutivePerfectSets + 1;
        setConsecutivePerfectSets(newCount);

        if (newCount >= 3) {
          const newMultiplier = Math.min(MAX_COMBO_MULTIPLIER, 1.0 + (newCount - 2) * 0.5);
          setComboMultiplier(newMultiplier);
          setShowComboBonus(true);
          // Hide the "2.5x" text after a short delay
          setTimeout(() => setShowComboBonus(false), 2000);
        }
      }
      // If there was a mistake, the counter is reset when the mistake is made.
    }
  }, [isSetComplete]);

  // --- Save score after each set in practice mode ---
  useEffect(() => {
    if (isSetComplete && gameState.mode === 'normal') {
      const safeCategory = getSafeCategory();
      addPlayer({
        name: gameState.playerName || 'Guest',
        score: gameState.score,
        mode: gameState.mode,
        timestamp: Date.now(),
        category: safeCategory,
        difficulty: (gameState as any).difficulty,
        speed: (gameState as any).speed,
        gameSessionId: gameState.gameSessionId,
      });
    }
  }, [isSetComplete, gameState, addPlayer, getSafeCategory]);

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

    const advanceSet = () => {
      console.log('advanceSet called, currentSet:', currentSet, 'shuffledSets.length:', shuffledSets.length);
      setIsSliding(true);
      setTimeout(() => {
        setPracticeSetNumber(prev => prev + 1);
        let nextSet = currentSet + 1;
        if (nextSet >= shuffledSets.length && shuffledSets.length > 0) {
          console.log('Reached end of sets, reshuffling...');
          // For all categories, reshuffle all items and create new sets
          const allItems = shuffledSets.flat();
          const newShuffledSets = shuffleArray(allItems).reduce<any[][]>((acc, item, idx) => {
            const setIdx = Math.floor(idx / 3);
            if (!acc[setIdx]) acc[setIdx] = [];
            acc[setIdx].push(item);
            return acc;
          }, []);
          setShuffledSets(newShuffledSets);
          nextSet = 0; // Reset to the first set
        }
        
        console.log('Moving to next set:', nextSet);
        setCurrentSet(nextSet);
        
        setMatchedPairs([]);
        setDraggedItem(null);
        setHoveredZone(null);
        setIncorrectDrop(null);
        setCurrentSetMistake(false);
        setTimeout(() => setIsSliding(false), 400); // 400ms animation
      }, 10); // slight delay to allow exit animation if needed
    };

    if (isCorrect) {
      const points = Math.round(BASE_POINTS * comboMultiplier);
      if (gameState.mode !== 'timed') {
        updateGameState(prev => ({ score: prev.score + points }));
      }
      
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
      if (item) setTimeout(() => speakWord(item.name), 600);
      const rect = event?.currentTarget?.getBoundingClientRect?.() || { left: 0, top: 0, width: 0, height: 0 };
      if (gameState.mode !== 'timed') {
        addFloatingScore(points, rect.left + rect.width / 2, rect.top);
      }
    } else {
      // --- On wrong answer, reset all combo stats ---
      setConsecutivePerfectSets(0);
      setComboMultiplier(1.0);
      setShowComboBonus(false);

      setIncorrectDrop(itemId);
      setCurrentSetMistake(true);
      // Deduct points for wrong answer
      if (gameState.mode !== 'timed') {
        updateGameState(prev => ({ score: prev.score - 50 }));
      }
      // Practice Mode: Subtract time for wrong answer
      if (gameState.mode === 'normal' && timerBarRef.current) {
        timerBarRef.current.subtractTime(3);
      }
      const rect = event?.currentTarget?.getBoundingClientRect?.() || { left: 0, top: 0, width: 0, height: 0 };
      if (gameState.mode !== 'timed') {
        addFloatingScore(-50, rect.left + rect.width / 2, rect.top);
      }
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
  const handleZoneTap = useCallback((zoneId: string, event: React.MouseEvent) => {
    if (!gameState.isPlaying || !selectedItemId) return;
    // Use the same drop logic
    handleItemDrop(selectedItemId, zoneId, event);
    setSelectedItemId(null);
  }, [gameState.isPlaying, selectedItemId, handleItemDrop]);

  // --- Reset currentSetMistake on set completion ---
  useEffect(() => {
    if (isSetComplete && gameState.mode !== 'timed') {
      setCurrentSetMistake(false);
    }
  }, [isSetComplete, gameState.mode]);

  // --- Reset state on set change ---
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
    // Get the final score before setting isPlaying to false
    const safeCategory = getSafeCategory();
    
    // For Practice mode, use the current gameState.score
    // For Challenge mode, use the challengeCorrectTotal * 100 to make it consistent with practice mode scoring
    const finalScore = gameState.mode === 'timed' 
      ? challengeCorrectTotal * 100  // Each correct answer is worth 100 points in Challenge mode
      : gameState.score;
    
    console.log('Current game state score:', gameState.score);
    console.log('Challenge correct total:', challengeCorrectTotal);
    console.log('Final score to be saved:', finalScore);
    
    // Create the player object before updating game state
    const newPlayer: Player = {
      name: gameState.playerName || 'Guest',
      score: finalScore,
      mode: gameState.mode,
      timestamp: Date.now(),
      category: safeCategory,
      difficulty: (gameState as any).difficulty,
      speed: (gameState as any).speed,
      gameSessionId: gameState.gameSessionId,
    };
    
    // Now update game state
    updateGameState({ isPlaying: false });
    
    // Mark game as finished
    setIsGameFinished(true);

    console.log('Adding player to leaderboard:', newPlayer);
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
      if (gameState.mode === 'timed') {
        // In Challenge mode, directly end the game which will save the score
        updateGameState({ isPlaying: false });
        setShowTimeUp(true);
      } else {
        // In Practice mode, just show the time up modal
        updateGameState({ isPlaying: false });
        setShowTimeUp(true);
      }
    }
  }, [gameState.isPlaying, gameState.mode, updateGameState]);

  // Handle time up modal close
  const handleTimeUpClose = useCallback(() => {
    setShowTimeUp(false);
    endGame();
  }, [endGame]);

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
      setChallengeSetsCompleted(prev => prev + 1);
      setChallengeCorrectTotal(prev => prev + matchedPairs.length);
    }
  }, [isSetComplete, gameState.mode, matchedPairs.length]);

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
              <>Set {practiceSetNumber}</>
            )}
          </div>
          {gameState.mode === 'timed' ? (
            <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full font-semibold">
              Correct: {challengeCorrectTotal}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full font-semibold">
                Score {gameState.score.toLocaleString()}
              </div>
              {/* Combo Multiplier indicator */}
              {(showComboBonus || comboMultiplier > 1.0) && gameState.mode === 'normal' && (
                <div className="animate-bounce">
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full shadow-lg font-bold text-sm">
                    {comboMultiplier > 1.0 ? `+${(comboMultiplier - 1.0).toFixed(1)}x` : ''} Bonus!
                  </div>
                </div>
              )}
            </div>
          )}
          {gameState.mode === 'timed' && gameState.isPlaying && (
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
                  onClick={isMobile ? (zoneId, event) => handleZoneTap(zoneId, event) : undefined}
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
        isGameFinished={isGameFinished}
      />

      <HelpModal
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
      />

      <TimeUpModal
        isOpen={showTimeUp}
        onClose={handleTimeUpClose}
        score={gameState.score}
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