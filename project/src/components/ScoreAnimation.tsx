import React, { useEffect, useState } from 'react';

interface ScoreAnimationProps {
  points: number;
  x: number;
  y: number;
}

const ScoreAnimation: React.FC<ScoreAnimationProps> = ({ points, x, y }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 1400);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  const isNegative = points < 0;

  return (
    <div
      className="fixed pointer-events-none z-50 transform -translate-x-1/2"
      style={{ left: x, top: y }}
    >
      <div className="animate-score-float">
        <div className={`px-4 py-2 rounded-full font-bold text-lg shadow-2xl border-2 border-white ${
          isNegative 
            ? 'bg-gradient-to-r from-red-500 to-red-600 text-white' 
            : 'bg-gradient-to-r from-green-400 to-emerald-500 text-white'
        }`}>
          {isNegative ? points.toLocaleString() : `+${points.toLocaleString()}`}
        </div>
        
        {/* Sparkle Effects */}
        <div className="absolute inset-0 pointer-events-none">
          {!isNegative ? (
            <>
              <div className="absolute -top-1 -left-1 w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
              <div className="absolute -top-2 right-2 w-1 h-1 bg-yellow-300 rounded-full animate-ping animation-delay-300"></div>
              <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-green-300 rounded-full animate-ping animation-delay-150"></div>
            </>
          ) : (
            <>
              <div className="absolute -top-1 -left-1 w-2 h-2 bg-red-300 rounded-full animate-ping"></div>
              <div className="absolute -top-2 right-2 w-1 h-1 bg-red-200 rounded-full animate-ping animation-delay-300"></div>
              <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-red-400 rounded-full animate-ping animation-delay-150"></div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScoreAnimation;