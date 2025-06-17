import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Play, Clock, Target, HelpCircle } from 'lucide-react';
import GameModeModal from '../components/modals/GameModeModal';
import HelpModal from '../components/modals/HelpModal';
import { GameMode } from '../types/game';
import { categories as categoriesData } from '../data/categories';

interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  image: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | undefined;
  itemCount: number;
}

const categories = [
  categoriesData.animals,
  categoriesData.colors,
  categoriesData.alphabet,
  categoriesData.numbers
];

const CategoryPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showModeModal, setShowModeModal] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setShowModeModal(true);
  };

  const handleModeSelect = (settings: { mode: GameMode, speed?: string, difficulty?: string }) => {
    if (selectedCategory) {
      if (settings.mode === 'study') {
        setShowModeModal(false);
        setTimeout(() => {
          const session = Math.random().toString(36).slice(2);
          navigate(`/quiz/${selectedCategory}?mode=study&fromModal=1&session=${session}`);
        }, 0);
      } else {
        let url = `/quiz/${selectedCategory}?mode=${settings.mode}`;
        if (settings.speed) url += `&speed=${settings.speed}`;
        if (settings.difficulty) url += `&difficulty=${settings.difficulty}`;
        navigate(url);
      }
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'starter': return 'bg-green-100 text-green-700';
      case 'mover': return 'bg-blue-100 text-blue-700';
      case 'flyer': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200/20 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-purple-200/20 rounded-full animate-pulse animation-delay-300"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-pink-200/20 rounded-full animate-pulse animation-delay-150"></div>
        <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-indigo-200/20 rounded-full animate-pulse animation-delay-300"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center hover:bg-blue-200 transition-colors"
            >
              <Home className="w-6 h-6 text-blue-600" />
            </button>
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Choose Category
              </h1>
              <p className="text-xl text-gray-600 mt-2">Select a topic to start learning</p>
            </div>
          </div>

          <button
            onClick={() => setShowHelp(true)}
            className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <HelpCircle className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Categories Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => handleCategorySelect(category.id)}
              className="group relative cursor-pointer transform hover:scale-105 transition-all duration-300"
            >
              {/* Glow Effect */}
              <div className={`absolute inset-0 bg-gradient-to-r ${category.color} rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300`}></div>
              
              {/* Card */}
              <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-20`}></div>
                  
                  {/* Icon Overlay */}
                  <div className="absolute top-4 right-4 w-12 h-12 bg-white/90 rounded-full flex items-center justify-center text-2xl">
                    {category.icon}
                  </div>
                  
                  {/* Difficulty Badge */}
                  {category.difficulty && (
                  <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-semibold ${getDifficultyColor(category.difficulty)}`}>
                    {category.difficulty}
                  </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-2xl font-bold text-gray-800">{category.name}</h2>
                    <span className="text-sm text-gray-500">{category.itemCount} items</span>
                  </div>
                  <p className="text-gray-600 mb-4">{category.description}</p>
                  <button
                    className={`w-full py-3 rounded-xl font-semibold text-white transition-colors ${
                      category.id === 'animals'
                        ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                        : category.id === 'colors'
                        ? 'bg-gradient-to-r from-pink-400 to-rose-500'
                        : 'bg-gradient-to-r from-yellow-400 to-orange-500'
                    }`}
                  >
                    <Play className="inline w-5 h-5 mr-2" /> Start Learning
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Coming Soon Categories */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Coming Soon</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {['Geography', 'Science', 'Music'].map((name, index) => (
              <div key={name} className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 text-center border-2 border-dashed border-gray-300">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🔒</span>
                </div>
                <h3 className="text-xl font-bold text-gray-600 mb-2">{name}</h3>
                <p className="text-gray-500">New category coming soon!</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      {!(location.search.includes('mode=study')) && (
      <GameModeModal
        isOpen={showModeModal}
          onSelectSettings={handleModeSelect}
        onClose={() => {
          setShowModeModal(false);
          setSelectedCategory(null);
        }}
      />
      )}

      <HelpModal
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
      />
    </div>
  );
};

export default CategoryPage;