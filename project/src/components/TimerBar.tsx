import React, { useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import { GameSpeed } from '../types/game';

interface TimerBarProps {
  speed?: GameSpeed;
  isPlaying: boolean;
  isPaused: boolean;
  onTimeUp: () => void;
}

export interface TimerBarHandle {
  addTime: (percent: number) => void;
  subtractTime: (percent: number) => void;
}

const TimerBar = forwardRef<TimerBarHandle, TimerBarProps>(({ speed = 'normal', isPlaying, isPaused, onTimeUp }, ref) => {
  const [timeLeft, setTimeLeft] = useState(100); // Percentage

  // Get total time based on speed
  const getTotalTime = () => {
    switch (speed) {
      case 'slow':
        return 90; // 90 seconds
      case 'fast':
        return 30; // 30 seconds
      default:
        return 60; // 60 seconds for normal
    }
  };

  // Get color based on speed
  const getBarColor = () => {
    switch (speed) {
      case 'slow':
        return 'bg-blue-500';
      case 'fast':
        return 'bg-red-500';
      default:
        return 'bg-green-500';
    }
  };

  // Get background color based on speed
  const getBarBgColor = () => {
    switch (speed) {
      case 'slow':
        return 'bg-blue-100';
      case 'fast':
        return 'bg-red-100';
      default:
        return 'bg-green-100';
    }
  };

  // Reset timer when speed changes or game restarts
  useEffect(() => {
    setTimeLeft(100);
  }, [speed, isPlaying]);

  // Timer logic
  useEffect(() => {
    if (!isPlaying || isPaused) return;

    const totalTime = getTotalTime() * 1000; // Convert to milliseconds
    const interval = 100; // Update every 100ms for smooth animation
    const decrementPerInterval = (interval / totalTime) * 100;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - decrementPerInterval;
        if (newTime <= 0) {
          clearInterval(timer);
          onTimeUp();
          return 0;
        }
        return newTime;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [isPlaying, isPaused, speed, onTimeUp]);

  useImperativeHandle(ref, () => ({
    addTime: (percent: number) => {
      setTimeLeft(prev => Math.min(100, prev + percent));
    },
    subtractTime: (percent: number) => {
      setTimeLeft(prev => Math.max(0, prev - percent));
    }
  }), []);

  return (
    <div className="w-full h-6 rounded-full overflow-hidden shadow-lg border-2 border-white bg-gradient-to-r from-gray-100 via-white to-gray-100 my-2" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={timeLeft}>
      <div className={`h-full ${getBarBgColor()} relative transition-all duration-300`}> 
        <div 
          className={`absolute top-0 left-0 h-full ${getBarColor()} rounded-full shadow-md transition-all duration-100 ease-linear`}
          style={{ width: `${timeLeft}%` }}
        />
      </div>
    </div>
  );
});

export default TimerBar; 