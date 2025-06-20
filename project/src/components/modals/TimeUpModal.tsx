import React from 'react';
import { Clock } from 'lucide-react';

interface TimeUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  score: number;
  correct: number;
  wrong: number;
}

const TimeUpModal: React.FC<TimeUpModalProps> = ({ isOpen, onClose, score, correct, wrong }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Vibrant gradient background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-100 via-pink-200 to-purple-200 opacity-90 animate-fade-in" />
      <div className="relative bg-white/90 backdrop-blur-lg rounded-3xl p-12 shadow-2xl transform animate-in zoom-in duration-500 max-w-lg w-full mx-4 text-center border-4 border-white">
        {/* Animated clock and confetti */}
        <div className="relative flex flex-col items-center mb-6">
          <div className="w-28 h-28 bg-gradient-to-tr from-orange-400 via-yellow-300 to-pink-400 rounded-full flex items-center justify-center shadow-xl animate-bounce-slow mb-2">
            <Clock className="w-16 h-16 text-white drop-shadow-lg animate-spin-slow" />
          </div>
          {/* Confetti effect (simple dots) */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-2 left-8 w-3 h-3 bg-pink-400 rounded-full animate-pulse" />
            <div className="absolute top-6 right-10 w-2 h-2 bg-yellow-400 rounded-full animate-ping" />
            <div className="absolute bottom-4 left-12 w-2 h-2 bg-purple-400 rounded-full animate-ping animation-delay-200" />
            <div className="absolute bottom-6 right-8 w-3 h-3 bg-orange-300 rounded-full animate-pulse animation-delay-300" />
          </div>
        </div>
        <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 mb-2 drop-shadow-lg animate-fade-in">Time's Up!</h2>
        <p className="text-lg text-gray-700 mb-4 animate-fade-in">Great effort! You finished the round.</p>
        <div className="text-6xl font-black text-purple-700 mb-8 animate-pop-in drop-shadow-xl">{score} <span className="text-2xl font-bold text-gray-500 align-super">points</span></div>
        {/* Stats Row */}
        <div className="flex justify-center gap-8 mb-8 animate-fade-in">
          <div className="flex flex-col items-center">
            <span className="text-3xl font-extrabold text-green-500">{correct}</span>
            <span className="text-sm font-semibold text-green-600 mt-1">Correct</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-extrabold text-red-500">{wrong}</span>
            <span className="text-sm font-semibold text-red-600 mt-1">Wrong</span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="px-12 py-5 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-2xl font-extrabold text-xl shadow-lg hover:from-purple-700 hover:to-pink-600 transform hover:scale-105 transition-all duration-200 animate-bounce"
        >
          View Results
        </button>
      </div>
    </div>
  );
};

export default TimeUpModal; 