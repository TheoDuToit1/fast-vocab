import React, { useState } from 'react';
import { Trophy, Medal, Award, X } from 'lucide-react';
import { Player } from '../../types/game';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  players: Player[];
  clearLeaderboard: () => void;
}

const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ isOpen, onClose, players, clearLeaderboard }) => {
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-8 shadow-2xl transform animate-in zoom-in duration-300 max-w-md w-full mx-4 max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <Trophy className="w-6 h-6 text-yellow-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Leaderboard</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Clear Leaderboard Button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={clearLeaderboard}
            className="px-4 py-2 rounded-lg bg-red-100 text-red-700 font-semibold hover:bg-red-200 transition-colors text-sm"
          >
            Clear Leaderboard
          </button>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-6">
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
        <div className="flex justify-center gap-4 mb-4">
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

        <div className="space-y-3 overflow-y-auto max-h-96">
          {sortedPlayers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Trophy className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No scores yet!</p>
              <p className="text-sm">Be the first to play and set a record.</p>
            </div>
          ) : (
            sortedPlayers.map((player, index) => (
              <div
                key={`${player.name}-${player.timestamp}`}
                className={`flex items-center gap-4 p-4 rounded-xl border-2 ${getRankColor(index)} transition-all duration-200`}
              >
                <div className="flex-shrink-0">
                  {getRankIcon(index)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 truncate">{player.name}</p>
                  <p className="text-sm text-gray-500 capitalize">
                    {player.mode} mode
                    {player.category ? ` | ${player.category}` : ''}
                    {player.difficulty ? ` | ${player.difficulty}` : ''}
                    {player.speed ? ` | ${player.speed}` : ''}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-gray-800">{player.score.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(player.timestamp).toLocaleDateString()}
                  </p>
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