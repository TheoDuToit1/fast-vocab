import React from 'react';

interface DropZoneData {
  id: string;
  label: string;
  color: string;
}

interface QuizItem {
  id: string;
  name: string;
  image: string;
  category: string;
  hex?: string;
}

interface DropZoneProps {
  zone: DropZoneData;
  isHovered: boolean;
  matchedItem: QuizItem | null;
  onDragOver: (zoneId: string) => void;
  onDragLeave: () => void;
  onDrop: (zoneId: string, event: React.DragEvent) => void;
}

const DropZone: React.FC<DropZoneProps> = ({
  zone,
  isHovered,
  matchedItem,
  onDragOver,
  onDragLeave,
  onDrop
}) => {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    onDragOver(zone.id);
  };

  const handleDrop = (e: React.DragEvent) => {
    onDrop(zone.id, e);
  };

  if (matchedItem) {
    // If matchedItem is a number (has value property), render styled number text
    const isNumber = typeof (matchedItem as any).value === 'number';
    return (
      <div className="relative">
        <div className="w-32 h-32 rounded-full bg-green-100 border-4 border-green-400 flex items-center justify-center shadow-lg transform transition-all duration-500 ease-out animate-pulse">
          <div className="flex flex-col items-center gap-2 text-green-700">
            {isNumber ? (
              <span
                className={`text-4xl font-bold font-sans ${['text-pink-500','text-blue-500','text-green-500','text-yellow-500','text-purple-500','text-orange-500','text-emerald-500','text-cyan-500','text-fuchsia-500','text-lime-500'][(matchedItem as any).value % 10]}`}
                style={{ fontFamily: 'Comic Sans MS, Comic Sans, cursive, sans-serif' }}
              >
                {(matchedItem as any).value}
              </span>
            ) : matchedItem.hex ? (
              <div
                className="w-12 h-12 rounded-full border-2 border-green-500"
                style={{ background: matchedItem.hex }}
              />
            ) : (
            <img
              src={matchedItem.image}
              alt={matchedItem.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-green-500"
            />
            )}
            <span className="text-sm font-bold">✓ {zone.label}</span>
          </div>
        </div>
        
        {/* Success particles */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 rounded-full bg-green-400/20 animate-ping"></div>
        </div>
      </div>
    );
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={onDragLeave}
      onDrop={handleDrop}
      className={`
        relative w-32 h-32 rounded-full border-4 border-dashed
        flex items-center justify-center cursor-pointer
        transform transition-all duration-200 ease-out
        ${isHovered 
          ? 'border-blue-400 bg-blue-50 scale-110 ring-4 ring-blue-200 animate-pulse' 
          : 'border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50'
        }
      `}
    >
      <span className={`
        font-bold text-lg transition-colors duration-200
        ${isHovered ? 'text-blue-600' : 'text-gray-600'}
      `}>
        {zone.label}
      </span>
      
      {isHovered && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium animate-bounce">
          Drop here!
        </div>
      )}
      
      {/* Hover effect rings */}
      {isHovered && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 rounded-full bg-blue-400/10 animate-ping"></div>
          <div className="absolute inset-2 rounded-full bg-blue-400/10 animate-ping animation-delay-150"></div>
        </div>
      )}
    </div>
  );
};

export default DropZone;