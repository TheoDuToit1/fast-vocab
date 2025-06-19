import React from 'react';

interface QuizItem {
  id: string;
  name: string;
  image: string;
  category: string;
  hex?: string;
  display?: string;
}

interface DraggableItemProps {
  item: QuizItem;
  isDragging: boolean;
  isMatched: boolean;
  isIncorrect: boolean;
  onDragStart: (itemId: string) => void;
  onDragEnd: () => void;
}

const speakWord = (word: string) => {
  const utterance = new window.SpeechSynthesisUtterance(word);
  window.speechSynthesis.speak(utterance);
};

const DraggableItem: React.FC<DraggableItemProps> = ({
  item,
  isDragging,
  isMatched,
  isIncorrect,
  onDragStart,
  onDragEnd
}) => {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', item.id);
    onDragStart(item.id);
  };

  if (isMatched) {
    return (
      <div className="opacity-30 pointer-events-none transform scale-95 transition-all duration-300">
        <div className="w-36 h-44 flex flex-col items-center justify-center">
          {item.display !== undefined ? (
            <span
              className="text-6xl font-extrabold mb-3"
              style={{ color: item.hex || '#6366f1', fontFamily: 'Inter, sans-serif' }}
            >
              {item.display}
            </span>
          ) : item.hex ? (
            <div
              className="w-24 h-24 rounded-full mb-3 border-4 border-gray-200"
              style={{ background: item.hex }}
            />
          ) : (
            <img
              src={item.image}
              alt={item.name}
              className="w-24 h-24 object-cover rounded-2xl mb-3"
            />
          )}
          <span className="text-sm font-medium text-gray-500 text-center">{item.name}</span>
        </div>
      </div>
    );
  }

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
      className={`
        relative cursor-grab active:cursor-grabbing
        transform transition-all duration-200 ease-out
        ${isDragging ? 'scale-110 rotate-2 z-50' : 'hover:scale-105'}
        ${isIncorrect ? 'animate-shake' : ''}
      `}
    >
      <div className={`
        w-36 h-44 flex flex-col items-center justify-center
        transition-all duration-200
        ${isDragging ? 'drop-shadow-2xl' : 'hover:drop-shadow-lg'}
      `}>
        <div className="relative w-24 h-24 mb-3 flex items-center justify-center">
          {item.display !== undefined ? (
            <span
              className={`text-6xl font-extrabold select-none`}
              style={{ color: item.hex || '#6366f1', fontFamily: 'Inter, sans-serif', lineHeight: '5rem' }}
            >
              {item.display}
            </span>
          ) : item.hex ? (
            <div
              className={`w-24 h-24 rounded-full border-4 border-gray-200 ${isDragging ? 'ring-4 ring-blue-400 ring-opacity-50' : ''} ${isIncorrect ? 'ring-4 ring-red-400 ring-opacity-50' : ''}`}
              style={{ background: item.hex, cursor: 'pointer' }}
              onClick={() => speakWord(item.name)}
            />
          ) : (
            <img
              src={item.image}
              alt={item.name}
              className={`
                w-24 h-24 object-cover rounded-2xl
                transition-all duration-200
                ${isDragging ? 'ring-4 ring-blue-400 ring-opacity-50' : ''}
                ${isIncorrect ? 'ring-4 ring-red-400 ring-opacity-50' : ''}
              `}
              draggable={false}
              onClick={() => speakWord(item.name)}
              style={{ cursor: 'pointer' }}
            />
          )}
          {item.display === undefined && (
          <button
            type="button"
            onClick={e => { e.stopPropagation(); speakWord(item.name); }}
            style={{
              position: 'absolute',
              bottom: 4,
              right: 4,
              background: 'rgba(255,255,255,0.8)',
              border: 'none',
              borderRadius: '50%',
              width: 28,
              height: 28,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
            }}
            aria-label={`Play audio for ${item.name}`}
          >
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 8V12H7L11 16V4L7 8H3Z" fill="#6366f1"/>
              <path d="M15.54 8.46C16.4776 9.39763 16.4776 10.9024 15.54 11.84" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M17.66 6.34C19.4021 8.08213 19.4021 11.2179 17.66 12.96" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
          )}
        </div>
      </div>
      
      {isDragging && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium animate-pulse">
          Dragging...
        </div>
      )}
      
      {isIncorrect && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium animate-bounce">
          -100 points!
        </div>
      )}
    </div>
  );
};

export default DraggableItem;