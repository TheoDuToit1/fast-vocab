import React, { useState, useEffect, useRef } from 'react';
import { Trophy, Medal, Award, X, Sparkles } from 'lucide-react';
import { Player } from '../../types/game';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  players: Player[];
  clearLeaderboard: () => void;
}

// Emoji for each category
const categoryEmojis: Record<string, string> = {
  animals: '🐻',
  colors: '🎨',
  alphabet: '🔤',
  numbers: '🔢',
};

// Fun confetti SVG (simple, lightweight)
const Confetti = () => (
  <svg width="60" height="30" viewBox="0 0 60 30" fill="none" className="absolute -top-6 left-1/2 -translate-x-1/2 animate-confetti z-10">
    <circle cx="10" cy="10" r="2" fill="#fbbf24"/>
    <circle cx="20" cy="5" r="1.5" fill="#34d399"/>
    <circle cx="30" cy="12" r="2.5" fill="#6366f1"/>
    <circle cx="40" cy="7" r="2" fill="#f472b6"/>
    <circle cx="50" cy="13" r="1.5" fill="#f87171"/>
    <circle cx="15" cy="20" r="1.5" fill="#fbbf24"/>
    <circle cx="25" cy="25" r="2" fill="#34d399"/>
    <circle cx="35" cy="18" r="1.5" fill="#6366f1"/>
    <circle cx="45" cy="22" r="2" fill="#f472b6"/>
    <circle cx="55" cy="17" r="1.5" fill="#f87171"/>
  </svg>
);

const getInitials = (name: string) => {
  if (!name) return '?';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
};

