import React, { useEffect, useState } from 'react';
import { Star, Zap, Trophy, Target } from 'lucide-react';

interface FlashMessageProps {
  isVisible: boolean;
  onComplete: () => void;
}

const FlashMessage: React.FC<FlashMessageProps> = ({ isVisible, onComplete }) => {
  const [currentMessage, setCurrentMessage] = useState('');

  const messages = [
    { text: 'WOW!', icon: Star, color: 'from-yellow-400 to-orange-500' },
    { text: 'FANTASTIC!', icon: Zap, color: 'from-purple-400 to-pink-500' },
    { text: 'AMAZING!', icon: Trophy, color: 'from-green-400 to-emerald-500' },
    { text: 'EXCELLENT!', icon: Target, color: 'from-blue-400 to-cyan-500' },
    { text: 'PERFECT!', icon: Star, color: 'from-red-400 to-rose-500' },
    { text: 'BRILLIANT!', icon: Zap, color: 'from-indigo-400 to-purple-500' },
    { text: 'SUPERB!', icon: Trophy, color: 'from-teal-400 to-green-500' },
    { text: 'OUTSTANDING!', icon: Target, color: 'from-orange-400 to-red-500' }
  ];

  useEffect(() => {
    if (isVisible) {
      // Pick a random message
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      setCurrentMessage(randomMessage.text);
      
      // Complete after 1.5 seconds
      const timer = setTimeout(onComplete, 1500);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  const messageData = messages.find(m => m.text === currentMessage) || messages[0];
  const IconComponent = messageData.icon;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div className="text-center animate-in zoom-in duration-300">
        {/* Main Flash Text */}
        <div className={`
          inline-flex items-center gap-4 px-12 py-6 rounded-3xl
          bg-gradient-to-r ${messageData.color} text-white
          shadow-2xl border-4 border-white
          transform animate-pulse scale-110
        `}>
          <IconComponent className="w-12 h-12 animate-bounce" />
          <span className="text-6xl font-black tracking-wider">
            {currentMessage}
          </span>
          <IconComponent className="w-12 h-12 animate-bounce animation-delay-150" />
        </div>
        
        {/* Sparkle Effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-8 left-1/4 w-6 h-6 text-yellow-400 animate-ping">
            <Star className="w-6 h-6" />
          </div>
          <div className="absolute -top-4 right-1/4 w-4 h-4 text-yellow-300 animate-ping animation-delay-300">
            <Star className="w-4 h-4" />
          </div>
          <div className="absolute -bottom-6 left-1/3 w-5 h-5 text-yellow-400 animate-ping animation-delay-150">
            <Star className="w-5 h-5" />
          </div>
          <div className="absolute -bottom-4 right-1/3 w-4 h-4 text-yellow-300 animate-ping animation-delay-500">
            <Star className="w-4 h-4" />
          </div>
          <div className="absolute top-1/2 -left-8 w-3 h-3 text-yellow-200 animate-ping animation-delay-700">
            <Star className="w-3 h-3" />
          </div>
          <div className="absolute top-1/2 -right-8 w-3 h-3 text-yellow-200 animate-ping animation-delay-900">
            <Star className="w-3 h-3" />
          </div>
        </div>

        {/* Ripple Effect */}
        <div className="absolute inset-0 pointer-events-none">
          <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${messageData.color} opacity-20 animate-ping`}></div>
          <div className={`absolute inset-4 rounded-3xl bg-gradient-to-r ${messageData.color} opacity-10 animate-ping animation-delay-300`}></div>
        </div>
      </div>
    </div>
  );
};

export default FlashMessage;