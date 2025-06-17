import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Medal, Award, Home, Trash2, Filter, Clock, Target } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { GameMode } from '../types/game';

const LeaderboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { players, clearLeaderboard } = useGame();
  const [filterMode, setFilterMode] = useState<GameMode | 'all'>('all');

  const filteredPlayers = players.filter(player => 
    filterMode === 'all' || player.mode === filterMode
  );

  const sortedPlayers = [...filteredPlayers].sort((a, b) => b.score - a.score);

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 1:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 2:
        return <Award className="w-6 h-6 text-orange-500" />;
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-gray-500 font-bold">{index + 1}</span>;
    }
  };

  const getRankColor = (index: number) => {
    switch (index) {
      case 0:
        return 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200';
      case 1:
        return 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200';
      case 2:
        return 'bg-gradient-to-r from-orange-50 to-red-50 border-orange-200';
      default:
        return 'bg-white border-gray-100';
    }
  };

  const handleClearLeaderboard = () => {
    if (window.confirm('Are you sure you want to clear all scores? This action cannot be undone.')) {
      clearLeaderboard();
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-yellow-200/20 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-purple-200/20 rounded-full animate-pulse animation-delay-300"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-blue-200/20 rounded-full animate-pulse animation-delay-150"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center hover:bg-blue-200 transition-colors"
            >
              <Home className="w-6 h-6 text-blue-600" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-xl">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                Leaderboard
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {players.length > 0 && (
              <button
                onClick={handleClearLeaderboard}
                className="flex items-center gap-2 bg-red-100 text-red-600 px-4 py-2 rounded-xl font-semibold hover:bg-red-200 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-3 mb-8">
          <Filter className="w-5 h-5 text-gray-500" />
          <div className="flex gap-2">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-4 py-2 rounded-xl font-semibold transition-colors ${
                filterMode === 'all'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All Modes
            </button>
            <button
              onClick={() => setFilterMode('normal')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-colors ${
                filterMode === 'normal'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Target className="w-4 h-4" />
              Normal
            </button>
            <button
              onClick={() => setFilterMode('timed')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-colors ${
                filterMode === 'timed'
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Clock className="w-4 h-4" />
              Timed
            </button>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
          {sortedPlayers.length === 0 ? (
            <div className="text-center py-16">
              <Trophy className="w-24 h-24 mx-auto mb-6 text-gray-300" />
              <h2 className="text-2xl font-bold text-gray-400 mb-2">No Scores Yet!</h2>
              <p className="text-gray-500 mb-8">
                {filterMode === 'all' 
                  ? 'Be the first to play and set a record.'
                  : `No scores in ${filterMode} mode yet.`
                }
              </p>
              <button
                onClick={() => navigate('/')}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                Start Playing
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedPlayers.map((player, index) => (
                <div
                  key={`${player.name}-${player.timestamp}`}
                  className={`flex items-center gap-6 p-6 rounded-2xl border-2 ${getRankColor(index)} transition-all duration-200 hover:shadow-lg`}
                >
                  <div className="flex-shrink-0">
                    {getRankIcon(index)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <p className="font-bold text-xl text-gray-800 truncate">{player.name}</p>
                      <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                        player.mode === 'timed' 
                          ? 'bg-orange-100 text-orange-700' 
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {player.mode === 'timed' ? <Clock className="w-3 h-3" /> : <Target className="w-3 h-3" />}
                        {player.mode}
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">
                      {new Date(player.timestamp).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-bold text-2xl text-gray-800">{player.score.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">points</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            Play Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;