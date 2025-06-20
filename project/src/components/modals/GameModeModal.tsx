import React, { useState } from 'react';
import { Clock, Target, Zap, Trophy, BookOpen, Eye, Gauge, ArrowRight, Sparkles } from 'lucide-react';
import { GameMode, GameSpeed, GameDifficulty, GameSettings } from '../../types/game';

interface GameModeModalProps {
  isOpen: boolean;
  onSelectSettings: (settings: GameSettings) => void;
  onClose: () => void;
}

const GameModeModal: React.FC<GameModeModalProps> = ({ isOpen, onSelectSettings, onClose }) => {
  const [selectedMode, setSelectedMode] = useState<GameMode | null>(null);
  const [selectedSpeed, setSelectedSpeed] = useState<GameSpeed | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<GameDifficulty | null>(null);

  if (!isOpen) return null;

  const handleContinue = () => {
    console.log('handleContinue called with:', { selectedMode, selectedSpeed, selectedDifficulty });
    
    if (selectedMode === 'study') {
      // Study mode doesn't need speed/difficulty
      console.log('Calling onSelectSettings for study mode');
      onSelectSettings({ mode: selectedMode });
    } else if (selectedMode === 'timed') {
      // Challenge mode only needs difficulty
      if (selectedDifficulty) {
        console.log('Calling onSelectSettings for challenge mode');
        onSelectSettings({
          mode: selectedMode,
          difficulty: selectedDifficulty
        });
      }
    } else if (selectedMode && selectedSpeed && selectedDifficulty) {
      // Practice mode needs all settings
      console.log('Calling onSelectSettings for practice mode');
      onSelectSettings({
        mode: selectedMode,
        speed: selectedSpeed,
        difficulty: selectedDifficulty
      });
    }
  };

  const handleStudyMode = () => {
    setSelectedMode('study');
    onSelectSettings({ mode: 'study' });
  };

  const renderModeSelection = () => (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Study Mode */}
          <button
        onClick={handleStudyMode}
        className={`group p-6 border-2 rounded-2xl transition-all duration-200 text-left ${
          selectedMode === 'study'
            ? 'border-green-400 bg-green-50'
            : 'border-gray-200 hover:border-green-400 hover:bg-green-50'
        }`}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors">
                <BookOpen className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Study Mode</h3>
            </div>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                Preview all vocabulary
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                Learn names and categories
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                No pressure environment
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                Perfect for beginners
              </li>
            </ul>
          </button>

      {/* Practice Mode */}
          <button
        onClick={() => setSelectedMode('normal')}
        className={`group p-6 border-2 rounded-2xl transition-all duration-200 text-left ${
          selectedMode === 'normal'
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-200 hover:border-blue-400 hover:bg-blue-50'
        }`}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <Trophy className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Practice Mode</h3>
            </div>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                No time limit
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                Progress through sets
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                Perfect for learning
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                Celebration animations
              </li>
            </ul>
          </button>

      {/* Challenge Mode */}
          <button
        onClick={() => setSelectedMode('timed')}
        className={`group p-6 border-2 rounded-2xl transition-all duration-200 text-left ${
          selectedMode === 'timed'
            ? 'border-orange-400 bg-orange-50'
            : 'border-gray-200 hover:border-orange-400 hover:bg-orange-50'
        }`}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Challenge Mode</h3>
            </div>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                60-second challenge
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                Continuous play
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                Speed & accuracy focus
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                High score tracking
              </li>
            </ul>
          </button>
        </div>
  );

  const renderSpeedSelection = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Slow Speed */}
      <button
        onClick={() => setSelectedSpeed('slow')}
        className={`group p-6 border-2 rounded-2xl transition-all duration-200 ${
          selectedSpeed === 'slow'
            ? 'border-green-400 bg-green-50'
            : 'border-gray-200 hover:border-green-400 hover:bg-green-50'
        }`}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors">
            <Gauge className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">Slow</h3>
            <p className="text-gray-600">Take your time</p>
          </div>
        </div>
      </button>

      {/* Normal Speed */}
      <button
        onClick={() => setSelectedSpeed('normal')}
        className={`group p-6 border-2 rounded-2xl transition-all duration-200 ${
          selectedSpeed === 'normal'
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-200 hover:border-blue-400 hover:bg-blue-50'
        }`}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
            <Gauge className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">Normal</h3>
            <p className="text-gray-600">Balanced pace</p>
          </div>
        </div>
      </button>

      {/* Fast Speed */}
      <button
        onClick={() => setSelectedSpeed('fast')}
        className={`group p-6 border-2 rounded-2xl transition-all duration-200 ${
          selectedSpeed === 'fast'
            ? 'border-orange-400 bg-orange-50'
            : 'border-gray-200 hover:border-orange-400 hover:bg-orange-50'
        }`}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center group-hover:bg-orange-200 transition-colors">
            <Gauge className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">Fast</h3>
            <p className="text-gray-600">Quick reactions</p>
          </div>
        </div>
      </button>
    </div>
  );

  // --- Restore Difficulty Selector for Practice/Challenge ---
  const renderDifficultySelector = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Starter */}
      <button
        onClick={() => setSelectedDifficulty('starter')}
        className={`group p-6 border-2 rounded-2xl transition-all duration-200 flex flex-col items-center justify-center ${selectedDifficulty === 'starter' ? 'border-green-400 bg-green-50' : 'border-gray-200 hover:border-green-400 hover:bg-green-50'}`}
      >
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2 group-hover:bg-green-200 transition-colors">
            <Sparkles className="w-6 h-6 text-green-600" />
        </div>
        <span className="text-xl font-bold text-gray-800">Starter</span>
        <span className="text-gray-600 text-sm mt-1">Easy</span>
      </button>
      {/* Mover (disabled) */}
      <button
        disabled
        className="group p-6 border-2 rounded-2xl flex flex-col items-center justify-center bg-gray-100 text-gray-400 cursor-not-allowed opacity-60"
      >
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
          <Sparkles className="w-6 h-6 text-blue-300" />
        </div>
        <span className="text-xl font-bold text-gray-400">Mover</span>
        <span className="text-gray-400 text-sm mt-1">Medium</span>
      </button>
      {/* Flyer (disabled) */}
      <button
        disabled
        className="group p-6 border-2 rounded-2xl flex flex-col items-center justify-center bg-gray-100 text-gray-400 cursor-not-allowed opacity-60"
      >
        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-2">
          <Sparkles className="w-6 h-6 text-orange-300" />
        </div>
        <span className="text-xl font-bold text-gray-400">Flyer</span>
        <span className="text-gray-400 text-sm mt-1">Hard</span>
      </button>
    </div>
  );

  const renderContent = () => {
    // Step 1: Game speed selection (Practice mode)
    if (selectedMode === 'normal' && !selectedSpeed) {
      return (
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Gauge className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Select Game Speed</h2>
          <p className="text-gray-600 mb-6">How fast do you want to play?</p>
          {renderSpeedSelection()}
        </div>
      );
    }
    // Step 2: Difficulty selection (Practice mode)
    if (selectedMode === 'normal' && selectedSpeed && !selectedDifficulty) {
      return (
        <div className="text-center">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-orange-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Select Difficulty</h2>
          <p className="text-gray-600 mb-6">Choose your challenge level</p>
          {renderDifficultySelector()}
        </div>
      );
    }

    // Show Ready to Play screen when all required settings are selected
    if ((selectedMode === 'normal' && selectedSpeed && selectedDifficulty) || 
        (selectedMode === 'timed' && selectedDifficulty)) {
      return (
        <div className="text-center">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Zap className="w-8 h-8 text-purple-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Ready to Play!</h2>
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 text-gray-600">
              <span>Mode:</span>
              <span className="font-semibold">{selectedMode === 'normal' ? 'Practice' : 'Challenge'}</span>
            </div>
            {selectedMode === 'normal' && (
              <div className="flex items-center gap-2 text-gray-600">
                <span>Speed:</span>
                <span className="font-semibold capitalize">{selectedSpeed}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-gray-600">
              <span>Difficulty:</span>
              <span className="font-semibold capitalize">{selectedDifficulty}</span>
            </div>
            <button
              onClick={handleContinue}
              className="mt-4 px-8 py-4 bg-purple-500 text-white rounded-xl font-semibold hover:bg-purple-600 transition-colors flex items-center gap-2"
            >
              Start Playing
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      );
    }

    // Show initial mode selection
    if (!selectedMode) {
      return (
        <>
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-purple-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Choose Learning Mode</h2>
            <p className="text-gray-600">How would you like to learn today?</p>
          </div>
          {renderModeSelection()}
        </>
      );
    }

    // Show study mode screen
    if (selectedMode === 'study') {
      // Instantly handled by handleStudyMode, so don't render anything
      return null;
    }

    // For Challenge mode, skip speed selection and go straight to difficulty
    if (selectedMode === 'timed' && !selectedDifficulty) {
      return (
        <>
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-orange-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Choose Difficulty</h2>
            <p className="text-gray-600 mb-6">Select your challenge level</p>
            {renderDifficultySelector()}
          </div>
        </>
      );
    }

    return null;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-8 shadow-2xl transform animate-in zoom-in duration-300 max-w-4xl w-full mx-4">
        {renderContent()}
        
        {selectedMode && selectedMode !== 'study' && (
          <div className="mt-8 flex justify-between items-center">
            <button
              onClick={() => {
                if (!selectedSpeed && selectedMode === 'normal') setSelectedMode(null);
                else if (!selectedDifficulty) {
                  if (selectedMode === 'normal') setSelectedSpeed(null);
                  else setSelectedMode(null);
                } else {
                  setSelectedDifficulty(null);
                  if (selectedMode === 'normal') setSelectedSpeed(null);
                }
              }}
              className="px-6 py-2 text-gray-500 hover:text-gray-700 transition-colors flex items-center gap-2"
            >
              Back
            </button>
          </div>
        )}

        {!selectedMode && (
        <div className="mt-8 text-center">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-500 hover:text-gray-700 transition-colors"
          >
            Cancel
          </button>
        </div>
        )}
      </div>
    </div>
  );
};

export default GameModeModal;