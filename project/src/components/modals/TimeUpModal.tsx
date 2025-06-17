import React from 'react';
import { Clock } from 'lucide-react';

interface TimeUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  score: number;
}

const TimeUpModal: React.FC<TimeUpModalProps> = ({ isOpen, onClose, score }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-8 shadow-2xl transform animate-in zoom-in duration-300 max-w-md w-full mx-4 text-center">
        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Clock className="w-8 h-8 text-orange-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Time's Up!</h2>
        <p className="text-gray-600 mb-6">Great effort! You scored:</p>
        <div className="text-4xl font-bold text-purple-600 mb-8">{score} points</div>
        <button
          onClick={onClose}
          className="px-8 py-4 bg-purple-500 text-white rounded-xl font-semibold hover:bg-purple-600 transition-colors"
        >
          View Results
        </button>
      </div>
    </div>
  );
};

export default TimeUpModal; 