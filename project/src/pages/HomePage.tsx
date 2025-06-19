import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Trophy, HelpCircle, Volume2, Star, Zap, Target, BookOpen, Globe, Gamepad2, Eye } from 'lucide-react';
import { useGame } from '../context/GameContext';
import HelpModal from '../components/modals/HelpModal';

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
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200/30 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-purple-200/30 rounded-full animate-pulse animation-delay-300"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-pink-200/30 rounded-full animate-pulse animation-delay-150"></div>
        <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-indigo-200/30 rounded-full animate-pulse animation-delay-300"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-6">
            <img
              src="/savi-explorer.png"
              alt="Logo"
              className="w-56 h-56 sm:w-[28rem] sm:h-[28rem] max-w-full object-contain"
              style={{ minWidth: 180 }}
            />
            <h1 className="text-5xl sm:text-7xl font-extrabold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Savi Vocab
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Master vocabulary through interactive drag-and-drop games. Choose from multiple categories and challenge yourself!
          </p>
          
          {/* Main CTA */}
          <button
            onClick={handleStartGame}
            className="group relative bg-gradient-to-r from-purple-600 to-blue-600 text-white px-12 py-4 rounded-2xl font-bold text-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 mb-8"
          >
            <div className="flex items-center gap-3">
              <Play className="w-7 h-7" />
              Start Learning
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-400 rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
          </button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Multiple Categories */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Multiple Categories</h3>
              <p className="text-gray-600">Animals, Colors, Food, Sports, and more categories to explore and master.</p>
            </div>
          </div>

          {/* Study Mode */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-teal-500 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mb-4">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Study Mode</h3>
              <p className="text-gray-600">Preview and learn vocabulary before taking quizzes. Perfect for beginners!</p>
            </div>
          </div>

          {/* Progress Tracking */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-500 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Track Progress</h3>
              <p className="text-gray-600">Leaderboards, scoring system, and continuous bonus to track your improvement.</p>
            </div>
          </div>
        </div>

        {/* Learning Modes Preview */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Study Mode */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                  <img src="/savi-explorer.png" alt="Logo" className="w-12 h-12 object-contain rounded-full" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Study Mode</h2>
              </div>
              
              <ul className="space-y-3 mb-6 text-gray-600">
                <li className="flex items-center gap-3">
                  <Star className="w-5 h-5 text-green-500" />
                  <span>Preview all vocabulary first</span>
                </li>
                <li className="flex items-center gap-3">
                  <Star className="w-5 h-5 text-green-500" />
                  <span>Learn names and categories</span>
                </li>
                <li className="flex items-center gap-3">
                  <Star className="w-5 h-5 text-green-500" />
                  <span>No pressure environment</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Practice Mode */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Practice Mode</h2>
              </div>
              
              <ul className="space-y-3 mb-6 text-gray-600">
                <li className="flex items-center gap-3">
                  <Star className="w-5 h-5 text-blue-500" />
                  <span>No time pressure</span>
                </li>
                <li className="flex items-center gap-3">
                  <Star className="w-5 h-5 text-blue-500" />
                  <span>Progress through sets</span>
                </li>
                <li className="flex items-center gap-3">
                  <Star className="w-5 h-5 text-blue-500" />
                  <span>Celebration animations</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Challenge Mode */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-500 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Challenge Mode</h2>
              </div>
              
              <ul className="space-y-3 mb-6 text-gray-600">
                <li className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-orange-500" />
                  <span>60-second time challenges</span>
                </li>
                <li className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-orange-500" />
                  <span>Test your speed and accuracy</span>
                </li>
                <li className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-orange-500" />
                  <span>Compete for high scores</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Leaderboard Preview */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Top Players</h3>
            </div>
            <button
              onClick={() => navigate('/leaderboard')}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              View All
            </button>
          </div>

          {topPlayers.length > 0 ? (
            <div className="space-y-3">
              {topPlayers.map((player, index) => (
                <div key={`${player.name}-${player.timestamp}`} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{player.name}</p>
                    <p className="text-sm text-gray-500 capitalize">{player.mode} mode</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg text-gray-800">{player.score.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Trophy className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg">No scores yet!</p>
              <p>Be the first to play and set a record.</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <button
            onClick={() => setShowHelp(true)}
            className="flex items-center gap-2 bg-white/90 backdrop-blur-sm text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-white transition-colors shadow-lg"
          >
            <HelpCircle className="w-5 h-5" />
            How to Play
          </button>
          <button className="flex items-center gap-2 bg-white/90 backdrop-blur-sm text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-white transition-colors shadow-lg">
            <Volume2 className="w-5 h-5" />
            Sound Settings
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