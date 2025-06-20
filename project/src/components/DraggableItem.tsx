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
  onClick?: () => void;
  isSelected?: boolean;
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
  onDragEnd,
  onClick,
  isSelected
}) => {
  console.log('DraggableItem rendering:', item);
  
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
              className="text-4xl font-extrabold mb-3 break-words max-w-xs"
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
      draggable={true}
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
      onClick={onClick}
      className={`
        relative cursor-grab active:cursor-grabbing
        transform transition-all duration-200 ease-out
        ${isDragging ? 'scale-110 rotate-2 z-50' : 'hover:scale-105'}
        ${isIncorrect ? 'animate-shake' : ''}
        ${isSelected ? 'ring-4 ring-blue-400' : ''}
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
              className={`text-4xl font-extrabold select-none break-words max-w-xs`}
              style={{ color: item.hex || '#6366f1', fontFamily: 'Inter, sans-serif', lineHeight: '5rem' }}
            >
              {item.display}
            </span>
          ) : item.hex ? (
            <div
              className={`w-24 h-24 rounded-full border-4 border-gray-200 ${isDragging ? 'ring-4 ring-blue-400 ring-opacity-50' : ''} ${isIncorrect ? 'ring-4 ring-red-400 ring-opacity-50' : ''}`}
              style={{ background: item.hex }}
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
            />
          )}
        </div>
      </div>
      
      {isDragging && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium animate-pulse">
          Dragging...
        </div>
      )}
    </div>
  );
};

export default DraggableItem;