import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import QuizPage from './pages/QuizPage';
import LeaderboardPage from './pages/LeaderboardPage';
import { GameProvider } from './context/GameContext';
import AnimalGallery from './components/AnimalGallery';

function App() {
  return (
    <GameProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
          <Routes>
            <Route path="/" element={<><HomePage /><AnimalGallery /></>} />
            <Route path="/categories" element={<CategoryPage />} />
            <Route path="/quiz/:category" element={<QuizPage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
          </Routes>
        </div>
      </Router>
    </GameProvider>
  );
}

export default App;