import React, { useEffect, useState } from 'react';
import { Clock, Zap } from 'lucide-react';

interface CountdownTimerProps {
  onComplete: () => void;
  mode: 'normal' | 'timed' | 'study';
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ onComplete, mode }) => {
  const [count, setCount] = useState(3);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    let countdownTimer: NodeJS.Timeout;
    let cleanupTimer: NodeJS.Timeout;
    
    if (count > 0) {
      countdownTimer = setTimeout(() => {
        setCount(count - 1);
      }, 1000);
    } else if (count === 0) {
      // Show "GO!" for a moment before completing
      countdownTimer = setTimeout(() => {
        onComplete();
        cleanupTimer = setTimeout(() => {
          setIsVisible(false);
        }, 100);
      }, 1000);
    }

    return () => {
      if (countdownTimer) clearTimeout(countdownTimer);
      if (cleanupTimer) clearTimeout(cleanupTimer);
    };
  }, [count, onComplete]);

  // If not visible, unmount immediately
  if (!isVisible) return null;

  const getCountdownContent = () => {
    if (count === 0) {
      return {
        text: "GO!",
        icon: <Zap className="w-12 h-12 text-white" />,
        bgColor: "bg-gradient-to-r from-green-500 to-emerald-500",
        animation: "animate-pulse scale-125"
      };
    }

    return {
      text: count.toString(),
      icon: mode === 'timed' ? <Clock className="w-8 h-8 text-white" /> : null,
      bgColor: mode === 'timed' 
        ? "bg-gradient-to-r from-orange-500 to-red-500" 
        : "bg-gradient-to-r from-blue-500 to-purple-500",
      animation: "animate-bounce"
    };
  };

  const content = getCountdownContent();

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50">
      <div className="fixed inset-0 flex flex-col items-center justify-center">
        {/* Main Countdown Circle */}
        <div className={`relative w-40 h-40 ${content.bgColor} rounded-full shadow-2xl ${content.animation} flex items-center justify-center`}>
          {/* Pulsing Ring Effect */}
          <div className="absolute inset-0 rounded-full bg-white/20 animate-ping"></div>
          <div className="absolute inset-2 rounded-full bg-white/10 animate-ping animation-delay-150"></div>
          
          {/* Content */}
          <div className="relative z-10 h-24 flex flex-col items-center justify-center">
            {content.icon && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
            {content.icon}
              </div>
            )}
            <span className="text-6xl font-bold text-white">{content.text}</span>
          </div>
        </div>

        {/* Mode-specific Message */}
        <div className="mt-8 text-center">
          {mode === 'timed' ? (
            <>
              <p className="text-white text-2xl font-bold">Challenge Mode</p>
              <p className="text-white/80 text-lg">60 seconds to score as much as possible!</p>
              <div className="flex items-center justify-center gap-2 text-orange-300">
                <Clock className="w-5 h-5" />
                <span className="font-semibold">Speed & Accuracy Matter</span>
              </div>
            </>
          ) : (
            <>
              <p className="text-white text-2xl font-bold">Practice Mode</p>
              <p className="text-white/80 text-lg">Take your time and learn!</p>
              <div className="flex items-center justify-center gap-2 text-blue-300">
                <span className="font-semibold">No time pressure</span>
              </div>
            </>
          )}
        </div>

        {/* Floating Particles for Timed Mode */}
        {mode === 'timed' && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-orange-400 rounded-full animate-ping animation-delay-300"></div>
            <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-red-400 rounded-full animate-ping animation-delay-500"></div>
            <div className="absolute bottom-1/3 left-1/3 w-4 h-4 bg-yellow-400 rounded-full animate-ping animation-delay-700"></div>
            <div className="absolute bottom-1/4 right-1/3 w-2 h-2 bg-orange-300 rounded-full animate-ping animation-delay-900"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CountdownTimer;