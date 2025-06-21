import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import QuizPage from './pages/QuizPage';
import LeaderboardPage from './pages/LeaderboardPage';
import AdminPage from './pages/AdminPage';
import { GameProvider } from './context/GameContext';
import { AuthProvider } from './context/AuthContext';
import AnimalGallery from './components/AnimalGallery';

function App() {
  return (
    <AuthProvider>
      <GameProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/categories" element={<CategoryPage />} />
              <Route path="/quiz/:category" element={<QuizPage />} />
              <Route path="/study/:categoryId" element={<QuizPage />} />
              <Route path="/leaderboard" element={<LeaderboardPage />} />
              <Route path="/admin" element={<AdminPage />} />
            </Routes>
          </div>
        </Router>
      </GameProvider>
    </AuthProvider>
  );
}

export default App;