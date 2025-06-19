import React, { useState } from 'react';
import { Trophy, Medal, Award, X } from 'lucide-react';
import { Player } from '../../types/game';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBackToCategories: () => void;
  players: Player[];
  clearLeaderboard: () => void;
}

const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ isOpen, onClose, onBackToCategories, players, clearLeaderboard }) => {
  if (!isOpen) return null;

  // Tab state: 'all', 'normal' (Practice), or 'timed' (Challenge)
  const [tab, setTab] = useState<'all' | 'normal' | 'timed'>('all');
  const [category, setCategory] = useState('all');
  const [difficulty, setDifficulty] = useState('all');

  // Get unique categories and difficulties from players
  const categories = Array.from(new Set(players.map(p => p.category).filter(Boolean)));
  const difficulties = Array.from(new Set(players.map(p => p.difficulty).filter(Boolean)));

  // Filter players by selected mode, category, and difficulty
  const filteredPlayers = players.filter(p =>
    (tab === 'all' || p.mode === tab) &&
    (category === 'all' || !p.category || p.category === category) &&
    (difficulty === 'all' || !p.difficulty || p.difficulty === difficulty)
  );
  const sortedPlayers = [...filteredPlayers].sort((a, b) => b.score - a.score);

  // Fixed lists for all possible categories and difficulties
  const allCategories = [
    { value: 'animals', label: 'Animals' },
    { value: 'colors', label: 'Colors' },
    { value: 'alphabet', label: 'Alphabet' },
    // Add more categories here if needed
  ];
  const allDifficulties = [
    { value: 'starter', label: 'Starter' },
    { value: 'mover', label: 'Mover' },
    { value: 'flyer', label: 'Flyer' },
  ];

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
        return 'bg-yellow-50 border-yellow-200';
      case 1:
        return 'bg-gray-50 border-gray-200';
      case 2:
        return 'bg-orange-50 border-orange-200';
      default:
        return 'bg-white border-gray-100';
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center z-50">
      <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-0 shadow-2xl transform animate-in zoom-in duration-300 max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden border-4 border-white">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-500 rounded-t-3xl px-10 py-8 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-white/30 rounded-full flex items-center justify-center shadow-xl">
              <Trophy className="w-12 h-12 text-yellow-100 drop-shadow-lg" />
            </div>
            <h2 className="text-4xl font-extrabold text-white drop-shadow-lg tracking-tight">Leaderboard</h2>
          </div>
          <button
            onClick={onBackToCategories}
            className="w-12 h-12 bg-white/30 rounded-full flex items-center justify-center hover:bg-white/60 transition-colors shadow-lg"
            title="Back to Categories"
          >
            <X className="w-7 h-7 text-white" />
          </button>
        </div>

        {/* Clear Leaderboard Button */}
        <div className="flex justify-end px-10 pt-6">
          <button
            onClick={clearLeaderboard}
            className="px-6 py-2 rounded-xl bg-gradient-to-r from-red-400 to-pink-500 text-white font-bold shadow hover:from-red-500 hover:to-pink-600 transition-all text-base"
          >
            Clear Leaderboard
          </button>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-4 mt-4 mb-6">
          <button
            className={`px-6 py-2 rounded-full font-semibold transition-colors ${tab === 'all' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            onClick={() => setTab('all')}
          >
            All Modes
          </button>
          <button
            className={`px-6 py-2 rounded-full font-semibold transition-colors ${tab === 'normal' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-blue-100'}`}
            onClick={() => setTab('normal')}
          >
            Practice Mode
          </button>
          <button
            className={`px-6 py-2 rounded-full font-semibold transition-colors ${tab === 'timed' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-orange-100'}`}
            onClick={() => setTab('timed')}
          >
            Challenge Mode
          </button>
        </div>

        {/* Filters */}
        <div className="flex justify-center gap-4 mb-6">
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-700 focus:outline-none"
          >
            <option value="all">All Categories</option>
            {allCategories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
          <select
            value={difficulty}
            onChange={e => setDifficulty(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-700 focus:outline-none"
          >
            <option value="all">All Difficulties</option>
            {allDifficulties.map(diff => (
              <option key={diff.value} value={diff.value}>{diff.label}</option>
            ))}
          </select>
        </div>

        <div className="space-y-4 overflow-y-auto max-h-[45vh] px-10 pb-10">
          {sortedPlayers.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <Trophy className="w-24 h-24 mx-auto mb-6 opacity-30" />
              <h2 className="text-2xl font-bold mb-2">No Scores Yet!</h2>
              <p className="mb-8">Be the first to play and set a record.</p>
            </div>
          ) : (
            sortedPlayers.map((player, index) => (
              <div
                key={`${player.name}-${player.timestamp}`}
                className={`flex items-center gap-8 p-6 rounded-2xl border-2 ${getRankColor(index)} transition-all duration-200 shadow hover:shadow-xl bg-white/80`}
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
                      {player.mode}
                    </div>
                    {player.category && <span className="ml-2 px-2 py-1 rounded bg-gray-100 text-gray-700 text-xs">{player.category}</span>}
                    {player.difficulty && <span className="ml-2 px-2 py-1 rounded bg-gray-100 text-gray-700 text-xs">{player.difficulty}</span>}
                    {player.speed && <span className="ml-2 px-2 py-1 rounded bg-gray-100 text-gray-700 text-xs">{player.speed}</span>}
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
                  <p className="font-bold text-2xl text-purple-700">{player.score.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">points</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaderboardModal;