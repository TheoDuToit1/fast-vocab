import React, { useState, useEffect } from 'react';
import { Home, ArrowLeft, ArrowRight, Play, Eye, BookOpen, Volume2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { animalsData } from '../data/animals';
import { alphabetData } from '../data/alphabet';
import { clothesData } from '../data/clothes';
import { colorsData } from '../data/colors';
import { foodData } from '../data/food';
import { generateRandomNumbers, getNumberQuizItem } from '../data/numbers';
import { getCategory } from '../data/categories';
import { Category, Item, QuizItem } from '../types/game';

interface StudyModeProps {
  onBackToHome: () => void;
  onStartQuiz: () => void;
  categoryIdProp?: string;
}

const StudyMode: React.FC<StudyModeProps> = ({ onBackToHome, onStartQuiz, categoryIdProp }) => {
  const navigate = useNavigate();
  const { categoryId: categoryIdFromUrl } = useParams<{ categoryId: string }>();
  
  // Use prop if provided, otherwise use URL param, fall back to 'animals' if neither exists
  const categoryId = categoryIdProp || categoryIdFromUrl || 'animals';
  
  const category = getCategory(categoryId as any);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [difficulty, setDifficulty] = useState<'starter' | 'mover' | 'flyer'>('starter');
  const [animDirection, setAnimDirection] = useState<'left' | 'right' | null>(null);
  const [isFading, setIsFading] = useState(false);
  const [showDifficultyModal, setShowDifficultyModal] = useState(true);
  const [showImageModal, setShowImageModal] = useState(false);
  
  // Animation timing constants
  const FADE_OUT_DURATION = 300; // ms
  const ITEM_CHANGE_DELAY = 50; // ms

  // Voice selection logic (match Quiz exactly)
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
      if (!enVoice) {
        enVoice = availableVoices.find(v => v.lang.startsWith('en'));
      }
      setVoice(enVoice || null);
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  // Process items based on the category structure
  const [items, setItems] = useState<{ name: string; image: string }[]>([]);
  
  useEffect(() => {
    let processedItems: { name: string; image: string }[] = [];
    
    try {
      console.log("Processing category:", categoryId, category);
      
      if (!category) {
        console.error("Category is undefined");
        setItems([]);
        return;
      }
      
      // New category structure (classroom)
      if ('items' in category) {
        processedItems = category.items.map((item: {name: string; image: string}) => ({
          name: item.name,
          image: item.image
        }));
        console.log("Using new category structure:", processedItems);
      } 
      // Old category structure (animals, alphabet, etc.)
      else if (category.starter) {
        // Handle animals structure (each item might be a string path or an object)
        processedItems = category.starter.map((item: any) => {
          if (typeof item === 'string') {
            // Handle path strings (mainly animals)
            const fileName = item.split('/').pop() || '';
            const baseName = fileName.replace(/\.[^/.]+$/, '').replace(/[-_][0-9]+$/, '').replace(/[-_]/g, ' ');
            const displayName = baseName.replace(/\b\w/g, (c: string) => c.toUpperCase());
            return { name: displayName, image: item };
          } else if (item && typeof item === 'object') {
            // Handle objects (other categories)
            const name = item.name || 'Unknown';
            
            // Check if the item already has a complete image path
            let imagePath = item.image;
            
            if (!imagePath && item.id) {
              // Build the path if not provided
              imagePath = `/images/${categoryId}/starter/${item.id}.png`;
            }
            
            return { name, image: imagePath };
          }
          
          return { name: 'Unknown item', image: '' };
        });
        console.log("Using old category structure:", processedItems);
      } else {
        console.error("Unknown category structure:", category);
      }
      
      // Ensure we limit to 12 items for all categories
      if (processedItems.length > 12) {
        processedItems = processedItems.slice(0, 12);
      }
      
      console.log("Final processed items:", processedItems);
      setItems(processedItems);
    } catch (error) {
      console.error("Error processing category items:", error);
      setItems([]);
    }
  }, [categoryId, category, difficulty]);

  const currentItem = items[currentItemIndex] || { name: "Item not found", image: "" };

  const nextItem = () => {
    if (currentItemIndex < items.length - 1 && !isFading) {
      setAnimDirection('right');
      setIsFading(true);
      setTimeout(() => {
        setCurrentItemIndex(currentItemIndex + 1);
        setTimeout(() => {
          setIsFading(false);
        }, ITEM_CHANGE_DELAY);
      }, FADE_OUT_DURATION);
    }
  };

  const prevItem = () => {
    if (currentItemIndex > 0 && !isFading) {
      setAnimDirection('left');
      setIsFading(true);
      setTimeout(() => {
        setCurrentItemIndex(currentItemIndex - 1);
        setTimeout(() => {
          setIsFading(false);
        }, ITEM_CHANGE_DELAY);
      }, FADE_OUT_DURATION);
    }
  };

  const goToSet = (setIndex: number) => {
    setCurrentSetIndex(setIndex);
    setCurrentItemIndex(setIndex * 3); // Each set has 3 items
  };

  // Carousel logic for navigation
  const total = items.length;
  const current = currentItemIndex;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-4 p-4 sm:p-6 max-w-7xl mx-auto">
        {/* Left: Home, Icon, Title */}
        <div className="flex flex-row items-center gap-2 sm:gap-4 w-full sm:w-auto justify-center sm:justify-start mb-2 sm:mb-0">
          <button
            onClick={onBackToHome}
            className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center hover:bg-green-200 transition-colors"
          >
            <Home className="w-6 h-6 text-green-600" />
          </button>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold text-green-600">Study Mode</h1>
          </div>
        </div>
        {/* Center: Counter and Audio */}
        <div className="flex flex-row items-center gap-2 w-full sm:w-auto justify-center mb-2 sm:mb-0">
          <div className="bg-green-100 text-green-800 px-3 py-1 sm:px-4 sm:py-2 rounded-full font-semibold text-sm sm:text-base">
            {currentItemIndex + 1} of {total}
          </div>
          <button
            onClick={() => setAudioEnabled(a => !a)}
            className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
            aria-label={audioEnabled ? 'Mute audio' : 'Unmute audio'}
          >
            {audioEnabled ? (
              <Volume2 className="w-6 h-6 text-green-600" />
            ) : (
              <Volume2 className="w-6 h-6 text-gray-400" />
            )}
          </button>
        </div>
        {/* Right: Start Quiz */}
        <div className="w-full sm:w-auto flex justify-center sm:justify-end">
          <button
            onClick={onStartQuiz}
            className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center gap-2 text-base sm:text-lg justify-center"
          >
            <Play className="w-5 h-5" />
            Start Quiz
          </button>
        </div>
      </div>

      {/* Main Study Area */}
      <div className="w-full sm:max-w-4xl mx-auto px-2 sm:px-6">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-2 sm:p-12 shadow-xl border border-white/20">

          {/* Current Item Display */}
          {currentItem && (
            <div className="relative text-center mb-8 sm:mb-12 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
              {/* Left Arrow */}
              <button
                onClick={prevItem}
                disabled={currentItemIndex === 0}
                className="hidden sm:flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed mb-2 sm:mb-0"
                aria-label="Previous"
              >
                <ArrowLeft className="w-7 h-7" />
              </button>
              {/* Card and mobile arrows */}
              <div className="relative inline-block mb-6 sm:mb-8 transition-all duration-300 w-full">
                {/* Mobile left arrow */}
                <button
                  onClick={prevItem}
                  disabled={currentItemIndex === 0}
                  className="sm:hidden absolute left-[-0.5rem] top-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed z-10"
                  aria-label="Previous"
                  style={{ left: '-0.5rem' }}
                >
                  <ArrowLeft className="w-7 h-7" />
                </button>
                <div className={`relative w-48 h-48 sm:w-64 sm:h-64 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl flex items-center justify-center bg-white mx-auto
                  transform transition-all duration-300 ease-in-out
                  ${isFading && animDirection === 'right' ? 'opacity-0 -translate-x-20' : ''}
                  ${isFading && animDirection === 'left' ? 'opacity-0 translate-x-20' : ''}
                  ${!isFading && animDirection === 'right' ? 'opacity-100 translate-x-0' : ''}
                  ${!isFading && animDirection === 'left' ? 'opacity-100 translate-x-0' : ''}
                  ${!isFading && !animDirection ? 'opacity-100 translate-x-0' : ''}
                `}>
                  {currentItem.image ? (
                    <img
                      src={currentItem.image}
                      alt={currentItem.name}
                      className="w-full h-full max-w-[12rem] max-h-[12rem] sm:max-w-full sm:max-h-full object-contain sm:object-cover"
                    />
                  ) : (
                    <div className="text-center p-4 bg-gray-100 rounded">
                      <p className="text-gray-500">No image available</p>
                      <p className="text-xl font-bold mt-2">{currentItem.name}</p>
                    </div>
                  )}
                  {/* Speaker Button - moved up */}
                  <button
                    type="button"
                    onClick={() => {
                      if (!audioEnabled) return;
                      if ('speechSynthesis' in window) {
                        window.speechSynthesis.cancel(); // Stop any current speech
                        const utterance = new window.SpeechSynthesisUtterance(currentItem.name);
                        if (voice) {
                          utterance.voice = voice;
                          utterance.lang = voice.lang;
                        }
                        window.speechSynthesis.speak(utterance);
                      }
                    }}
                    className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/80 rounded-full flex items-center justify-center shadow-lg hover:bg-green-100 transition-colors z-10"
                    aria-label={`Play audio for ${currentItem.name}`}
                  >
                    <Volume2 className="w-6 h-6 text-green-600" />
                  </button>
                  {/* Eye icon - now inside the card */}
                  <div className="absolute top-2 right-1 w-7 h-7 bg-green-500 rounded-full flex items-center justify-center shadow-lg cursor-pointer"
                    onClick={() => setShowImageModal(true)}
                    tabIndex={0}
                    role="button"
                    aria-label="Enlarge image"
                    onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setShowImageModal(true); }}
                  >
                    <Eye className="w-4 h-4 text-white" />
                  </div>
                </div>
                {/* Name under main picture for all study modes - moved down, white background */}
                <div className="mt-6 sm:mt-12 flex justify-center">
                  <div className={`bg-white rounded-xl px-4 py-2 sm:px-8 sm:py-4 shadow-lg text-lg sm:text-2xl font-bold text-gray-700 select-none inline-block
                    transform transition-all duration-300 ease-in-out
                    ${isFading ? 'opacity-0' : 'opacity-100'}
                  `}>
                    {currentItem.name}
                  </div>
                </div>
                {/* Mobile right arrow */}
                <button
                  onClick={nextItem}
                  disabled={currentItemIndex === total - 1}
                  className="sm:hidden absolute right-[-0.5rem] top-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed z-10"
                  aria-label="Next"
                  style={{ right: '-0.5rem' }}
                >
                  <ArrowRight className="w-7 h-7" />
                </button>
              </div>
              {/* Right Arrow (desktop) */}
              <button
                onClick={nextItem}
                disabled={currentItemIndex === total - 1}
                className="hidden sm:flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed mb-2 sm:mb-0"
                aria-label="Next"
              >
                <ArrowRight className="w-7 h-7" />
              </button>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0">
            <button
              onClick={prevItem}
              disabled={currentItemIndex === 0}
              className="hidden sm:flex items-center gap-2 bg-gray-100 text-gray-600 px-4 py-2 sm:px-6 sm:py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto mb-2 sm:mb-0"
            >
              <ArrowLeft className="w-5 h-5" />
              Previous
            </button>

            {/* Set Navigation */}
            <div className="flex flex-col items-center w-full">
              {/* Stepper Bar */}
              <div className="relative w-full max-w-xs sm:max-w-xl h-14 flex items-center justify-center my-4 sm:my-6 overflow-x-auto">
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
                  <span className="absolute left-0 -top-6 text-xs text-gray-400 select-none hidden sm:block">Start</span>
                  {/* End label */}
                  <span className="absolute right-0 -top-6 text-xs text-gray-400 select-none hidden sm:block">End</span>
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
                          onClick={() => {
                            if (Number(idx) !== current) {
                              // Set animation direction based on target position
                              const newDirection = Number(idx) > current ? 'right' : 'left';
                              setAnimDirection(newDirection);
                              setIsFading(true);
                              setTimeout(() => {
                                setCurrentItemIndex(Number(idx));
                                setTimeout(() => {
                                  setIsFading(false);
                                }, ITEM_CHANGE_DELAY);
                              }, FADE_OUT_DURATION);
                            }
                          }}
                          className={`transition-all duration-200 flex items-center justify-center
                            ${isActive ? 'w-10 h-10 sm:w-12 sm:h-12 bg-green-500 text-white shadow-lg ring-4 ring-green-200 scale-110 z-20' : 'w-5 h-5 bg-white border-2 border-green-300 text-green-600 z-10'}
                            rounded-full font-bold mx-1 focus:outline-none focus:ring-2 focus:ring-green-400
                          `}
                          aria-label={`Go to item ${Number(idx) + 1}`}
                          title={`Go to item ${Number(idx) + 1}`}
                          style={{ position: 'relative' }}
                        >
                          {isActive ? <span className="text-base sm:text-lg font-bold">{Number(idx) + 1}</span> : ''}
                        </button>
                      );
                    });
                  })()}
                </div>
              </div>
              {/* Progress Text */}
              <div className="text-xs sm:text-sm text-gray-500 mt-1">{current + 1} of {total}</div>
            </div>

            <button
              onClick={nextItem}
              disabled={currentItemIndex === total - 1}
              className="hidden sm:flex items-center gap-2 bg-green-100 text-green-600 px-4 py-2 sm:px-6 sm:py-3 rounded-xl font-semibold hover:bg-green-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto mt-2 sm:mt-0"
            >
              Next
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Change Difficulty Button */}
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setShowDifficultyModal(true)}
              className="px-6 py-2 rounded-full font-semibold bg-green-100 text-green-700 hover:bg-green-200 transition-colors shadow"
            >
              Change Difficulty
            </button>
          </div>
        </div>
      </div>

      {/* Difficulty Modal */}
      {showDifficultyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-2xl p-8 shadow-xl w-full max-w-md relative">
            <button
              onClick={() => setShowDifficultyModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-2xl font-bold"
              aria-label="Close"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold text-center mb-6 text-green-700">Select Difficulty</h2>
            <div className="flex flex-col gap-4">
              <button
                onClick={() => { setDifficulty('starter'); setCurrentItemIndex(0); setShowDifficultyModal(false); }}
                className={`px-6 py-3 rounded-xl font-semibold transition-colors ${difficulty === 'starter' ? 'bg-green-500 text-white' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
              >
                Starter
              </button>
              <button
                disabled
                className="px-6 py-3 rounded-xl font-semibold bg-gray-100 text-gray-400 cursor-not-allowed opacity-60"
              >
                Mover 🔒
              </button>
              <button
                disabled
                className="px-6 py-3 rounded-xl font-semibold bg-gray-100 text-gray-400 cursor-not-allowed opacity-60"
              >
                Flyer 🔒
              </button>
            </div>
          </div>
        </div>
      )}

      {showImageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowImageModal(false)}>
          <div className="bg-white rounded-3xl shadow-2xl p-8 relative max-w-lg w-full flex flex-col items-center" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold"
              aria-label="Close"
            >
              ×
            </button>
            <img src={currentItem.image} alt={currentItem.name} className="w-72 h-72 object-cover rounded-2xl mb-6" />
            <div className="text-3xl font-bold text-gray-700 text-center">{currentItem.name}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyMode;