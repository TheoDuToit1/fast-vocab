import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Play, Clock, Target, HelpCircle } from 'lucide-react';
import GameModeModal from '../components/modals/GameModeModal';
import HelpModal from '../components/modals/HelpModal';
import { GameMode } from '../types/game';
import { categories as categoriesData } from '../data/categories';
import { useGame } from '../context/GameContext';

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
  categoriesData.numbers,
  categoriesData.clothes,
  categoriesData.food,
].filter(category => category.id !== 'food' && category.id !== 'clothes');

const CategoryPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { updateGameState } = useGame();
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
          navigate(`/quiz/${selectedCategory}?mode=study`);
        }, 0);
      } else {
        updateGameState({ gameSessionId: Date.now() });
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
              {/* Vibrant Animated Glow */}
              <div className={`absolute -inset-2 bg-gradient-to-br ${category.id === 'animals'
                ? 'from-green-300 via-emerald-400 to-green-500'
                : category.id === 'colors'
                ? 'from-pink-300 via-rose-400 to-pink-500'
                : category.id === 'clothes'
                ? 'from-purple-300 via-violet-400 to-purple-500'
                : category.id === 'food'
                ? 'from-red-300 via-yellow-400 to-red-500'
                : 'from-yellow-300 via-orange-400 to-yellow-500'}
                rounded-3xl blur-2xl opacity-60 group-hover:opacity-90 animate-pulse pointer-events-none z-0 transition-all duration-500`}></div>
              {/* Card */}
              <div className="relative bg-white/70 backdrop-blur-2xl rounded-3xl overflow-hidden shadow-2xl border border-white/30 hover:shadow-3xl transition-all duration-300 z-10 group-hover:ring-4 group-hover:ring-offset-2 group-hover:ring-green-200/60">
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${category.id === 'animals'
                    ? 'from-green-400/30 to-transparent'
                    : category.id === 'colors'
                    ? 'from-pink-400/30 to-transparent'
                    : category.id === 'clothes'
                    ? 'from-purple-400/30 to-transparent'
                    : category.id === 'food'
                    ? 'from-red-400/30 to-transparent'
                    : 'from-yellow-400/30 to-transparent'} opacity-40`}></div>
                  {/* Animated Icon Badge */}
                  <div className="absolute top-4 right-4 w-14 h-14 bg-white/90 rounded-full flex items-center justify-center text-3xl shadow-xl group-hover:animate-bounce group-hover:scale-110 transition-all duration-300 border-2 border-white">
                    {category.icon}
                  </div>
                  {/* Prominent Item Count Badge */}
                  <div className="absolute bottom-4 left-4 px-4 py-1 rounded-full text-base font-bold bg-white/90 text-gray-700 shadow-md border border-gray-200">
                    {category.itemCount} items
                  </div>
                  {/* Difficulty Badge (if any) */}
                  {category.difficulty && (
                    <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-semibold ${getDifficultyColor(category.difficulty)}`}>
                      {category.difficulty}
                    </div>
                  )}
                </div>
                {/* Content */}
                <div className="p-7">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight font-[Comic_Sans_MS,Comic_Neue,cursive,Inter,sans-serif] drop-shadow-sm">
                      {category.name}
                    </h2>
                  </div>
                  <p className="text-gray-600 mb-6 text-lg font-medium">{category.description}</p>
                  <button
                    className={`w-full py-4 rounded-2xl font-bold text-lg shadow-lg transition-all duration-300 flex items-center justify-center gap-2
                      bg-gradient-to-r
                      ${category.id === 'animals'
                        ? 'from-green-400 via-emerald-500 to-green-600 hover:from-emerald-500 hover:to-green-400'
                        : category.id === 'colors'
                        ? 'from-pink-400 via-rose-500 to-pink-600 hover:from-rose-500 hover:to-pink-400'
                        : category.id === 'clothes'
                        ? 'from-purple-400 via-violet-500 to-purple-600 hover:from-violet-500 hover:to-purple-400'
                        : category.id === 'food'
                        ? 'from-red-400 via-yellow-500 to-red-600 hover:from-yellow-500 hover:to-red-400'
                        : 'from-yellow-400 via-orange-500 to-yellow-600 hover:from-orange-500 hover:to-yellow-400'}
                      hover:scale-105 hover:shadow-2xl animate-gradient-x bg-[length:200%_200%] bg-left hover:bg-right
                    `}
                  >
                    <Play className="inline w-6 h-6 mr-2" /> Start Learning
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Coming Soon Categories */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Coming Soon</h2>
          <div className="flex flex-wrap justify-center gap-6">
            {[categoriesData.clothes, categoriesData.food].map((category) => (
              <div key={category.id} className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 text-center border-2 border-dashed border-gray-300 flex flex-col items-center w-80">
                <div className="w-20 h-20 rounded-2xl overflow-hidden mx-auto mb-4 relative flex items-center justify-center bg-gray-100">
                  <img src={category.image} alt={category.name} className="w-full h-full object-cover opacity-60" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl bg-white/80 rounded-full p-2"><span role='img' aria-label='locked'>🔒</span></span>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-2xl">{category.icon}</span>
                  <h3 className="text-xl font-bold text-gray-600">{category.name}</h3>
                </div>
                <p className="text-gray-500">This category is coming soon!</p>
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