const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ isOpen, onClose, players, clearLeaderboard }) => {
  if (!isOpen) return null;

  // Tab state: 'all', 'normal' (Practice), or 'timed' (Challenge)
  const [tab, setTab] = useState<'all' | 'normal' | 'timed'>('all');
  const [category, setCategory] = useState('all');
  const [difficulty, setDifficulty] = useState('all');
  const [speed, setSpeed] = useState('all');

  // For sticky filter bar
  const filterBarRef = useRef<HTMLDivElement>(null);

  // Get unique categories, difficulties, and speeds from players
  const categories = Array.from(new Set(players.map(p => p.category).filter(Boolean)));
  const difficulties = Array.from(new Set(players.map(p => p.difficulty).filter(Boolean)));
  const speeds = Array.from(new Set(players.map(p => p.speed).filter(Boolean)));

  // Filter players by selected mode, category, difficulty, and speed
  const filteredPlayers = players.filter(p =>
    (tab === 'all' || p.mode === tab) &&
    (category === 'all' || !p.category || p.category === category) &&
    (difficulty === 'all' || !p.difficulty || p.difficulty === difficulty) &&
    (speed === 'all' || !p.speed || p.speed === speed)
  );
  const sortedPlayers = [...filteredPlayers].sort((a, b) => b.score - a.score);

  // Fixed lists for all possible categories and difficulties
  const allCategories = [
    { value: 'animals', label: 'Animals' },
    { value: 'colors', label: 'Colors' },
    { value: 'alphabet', label: 'Alphabet' },
    { value: 'numbers', label: 'Numbers' },
  ];
  const allDifficulties = [
    { value: 'starter', label: 'Starter' },
    { value: 'mover', label: 'Mover' },
    { value: 'flyer', label: 'Flyer' },
  ];

  // Highlight the most recent player (top of the list)
  const highlightName = sortedPlayers[0]?.name;
  const highlightTimestamp = sortedPlayers[0]?.timestamp;

  // Animate modal pop-in
  useEffect(() => {
    if (!isOpen) return;
    const modal = document.getElementById('leaderboard-modal');
    if (modal) {
      modal.classList.remove('animate-pop');
      void modal.offsetWidth; // trigger reflow
      modal.classList.add('animate-pop');
    }
  }, [isOpen]);

  // Confetti animation for top 3
  const showConfetti = (index: number) => index < 3;

  // Rank icons and colors
  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <span title="1st Place"><Trophy className="w-7 h-7 text-yellow-400 animate-bounce" /></span>;
      case 1:
        return <span title="2nd Place"><Medal className="w-7 h-7 text-gray-400 animate-pulse" /></span>;
      case 2:
        return <span title="3rd Place"><Award className="w-7 h-7 text-orange-400 animate-pulse" /></span>;
      default:
        return <span className="w-7 h-7 flex items-center justify-center text-gray-400 font-bold">{index + 1}</span>;
    }
  };
  const getRankColor = (index: number) => {
    switch (index) {
      case 0:
        return 'bg-yellow-100 border-yellow-300 shadow-lg';
      case 1:
        return 'bg-gray-100 border-gray-300 shadow-md';
      case 2:
        return 'bg-orange-100 border-orange-300 shadow-md';
      default:
        return 'bg-white border-gray-100';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Blurred, darkened background */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div
        id="leaderboard-modal"
        className="relative bg-white rounded-3xl p-8 shadow-2xl max-w-md w-full mx-4 max-h-[85vh] overflow-hidden animate-pop"
        style={{ animationDuration: '350ms' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center shadow">
              <Trophy className="w-7 h-7 text-yellow-500" />
            </div>
            <h2 className="text-2xl font-extrabold text-gray-800 tracking-tight">Leaderboard</h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors shadow"
            title="Close"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Clear Leaderboard Button */}
        <div className="flex justify-end mb-2">
          <button
            onClick={clearLeaderboard}
            className="px-4 py-2 rounded-lg bg-red-100 text-red-700 font-semibold hover:bg-red-200 transition-colors text-xs shadow"
            title="Clear all scores"
          >
            Clear Leaderboard
          </button>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-2 mb-4">
          <button
            className={`px-4 py-2 rounded-full font-semibold transition-colors text-sm shadow-sm ${tab === 'all' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            onClick={() => setTab('all')}
            title="Show all modes"
          >
            All Modes
          </button>
          <button
            className={`px-4 py-2 rounded-full font-semibold transition-colors text-sm shadow-sm ${tab === 'normal' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-blue-100'}`}
            onClick={() => setTab('normal')}
            title="Practice Mode only"
          >
            Practice Mode
          </button>
          <button
            className={`px-4 py-2 rounded-full font-semibold transition-colors text-sm shadow-sm ${tab === 'timed' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-orange-100'}`}
            onClick={() => setTab('timed')}
            title="Challenge Mode only"
          >
            Challenge Mode
          </button>
        </div>

        {/* Filters - sticky */}
        <div ref={filterBarRef} className="flex justify-center gap-2 mb-3 sticky top-0 z-10 bg-white/90 py-2 rounded-xl shadow-sm">
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="px-3 py-2 rounded-full border border-gray-200 bg-gray-50 text-gray-700 focus:outline-none text-xs shadow-sm"
            title="Filter by category"
          >
            <option value="all">All Categories</option>
            {allCategories.map(cat => (
              <option key={cat.value} value={cat.value}>{categoryEmojis[cat.value] || ''} {cat.label}</option>
            ))}
          </select>
          <select
            value={difficulty}
            onChange={e => setDifficulty(e.target.value)}
            className="px-3 py-2 rounded-full border border-gray-200 bg-gray-50 text-gray-700 focus:outline-none text-xs shadow-sm"
            title="Filter by difficulty"
          >
            <option value="all">All Difficulties</option>
            {allDifficulties.map(diff => (
              <option key={diff.value} value={diff.value}>{diff.label}</option>
            ))}
          </select>
          <select
            value={speed}
            onChange={e => setSpeed(e.target.value)}
            className="px-3 py-2 rounded-full border border-gray-200 bg-gray-50 text-gray-700 focus:outline-none text-xs shadow-sm"
            title="Filter by speed"
          >
            <option value="all">All Speeds</option>
            {speeds.map(s => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
        </div>

        {/* Player List */}
        <div className="space-y-3 overflow-y-auto max-h-96 pb-2 relative">
          {sortedPlayers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Trophy className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No scores yet!</p>
              <p className="text-sm">Be the first to play and set a record.</p>
            </div>
          ) : (
            sortedPlayers.map((player, index) => {
              const isTop3 = index < 3;
              const isCurrent = player.name === highlightName && player.timestamp === highlightTimestamp;
              return (
                <div
                  key={`${player.name}-${player.timestamp}`}
                  className={`flex items-center gap-4 p-4 rounded-2xl border-2 ${getRankColor(index)} transition-all duration-200 relative ${isCurrent ? 'ring-4 ring-blue-300' : ''}`}
                  style={{ minHeight: 72 }}
                >
                  {/* Confetti for top 3 */}
                  {isTop3 && <Confetti />}
                  {/* Rank icon */}
                  <div className="flex-shrink-0 relative z-10">
                    {getRankIcon(index)}
                  </div>
                  {/* Avatar/Initials */}
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-lg shadow ${isTop3 ? 'bg-gradient-to-br from-pink-200 via-yellow-100 to-blue-200' : 'bg-gray-100'} text-gray-700 border-2 border-white -ml-2`} title={player.name}>
                    {getInitials(player.name)}
                  </div>
                  {/* Player info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 truncate flex items-center gap-1">
                      {player.name}
                      {player.category && (
                        <span className="ml-1 text-lg" title={player.category}>
                          {categoryEmojis[player.category] || ''}
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-gray-500 capitalize flex flex-wrap gap-1">
                      <span title="Game Mode">{player.mode} mode</span>
                      {player.category ? <span title="Category">| {player.category}</span> : ''}
                      {player.difficulty ? <span title="Difficulty">| {player.difficulty}</span> : ''}
                      {player.speed ? <span title="Speed">| {player.speed}</span> : ''}
                    </p>
                  </div>
                  {/* Score and date */}
                  <div className="text-right min-w-[70px]">
                    <p className="font-extrabold text-xl text-gray-800">{player.score.toLocaleString()}</p>
                    <p className="text-[10px] text-gray-400">
                      {new Date(player.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                  {/* Sparkles for top 3 */}
                  {isTop3 && <Sparkles className="absolute right-2 top-2 text-yellow-400 animate-spin-slow opacity-60" title="Top 3!" />}
                </div>
              );
            })
          )}
        </div>
      </div>
      {/* Animations */}
      <style>{`
        @keyframes pop {
          0% { transform: scale(0.7) translateY(40px); opacity: 0; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        .animate-pop { animation: pop 0.35s cubic-bezier(.22,1,.36,1) both; }
        @keyframes confetti {
          0% { opacity: 0; transform: translateY(-10px) scale(0.8); }
          50% { opacity: 1; transform: translateY(0) scale(1.1); }
          100% { opacity: 0; transform: translateY(10px) scale(0.8); }
        }
        .animate-confetti { animation: confetti 1.2s ease-in-out infinite; }
        .animate-spin-slow { animation: spin 2.5s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default LeaderboardModal;