import React, { useState, useEffect } from 'react';
import { Home, ArrowLeft, ArrowRight, Play, Eye, BookOpen, Volume2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { starterAnimals, moverAnimals, flyerAnimals, moverSet, flyerSet, dropZones } from '../data/animals';
import { QuizItem } from '../types/game';
import { alphabetItems } from '../data/alphabet';
import { starterColors, moverColors, flyerColors, moverSet as colorMoverSet, flyerSet as colorFlyerSet } from '../data/colors';
import { getNumberQuizItem, generateRandomNumbers, NumberQuizItem } from '../data/numbers';

interface StudyModeProps {
  onBackToHome: () => void;
  onStartQuiz: () => void;
  category?: string;
}

const StudyMode: React.FC<StudyModeProps> = ({ onBackToHome, onStartQuiz, category: categoryProp }) => {
  const navigate = useNavigate();
  const { category: categoryParam = '' } = useParams();
  const category = categoryProp || categoryParam || '';
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [difficulty, setDifficulty] = useState<'starter' | 'mover' | 'flyer'>('starter');
  const [animDirection, setAnimDirection] = useState<'left' | 'right' | null>(null);

  // --- Fix: Store numbers in state so they don't regenerate on every render ---
  const [numberItems, setNumberItems] = useState<NumberQuizItem[]>([]);
  useEffect(() => {
    if (category === 'numbers') {
      function getRandomUniqueNumbers(count: number, min: number, max: number): number[] {
        const set = new Set<number>();
        while (set.size < count) {
          const n = Math.floor(Math.random() * (max - min + 1)) + min;
          set.add(n);
        }
        return Array.from(set);
      }
      let numbers: number[] = [];
      if (difficulty === 'flyer') {
        numbers = getRandomUniqueNumbers(40, 1000, 9999); // 4-digit
      } else if (difficulty === 'mover') {
        numbers = getRandomUniqueNumbers(40, 100, 999); // 3-digit
      } else {
        numbers = getRandomUniqueNumbers(40, 10, 99); // 2-digit
      }
      setNumberItems(numbers.map(getNumberQuizItem));
      setCurrentItemIndex(0); // Reset to first item on difficulty/category change
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, difficulty]);

  // Voice selection logic (match Quiz exactly)
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      const viVoice = availableVoices.find(v => v.lang.startsWith('vi')) || null;
      setVoice(viVoice);
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  let allItems: any[] = [];
  if (category === 'alphabet') {
    allItems = alphabetItems;
  } else if (category === 'colors') {
    if (difficulty === 'flyer') {
      allItems = colorFlyerSet;
    } else if (difficulty === 'mover') {
      allItems = colorMoverSet;
    } else {
      allItems = starterColors;
    }
  } else if (category === 'numbers') {
    allItems = numberItems;
  } else {
    // Animals logic as before
    let animalPaths: string[] = [];
    if (difficulty === 'flyer') {
      animalPaths = flyerAnimals;
    } else if (difficulty === 'mover') {
      animalPaths = moverAnimals;
    } else {
      animalPaths = starterAnimals;
    }
    allItems = animalPaths.map(imgPath => {
      const fileName = imgPath.split('/').pop() || '';
      const base = fileName.replace(/\.[^/.]+$/, '');
      let displayName = base.replace(/[-_][0-9]+$/, '').replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      if (/^stingray/i.test(base)) displayName = 'Stingray';
      else if (/^seahorse/i.test(base)) displayName = 'Seahorse';
      return {
        id: base,
        name: displayName,
        image: imgPath,
        category: '',
      };
    });
  }
  const currentItem = allItems[currentItemIndex];
  const currentCategory = dropZones.find(zone => zone.id === currentItem?.category);

  const nextItem = () => {
    if (currentItemIndex < allItems.length - 1) {
      setAnimDirection('right');
      setTimeout(() => {
      setCurrentItemIndex(currentItemIndex + 1);
        setAnimDirection(null);
      }, 150);
    }
  };

  const prevItem = () => {
    if (currentItemIndex > 0) {
      setAnimDirection('left');
      setTimeout(() => {
      setCurrentItemIndex(currentItemIndex - 1);
        setAnimDirection(null);
      }, 150);
    }
  };

  const goToSet = (setIndex: number) => {
    setCurrentSetIndex(setIndex);
    setCurrentItemIndex(setIndex * 3); // Each set has 3 items
  };

  // Carousel logic for navigation
  const total = allItems.length;
  const current = currentItemIndex;

  // Helper to render the correct number image by prefix
  const numberImages = [
    'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
    'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty',
    'twenty-one', 'twenty-two', 'twenty-three', 'twenty-four', 'twenty-five', 'twenty-six', 'twenty-seven', 'twenty-eight', 'twenty-nine',
    'thirty', 'thirty-one', 'thirty-two', 'thirty-three', 'thirty-four', 'thirty-five', 'thirty-six', 'thirty-seven', 'thirty-eight', 'thirty-nine',
    'forty', 'forty-one', 'forty-two', 'forty-three', 'forty-four', 'forty-five', 'forty-six', 'forty-seven', 'forty-eight', 'forty-nine',
    'fifty', 'fifty-one', 'fifty-two', 'fifty-three', 'fifty-four', 'fifty-five', 'fifty-six', 'fifty-seven', 'fifty-eight', 'fifty-nine',
    'sixty', 'sixty-one', 'sixty-two', 'sixty-three', 'sixty-four', 'sixty-five', 'sixty-six', 'sixty-seven', 'sixty-eight', 'sixty-nine',
    'seventy', 'seventy-one', 'seventy-two', 'seventy-three', 'seventy-four', 'seventy-five', 'seventy-six', 'seventy-seven', 'seventy-eight', 'seventy-nine',
    'eighty', 'eighty-one', 'eighty-two', 'eighty-three', 'eighty-four', 'eighty-five', 'eighty-six', 'eighty-seven', 'eighty-eight', 'eighty-nine',
    'ninety', 'ninety-one', 'ninety-two', 'ninety-three', 'ninety-four', 'ninety-five', 'ninety-six', 'ninety-seven', 'ninety-eight', 'ninety-nine',
  ];

  function NumberTextDisplay({ value }: { value: number }) {
    // Pick a playful color from a palette
    const colors = [
      'text-pink-500', 'text-blue-500', 'text-green-500', 'text-yellow-500', 'text-purple-500',
      'text-orange-500', 'text-emerald-500', 'text-cyan-500', 'text-fuchsia-500', 'text-lime-500',
    ];
    // Use a deterministic color for each number
    const color = colors[value % colors.length];
    // Use a playful font (Tailwind: font-comic or font-bold, fallback to sans)
    return (
      <span className={`text-7xl font-bold ${color} font-sans`} style={{ fontFamily: 'Comic Sans MS, Comic Sans, cursive, sans-serif' }}>
        {value}
      </span>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBackToHome}
            className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center hover:bg-green-200 transition-colors"
          >
            <Home className="w-6 h-6 text-green-600" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-green-600">Study Mode</h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full font-semibold">
            {currentItemIndex + 1} of {allItems.length}
          </div>
          <button
            onClick={() => setAudioEnabled(a => !a)}
            className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
            aria-label={audioEnabled ? 'Mute audio' : 'Unmute audio'}
          >
            {audioEnabled ? (
              <Volume2 className="w-6 h-6 text-green-600" />
            ) : (
              <Volume2 className="w-6 h-6 text-gray-400" />
            )}
          </button>
          <button
            onClick={onStartQuiz}
            className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
          >
            <Play className="w-5 h-5" />
            Start Quiz
          </button>
        </div>
      </div>

      {/* Main Study Area */}
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-12 shadow-xl border border-white/20">
          
          {/* Difficulty Selectors - only for animals */}
          {category !== 'alphabet' && (
            <div className="flex justify-center gap-4 mb-8">
              <button
                onClick={() => { setDifficulty('starter'); setCurrentItemIndex(0); }}
                className={`px-6 py-2 rounded-full font-semibold transition-colors ${difficulty === 'starter' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-green-100'}`}
              >
                Starter
              </button>
              <button
                onClick={() => { setDifficulty('mover'); setCurrentItemIndex(0); }}
                className={`px-6 py-2 rounded-full font-semibold transition-colors ${difficulty === 'mover' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-blue-100'}`}
              >
                Mover
              </button>
              <button
                onClick={() => { setDifficulty('flyer'); setCurrentItemIndex(0); }}
                className={`px-6 py-2 rounded-full font-semibold transition-colors ${difficulty === 'flyer' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-orange-100'}`}
              >
                Flyer
              </button>
            </div>
          )}
          
          {/* Current Item Display */}
          {currentItem && (
            <div className="text-center mb-12 flex items-center justify-center gap-4">
              {/* Left Arrow */}
              <button
                onClick={prevItem}
                disabled={currentItemIndex === 0}
                className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Previous"
              >
                <ArrowLeft className="w-7 h-7" />
              </button>
              {/* Animated Item */}
              <div className={`relative inline-block mb-8 transition-all duration-300
                ${animDirection === 'right' ? 'opacity-0 translate-x-12 scale-95' : ''}
                ${animDirection === 'left' ? 'opacity-0 -translate-x-12 scale-95' : ''}
                ${!animDirection ? 'opacity-100 translate-x-0 scale-100' : ''}
              `}>
                <div className="w-64 h-64 rounded-3xl overflow-hidden shadow-2xl flex items-center justify-center bg-white">
                  {category === 'colors' ? (
                    <div
                      className="w-48 h-48 rounded-full border-4 border-gray-200 mx-auto"
                      style={{ background: currentItem.hex }}
                    />
                  ) : category === 'numbers' ? (
                    <div className="flex flex-col items-center justify-center w-full">
                      <NumberTextDisplay value={currentItem.value} />
                    </div>
                  ) : (
                    <img
                      src={currentItem.image}
                      alt={currentItem.name}
                      className="w-40 h-40 object-contain mx-auto"
                    />
                  )}
                  {/* Eye and Speaker Buttons (stacked top right) */}
                  <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center shadow">
                      <Eye className="w-5 h-5 text-green-600" />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (!audioEnabled) return;
                        if ('speechSynthesis' in window) {
                          const text = category === 'numbers' ? currentItem.word : currentItem.name;
                          const utterance = new window.SpeechSynthesisUtterance(text);
                          if (voice) {
                            utterance.voice = voice;
                            utterance.lang = voice.lang;
                          }
                          window.speechSynthesis.speak(utterance);
                        }
                      }}
                      className="w-12 h-12 bg-white/80 rounded-full flex items-center justify-center shadow-lg hover:bg-green-100 transition-colors"
                      style={{ marginTop: '130px', marginRight: '-2px' }}
                      aria-label={`Play audio for ${currentItem.name}`}
                    >
                      <Volume2 className="w-6 h-6 text-green-600" />
                    </button>
                  </div>
                </div>
                {/* For numbers, show the word below the card with spacing */}
                {category === 'numbers' && currentItem && (
                  <div className="text-2xl font-bold text-gray-700 mt-8">{currentItem.word}</div>
                )}
              </div>
              {/* Right Arrow */}
              <button
                onClick={nextItem}
                disabled={currentItemIndex === allItems.length - 1}
                className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Next"
              >
                <ArrowRight className="w-7 h-7" />
              </button>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between">
            <button
              onClick={prevItem}
              disabled={currentItemIndex === 0}
              className="flex items-center gap-2 bg-gray-100 text-gray-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-5 h-5" />
              Previous
            </button>

            {/* Set Navigation */}
            <div className="flex flex-col items-center w-full">
              {/* Stepper Bar */}
              <div className="relative w-full max-w-xl h-14 flex items-center justify-center my-6">
                {/* Progress Bar (background) */}
                <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-2 bg-gray-200 rounded-full w-full z-0"></div>
                {/* Progress Bar (filled) */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 h-2 bg-green-400 rounded-full z-0 transition-all duration-300"
                  style={{ width: `${(current / (total - 1)) * 100}%` }}
                ></div>
                {/* Steps */}
                <div className="relative flex w-full justify-between z-10 items-center">
                  {/* Start label */}
                  <span className="absolute left-0 -top-6 text-xs text-gray-400 select-none">Start</span>
                  {/* End label */}
                  <span className="absolute right-0 -top-6 text-xs text-gray-400 select-none">End</span>
                  {(() => {
                    // Show: first, last, current, 2 neighbors each side, ellipsis
                    const maxDots = 9;
                    let stepIndexes: (number | string)[] = [];
                    if (total <= maxDots) {
                      stepIndexes = Array.from({ length: total }, (_, i) => i);
                    } else {
                      if (current < 4) {
                        stepIndexes = [0, 1, 2, 3, 4, '...', total - 1];
                      } else if (current > total - 5) {
                        stepIndexes = [0, '...', total - 5, total - 4, total - 3, total - 2, total - 1];
                      } else {
                        stepIndexes = [0, '...', current - 2, current - 1, current, current + 1, current + 2, '...', total - 1];
                      }
                    }
                    return stepIndexes.map((idx, i) => {
                      if (idx === '...') {
                        return (
                          <div key={`ellipsis-${i}`} className="flex-1 flex items-center justify-center">
                            <span className="text-gray-400 text-lg">...</span>
                          </div>
                        );
                      }
                      const isActive = idx === current;
                      return (
                <button
                          key={idx}
                          onClick={() => setCurrentItemIndex(Number(idx))}
                          className={`transition-all duration-200 flex items-center justify-center
                            ${isActive ? 'w-12 h-12 bg-green-500 text-white shadow-lg ring-4 ring-green-200 scale-110 z-20' : 'w-5 h-5 bg-white border-2 border-green-300 text-green-600 z-10'}
                            rounded-full font-bold mx-1 focus:outline-none focus:ring-2 focus:ring-green-400
                          `}
                          aria-label={`Go to item ${Number(idx) + 1}`}
                          title={`Go to item ${Number(idx) + 1}`}
                          style={{ position: 'relative' }}
                >
                          {isActive ? <span className="text-lg font-bold">{Number(idx) + 1}</span> : ''}
                </button>
                      );
                    });
                  })()}
                </div>
              </div>
              {/* Progress Text */}
              <div className="text-sm text-gray-500 mt-1">{current + 1} of {total}</div>
            </div>

            <button
              onClick={nextItem}
              disabled={currentItemIndex === allItems.length - 1}
              className="flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyMode;