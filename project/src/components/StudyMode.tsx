import React, { useState, useEffect } from 'react';
import { Home, ArrowLeft, ArrowRight, Play, Eye, BookOpen, Volume2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { animalsData } from '../data/animals';
import { QuizItem } from '../types/game';
import { alphabetData } from '../data/alphabet';
import { colorsData } from '../data/colors';
import { clothesData } from '../data/clothes';
import { foodData } from '../data/food';
import { generateRandomNumbers, getNumberQuizItem } from '../data/numbers';

interface StudyModeProps {
  onBackToHome: () => void;
  onStartQuiz: () => void;
}

const StudyMode: React.FC<StudyModeProps> = ({ onBackToHome, onStartQuiz }) => {
  const navigate = useNavigate();
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [difficulty, setDifficulty] = useState<'starter' | 'mover' | 'flyer'>('starter');
  const [animDirection, setAnimDirection] = useState<'left' | 'right' | null>(null);

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

  // Determine category from URL path
  const pathParts = window.location.pathname.split('/');
  const category = pathParts[pathParts.length - 1] || '';

  let allItems: any[] = [];
  if (category === 'alphabet') {
    allItems = alphabetData.starter;
  } else if (category === 'colors') {
    if (difficulty === 'flyer') {
      allItems = colorsData.flyer;
    } else if (difficulty === 'mover') {
      allItems = colorsData.mover;
    } else {
      allItems = colorsData.starter;
    }
  } else if (category === 'numbers') {
    let digits = 2;
    if (difficulty === 'flyer') digits = 4;
    else if (difficulty === 'mover') digits = 3;
    else digits = 2;
    const nums = generateRandomNumbers(40, digits);
    allItems = nums.map(n => {
      const quizItem = getNumberQuizItem(n);
      return {
        id: quizItem.id,
        name: quizItem.word,
        value: quizItem.value,
        display: quizItem.value,
        word: quizItem.word,
        hex: '#6366f1',
      };
    });
  } else if (category === 'clothes') {
    if (difficulty === 'flyer') {
      allItems = clothesData.flyer;
    } else if (difficulty === 'mover') {
      allItems = clothesData.mover;
    } else {
      allItems = clothesData.starter;
    }
  } else if (category === 'food') {
    if (difficulty === 'flyer') {
      allItems = foodData.flyer;
    } else if (difficulty === 'mover') {
      allItems = foodData.mover;
    } else {
      allItems = foodData.starter;
    }
  } else if (category === 'animals') {
    const animalMap = (imgPath: string) => {
      const fileName = imgPath.split('/').pop() || '';
      const base = fileName.replace(/\.[^/.]+$/, '');
      let displayName = base.replace(/[-_][0-9]+$/, '').replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      return { name: displayName, image: imgPath };
    };
    if (difficulty === 'flyer') {
      allItems = animalsData.flyer.map(animalMap);
    } else if (difficulty === 'mover') {
      allItems = animalsData.mover.map(animalMap);
    } else {
      allItems = animalsData.starter.map(animalMap);
    }
  } else {
    // Default fallback
    allItems = [];
  }
  const currentItem = allItems[currentItemIndex];

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
                disabled
                className={`px-6 py-2 rounded-full font-semibold transition-colors bg-gray-200 text-gray-400 cursor-not-allowed opacity-60`}
              >
                Mover 🔒
              </button>
              <button
                disabled
                className={`px-6 py-2 rounded-full font-semibold transition-colors bg-gray-200 text-gray-400 cursor-not-allowed opacity-60`}
              >
                Flyer 🔒
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
                <div className="w-64 h-64 rounded-3xl overflow-hidden shadow-2xl flex items-center justify-center bg-white relative">
                  {category === 'colors' ? (
                    <div
                      className="w-48 h-48 rounded-full border-4 border-gray-200 mx-auto"
                      style={{ background: currentItem.image }}
                    />
                  ) : category === 'numbers' ? (
                    <div className="flex flex-col items-center justify-center w-full h-full">
                      <span
                        className="text-7xl font-extrabold mb-4 select-none"
                        style={{ color: currentItem.hex || '#6366f1', fontFamily: 'Comic Sans MS, Comic Neue, cursive, Inter, sans-serif' }}
                      >
                        {currentItem.display}
                      </span>
                      <span className="text-xl font-medium text-gray-600 mt-2">{currentItem.word}</span>
                    </div>
                  ) : (
                    <img
                      src={currentItem.image}
                      alt={currentItem.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                  {/* Speaker Button - moved up */}
                  <button
                    type="button"
                    onClick={() => {
                      if (!audioEnabled) return;
                      if ('speechSynthesis' in window) {
                        const utterance = new window.SpeechSynthesisUtterance(currentItem.name);
                        if (voice) {
                          utterance.voice = voice;
                          utterance.lang = voice.lang;
                        }
                        window.speechSynthesis.speak(utterance);
                      }
                    }}
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 w-12 h-12 bg-white/80 rounded-full flex items-center justify-center shadow-lg hover:bg-green-100 transition-colors z-10"
                    aria-label={`Play audio for ${currentItem.name}`}
                  >
                    <Volume2 className="w-6 h-6 text-green-600" />
                  </button>
                </div>
                {/* Name under main picture for all study modes - moved down, white background */}
                <div className="mt-12 flex justify-center">
                  <div className="bg-white rounded-xl px-8 py-4 shadow-lg text-2xl font-bold text-gray-700 select-none inline-block">
                    {category === 'numbers' ? currentItem.word : currentItem.name}
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                  <Eye className="w-6 h-6 text-white" />
                </div>
              </div>
              {/* Right Arrow */}
              <button
                onClick={nextItem}
                disabled={currentItemIndex === allItems.length - 1}
                className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
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