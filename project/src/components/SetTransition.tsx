import React, { useEffect } from 'react';
import { ArrowRight, Star } from 'lucide-react';

interface SetTransitionProps {
  isVisible: boolean;
  setNumber: number;
  onComplete: () => void;
}

const SetTransition: React.FC<SetTransitionProps> = ({
  isVisible,
  setNumber,
  onComplete
}) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onComplete, 2000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-600/90 to-blue-600/90 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="text-center text-white">
        {/* Animated Arrow */}
        <div className="relative mb-8">
          <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto animate-pulse">
            <ArrowRight className="w-12 h-12 text-white animate-bounce" />
          </div>
          
          {/* Floating Stars */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-4 -left-4 w-4 h-4 text-yellow-300 animate-ping">
              <Star className="w-4 h-4" />
            </div>
            <div className="absolute -top-2 right-2 w-3 h-3 text-yellow-200 animate-ping animation-delay-300">
              <Star className="w-3 h-3" />
            </div>
            <div className="absolute bottom-0 -left-2 w-3 h-3 text-yellow-400 animate-ping animation-delay-150">
              <Star className="w-3 h-3" />
            </div>
            <div className="absolute -bottom-2 right-4 w-4 h-4 text-yellow-300 animate-ping animation-delay-500">
              <Star className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Text */}
        <div className="space-y-4">
          <h2 className="text-4xl font-bold animate-pulse">Moving to Set {setNumber}</h2>
          <p className="text-xl text-white/80">Get ready for new challenges!</p>
          
          {/* Loading Bar */}
          <div className="w-64 h-2 bg-white/20 rounded-full mx-auto overflow-hidden">
            <div className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-loading-bar"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetTransition;