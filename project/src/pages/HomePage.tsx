import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Trophy, HelpCircle, Volume2, Star, Zap, Target, BookOpen, Globe, Gamepad2, Eye, Settings } from 'lucide-react';
import { useGame } from '../context/GameContext';
import HelpModal from '../components/modals/HelpModal';
import { categories } from '../data/categories';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { players } = useGame();
  const [showHelp, setShowHelp] = useState(false);

  const topPlayers = [...players]
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const handleStartGame = () => {
    navigate('/categories');
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background Elements - enhanced */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-10 left-10 w-56 h-56 bg-gradient-to-br from-blue-300 via-purple-200 to-pink-200 rounded-full blur-2xl opacity-60 animate-pulse"></div>
        <div className="absolute top-1/2 right-20 w-40 h-40 bg-gradient-to-br from-purple-200 via-pink-200 to-blue-200 rounded-full blur-2xl opacity-50 animate-pulse animation-delay-300"></div>
        <div className="absolute bottom-32 left-1/4 w-72 h-72 bg-gradient-to-br from-pink-200 via-blue-200 to-purple-200 rounded-full blur-2xl opacity-40 animate-pulse animation-delay-150"></div>
        <div className="absolute bottom-10 right-1/3 w-44 h-44 bg-gradient-to-br from-indigo-200 via-blue-200 to-pink-200 rounded-full blur-2xl opacity-50 animate-pulse animation-delay-300"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        {/* Header - more vibrant */}
        <div className="text-center mb-16">
          {/* Tagline */}
          <div className="text-lg sm:text-xl font-bold text-blue-400 mb-2 animate-fade-in-up tracking-wide uppercase">Unlock English, One Game at a Time!</div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-2">
            <img
              src="/savi-explorer.png"
              alt="Logo"
              className="w-56 h-56 sm:w-[28rem] sm:h-[28rem] max-w-full object-contain drop-shadow-xl animate-float"
              style={{ minWidth: 180 }}
            />
            <h1 className="text-5xl sm:text-7xl font-extrabold bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent animate-gradient-x animate-float-slow">
              Savi Vocab
            </h1>
          </div>
          <p className="text-2xl text-gray-700 max-w-2xl mx-auto mb-4 font-semibold animate-fade-in">
            Master vocabulary through interactive drag-and-drop games. Choose from multiple categories and challenge yourself!
          </p>
          {/* Category Icons Row */}
          <div className="flex flex-wrap justify-center gap-5 mb-6 animate-fade-in-up">
            {Object.values(categories).filter(cat => !['food','clothes'].includes(cat.id)).map(cat => (
              <div key={cat.id} className="flex flex-col items-center group cursor-pointer transition-transform hover:scale-110">
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-lg bg-gradient-to-br from-white/80 to-blue-100 group-hover:from-blue-100 group-hover:to-white/80 animate-bounce-slow">
                  {cat.icon}
                </div>
                <span className="mt-2 text-base font-bold text-gray-600 group-hover:text-blue-500 transition-colors">{cat.name}</span>
              </div>
            ))}
          </div>
          {/* Main CTA - bolder, animated */}
          <button
            onClick={handleStartGame}
            className="group relative bg-gradient-to-r from-purple-600 via-blue-500 to-green-400 text-white px-14 py-4 rounded-3xl font-extrabold text-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 mb-4 animate-glow animate-bounce"
          >
            <div className="flex items-center gap-4">
              <Play className="w-8 h-8" />
              Start Learning
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-400 rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
          </button>
        </div>

        {/* Features Grid - glassy, vibrant */}
        <div className="grid md:grid-cols-3 gap-10 mb-20">
          {/* Multiple Categories */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
            <div className="relative bg-white/80 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border border-white/30 hover:shadow-3xl transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mb-5 shadow-lg">
                <Globe className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-extrabold text-gray-800 mb-3 font-[Comic_Sans_MS,Comic_Neue,cursive,Inter,sans-serif]">Multiple Categories</h3>
              <p className="text-gray-700 text-lg font-medium">Animals, Colors, Food, Sports, and more categories to explore and master.</p>
            </div>
          </div>
          {/* Study Mode */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-teal-500 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
            <div className="relative bg-white/80 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border border-white/30 hover:shadow-3xl transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mb-5 shadow-lg">
                <Eye className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-extrabold text-gray-800 mb-3 font-[Comic_Sans_MS,Comic_Neue,cursive,Inter,sans-serif]">Study Mode</h3>
              <p className="text-gray-700 text-lg font-medium">Preview and learn vocabulary before taking quizzes. Perfect for beginners!</p>
            </div>
          </div>
          {/* Progress Tracking */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-500 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
            <div className="relative bg-white/80 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border border-white/30 hover:shadow-3xl transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-5 shadow-lg">
                <Trophy className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-extrabold text-gray-800 mb-3 font-[Comic_Sans_MS,Comic_Neue,cursive,Inter,sans-serif]">Track Progress</h3>
              <p className="text-gray-700 text-lg font-medium">Leaderboards, scoring system, and continuous bonus to track your improvement.</p>
            </div>
          </div>
        </div>

        {/* Learning Modes Preview - glassy, vibrant */}
        <div className="grid md:grid-cols-3 gap-10 mb-20">
          {/* Study Mode */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
            <div className="relative bg-white/80 backdrop-blur-2xl rounded-3xl p-10 shadow-2xl border border-white/30 hover:shadow-3xl transition-all duration-300">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                  <img src="/savi-explorer.png" alt="Logo" className="w-14 h-14 object-contain rounded-full" />
                </div>
                <h2 className="text-3xl font-extrabold text-gray-800 font-[Comic_Sans_MS,Comic_Neue,cursive,Inter,sans-serif]">Study Mode</h2>
              </div>
              <ul className="space-y-4 mb-6 text-gray-700 text-lg font-medium">
                <li className="flex items-center gap-3">
                  <Star className="w-6 h-6 text-green-500" />
                  <span>Preview all vocabulary first</span>
                </li>
                <li className="flex items-center gap-3">
                  <Star className="w-6 h-6 text-green-500" />
                  <span>Learn names and categories</span>
                </li>
                <li className="flex items-center gap-3">
                  <Star className="w-6 h-6 text-green-500" />
                  <span>No pressure environment</span>
                </li>
              </ul>
            </div>
          </div>
          {/* Practice Mode */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
            <div className="relative bg-white/80 backdrop-blur-2xl rounded-3xl p-10 shadow-2xl border border-white/30 hover:shadow-3xl transition-all duration-300">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                  <Target className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-extrabold text-gray-800 font-[Comic_Sans_MS,Comic_Neue,cursive,Inter,sans-serif]">Practice Mode</h2>
              </div>
              <ul className="space-y-4 mb-6 text-gray-700 text-lg font-medium">
                <li className="flex items-center gap-3">
                  <Star className="w-6 h-6 text-blue-500" />
                  <span>No time pressure</span>
                </li>
                <li className="flex items-center gap-3">
                  <Star className="w-6 h-6 text-blue-500" />
                  <span>Progress through sets</span>
                </li>
                <li className="flex items-center gap-3">
                  <Star className="w-6 h-6 text-blue-500" />
                  <span>Celebration animations</span>
                </li>
              </ul>
            </div>
          </div>
          {/* Challenge Mode */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-500 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
            <div className="relative bg-white/80 backdrop-blur-2xl rounded-3xl p-10 shadow-2xl border border-white/30 hover:shadow-3xl transition-all duration-300">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-lg">
                  <Zap className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-extrabold text-gray-800 font-[Comic_Sans_MS,Comic_Neue,cursive,Inter,sans-serif]">Challenge Mode</h2>
              </div>
              <ul className="space-y-4 mb-6 text-gray-700 text-lg font-medium">
                <li className="flex items-center gap-3">
                  <Zap className="w-6 h-6 text-orange-500" />
                  <span>60-second time challenges</span>
                </li>
                <li className="flex items-center gap-3">
                  <Zap className="w-6 h-6 text-orange-500" />
                  <span>Test your speed and accuracy</span>
                </li>
                <li className="flex items-center gap-3">
                  <Zap className="w-6 h-6 text-orange-500" />
                  <span>Compete for high scores</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Leaderboard Preview - glassy, vibrant */}
        <div className="bg-white/80 backdrop-blur-2xl rounded-3xl p-10 shadow-2xl border border-white/30 mb-12">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                <Trophy className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-3xl font-extrabold text-gray-800 font-[Comic_Sans_MS,Comic_Neue,cursive,Inter,sans-serif]">Top Players</h3>
            </div>
            <button
              onClick={() => navigate('/leaderboard')}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-2xl font-bold text-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              View All
            </button>
          </div>
          {topPlayers.length > 0 ? (
            <div className="space-y-4">
              {topPlayers.map((player, index) => (
                <div key={`${player.name}-${player.timestamp}`} className="flex items-center gap-5 p-5 bg-gray-50/80 rounded-2xl shadow-md">
                  <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 text-lg">{player.name}</p>
                    <p className="text-sm text-gray-500 capitalize">{player.mode} mode</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-2xl text-gray-800">{player.score.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Trophy className="w-20 h-20 mx-auto mb-6 opacity-30" />
              <p className="text-2xl">No scores yet!</p>
              <p>Be the first to play and set a record.</p>
            </div>
          )}
        </div>

        {/* Action Buttons - glassy */}
        <div className="flex justify-center gap-6 mb-8">
          <button
            onClick={() => setShowHelp(true)}
            className="flex items-center gap-3 bg-white/80 backdrop-blur-2xl text-gray-700 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white transition-colors shadow-xl"
          >
            <HelpCircle className="w-6 h-6" />
            How to Play
          </button>
          <button className="flex items-center gap-3 bg-white/80 backdrop-blur-2xl text-gray-700 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white transition-colors shadow-xl">
            <Volume2 className="w-6 h-6" />
            Sound Settings
          </button>
          <button
            onClick={() => navigate('/admin')}
            className="flex items-center gap-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <Settings className="w-6 h-6" />
            Admin Panel
          </button>
        </div>
      </div>

      <HelpModal
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
      />
    </div>
  );
};

export default HomePage;