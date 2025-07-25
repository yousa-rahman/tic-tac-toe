import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { verifyToken } from './store/slices/authSlice';
import { clearError as clearAuthError } from './store/slices/authSlice';
import { clearError as clearGameError } from './store/slices/gameSlice';
import { clearError as clearStatsError } from './store/slices/statsSlice';

import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Game from './pages/Game';
import Statistics from './pages/Statistics';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingSpinner from './components/LoadingSpinner';

import './App.css';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, loading: authLoading, error: authError } = useSelector(state => state.auth);
  const { error: gameError } = useSelector(state => state.game);
  const { error: statsError } = useSelector(state => state.stats);

  // Verify token on app load
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(verifyToken());
    }
  }, [dispatch, isAuthenticated]);

  // Handle errors with toast notifications
  useEffect(() => {
    if (authError) {
      toast.error(authError);
      dispatch(clearAuthError());
    }
    if (gameError) {
      toast.error(gameError);
      dispatch(clearGameError());
    }
    if (statsError) {
      toast.error(statsError);
      dispatch(clearStatsError());
    }
  }, [authError, gameError, statsError, dispatch]);

  if (authLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="App">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/login" element={
            isAuthenticated ? <Navigate to="/game" replace /> : <Login />
          } />
          <Route path="/register" element={
            isAuthenticated ? <Navigate to="/game" replace /> : <Register />
          } />
          <Route path="/game" element={
            <ProtectedRoute>
              <Game />
            </ProtectedRoute>
          } />
          <Route path="/statistics" element={
            <ProtectedRoute>
              <Statistics />
            </ProtectedRoute>
          } />
          <Route path="/" element={
            isAuthenticated ? <Navigate to="/game" replace /> : <Navigate to="/login" replace />
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App; 