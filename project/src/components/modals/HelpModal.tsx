import React from 'react';
import { X, Target, Clock, Trophy, Zap, Star } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl transform animate-in zoom-in duration-300 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">How to Play</h2>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Basic Rules */}
          <section>
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              How to Play
            </h3>
            <div className="space-y-3 text-gray-600">
              <p>• Drag animal images to their correct category circles</p>
              <p>• Match all animals in a set to progress</p>
              <p>• Build continuous bonuses by making consecutive correct matches</p>
              <p>• Avoid incorrect matches to maintain your continuous bonus</p>
            </div>
          </section>

          {/* Scoring System */}
          <section>
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              Scoring System
            </h3>
            <div className="space-y-3">
              <div className="bg-green-50 p-4 rounded-xl">
                <p className="font-semibold text-green-800 mb-2">Correct Match</p>
                <p className="text-green-600">+10, +20, +30 points per correct answer (Easy, Normal, Hard)</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-xl">
                <p className="font-semibold text-purple-800 mb-2">Continuous Bonus</p>
                <div className="text-purple-600 space-y-1">
                  <p>• 5, 10, 15... up to x2.5 for streaks</p>
                </div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-xl">
                <p className="font-semibold text-yellow-800 mb-2">⚡ Speed Bonus</p>
                <div className="text-yellow-600 space-y-1">
                  <p>• 3 correct in 2s = +25 points</p>
                </div>
              </div>
              <div className="bg-red-50 p-4 rounded-xl">
                <p className="font-semibold text-red-800 mb-2">Incorrect Match</p>
                <p className="text-red-600">-0 points (continuous bonus resets)</p>
              </div>
            </div>
          </section>

          {/* Game Modes */}
          <section>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Game Modes</h3>
            <div className="grid gap-4">
              <div className="bg-blue-50 p-4 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  <h4 className="font-semibold text-blue-800">Normal Mode</h4>
                </div>
                <ul className="text-blue-600 space-y-1">
                  <li>• No time limit</li>
                  <li>• Progress through sets with celebrations</li>
                  <li>• Perfect for learning and practice</li>
                  <li>• Beautiful animations between sets</li>
                </ul>
              </div>
              <div className="bg-orange-50 p-4 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-orange-600" />
                  <h4 className="font-semibold text-orange-800">Timed Mode</h4>
                </div>
                <ul className="text-orange-600 space-y-1">
                  <li>• 60-second time limit</li>
                  <li>• Continuous play with infinite sets</li>
                  <li>• Focus on speed and accuracy</li>
                  <li>• Compete for high scores</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Tips */}
          <section>
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              Pro Tips
            </h3>
            <div className="space-y-2 text-gray-600">
              <p>• Build long combos for maximum points</p>
              <p>• Take your time in Normal mode to learn</p>
              <p>• Practice speed in Timed mode for better scores</p>
              <p>• Watch for visual feedback during drag and drop</p>
              <p>• Use the pause button in Timed mode if needed</p>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 text-center">
          <button
            onClick={onClose}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;