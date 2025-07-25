import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import '@testing-library/jest-dom';
import App from './App';
import authReducer from './store/slices/authSlice';
import gameReducer from './store/slices/gameSlice';
import statsReducer from './store/slices/statsSlice';

// Mock the services
jest.mock('./services/authService', () => ({
  authService: {
    login: jest.fn(),
    register: jest.fn(),
    verifyToken: jest.fn(),
    logout: jest.fn(),
    getToken: jest.fn(),
    isAuthenticated: jest.fn(),
  },
}));

jest.mock('./services/gameService', () => ({
  gameService: {
    startGame: jest.fn(),
    makeMove: jest.fn(),
    getGameState: jest.fn(),
  },
}));

jest.mock('./services/statsService', () => ({
  statsService: {
    getUserStats: jest.fn(),
    getRecentGames: jest.fn(),
    getLeaderboard: jest.fn(),
  },
}));

// Mock react-toastify
jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
    info: jest.fn(),
  },
}));

const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      auth: authReducer,
      game: gameReducer,
      stats: statsReducer,
    },
    preloadedState: initialState,
  });
};

const renderWithProviders = (component, initialState = {}) => {
  const store = createTestStore(initialState);
  return render(
    <Provider store={store}>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </Provider>
  );
};

describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Authentication Flow', () => {
    it('should redirect to login when not authenticated', () => {
      const initialState = {
        auth: {
          isAuthenticated: false,
          loading: false,
          user: null,
          token: null,
          error: null,
        },
      };

      renderWithProviders(<App />, initialState);
      
      // Should redirect to login
      expect(window.location.pathname).toBe('/login');
    });

    it('should redirect to game when authenticated', () => {
      const initialState = {
        auth: {
          isAuthenticated: true,
          loading: false,
          user: { id: 1, name: 'Test User', email: 'test@example.com' },
          token: 'test-token',
          error: null,
        },
        game: {
          board: [[null, null, null], [null, null, null], [null, null, null]],
          currentPlayer: null,
          gameOver: false,
          winner: null,
          loading: false,
          error: null,
        },
        stats: {
          userStats: null,
          recentGames: [],
          leaderboard: [],
          loading: false,
          error: null,
        },
      };

      renderWithProviders(<App />, initialState);
      
      // Should redirect to game
      expect(window.location.pathname).toBe('/game');
    });

    it('should show loading spinner when auth is loading', () => {
      const initialState = {
        auth: {
          isAuthenticated: false,
          loading: true,
          user: null,
          token: null,
          error: null,
        },
      };

      renderWithProviders(<App />, initialState);
      
      // Should show loading spinner
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should display auth error toast', async () => {
      const { toast } = require('react-toastify');
      
      const initialState = {
        auth: {
          isAuthenticated: false,
          loading: false,
          user: null,
          token: null,
          error: 'Authentication failed',
        },
      };

      renderWithProviders(<App />, initialState);
      
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Authentication failed');
      });
    });

    it('should display game error toast', async () => {
      const { toast } = require('react-toastify');
      
      const initialState = {
        auth: {
          isAuthenticated: true,
          loading: false,
          user: { id: 1, name: 'Test User' },
          token: 'test-token',
          error: null,
        },
        game: {
          board: [[null, null, null], [null, null, null], [null, null, null]],
          currentPlayer: null,
          gameOver: false,
          winner: null,
          loading: false,
          error: 'Game error occurred',
        },
      };

      renderWithProviders(<App />, initialState);
      
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Game error occurred');
      });
    });

    it('should display stats error toast', async () => {
      const { toast } = require('react-toastify');
      
      const initialState = {
        auth: {
          isAuthenticated: true,
          loading: false,
          user: { id: 1, name: 'Test User' },
          token: 'test-token',
          error: null,
        },
        stats: {
          userStats: null,
          recentGames: [],
          leaderboard: [],
          loading: false,
          error: 'Stats error occurred',
        },
      };

      renderWithProviders(<App />, initialState);
      
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Stats error occurred');
      });
    });
  });

  describe('Navigation', () => {
    it('should render navbar when authenticated', () => {
      const initialState = {
        auth: {
          isAuthenticated: true,
          loading: false,
          user: { id: 1, name: 'Test User', email: 'test@example.com' },
          token: 'test-token',
          error: null,
        },
        game: {
          board: [[null, null, null], [null, null, null], [null, null, null]],
          currentPlayer: null,
          gameOver: false,
          winner: null,
          loading: false,
          error: null,
        },
        stats: {
          userStats: null,
          recentGames: [],
          leaderboard: [],
          loading: false,
          error: null,
        },
      };

      renderWithProviders(<App />, initialState);
      
      // Should show navbar with user info
      expect(screen.getByText('Test User')).toBeInTheDocument();
    });

    it('should not render navbar when not authenticated', () => {
      const initialState = {
        auth: {
          isAuthenticated: false,
          loading: false,
          user: null,
          token: null,
          error: null,
        },
      };

      renderWithProviders(<App />, initialState);
      
      // Should not show navbar
      expect(screen.queryByText('Test User')).not.toBeInTheDocument();
    });
  });

  describe('Route Protection', () => {
    it('should protect game route when not authenticated', () => {
      const initialState = {
        auth: {
          isAuthenticated: false,
          loading: false,
          user: null,
          token: null,
          error: null,
        },
      };

      // Navigate to game route
      window.history.pushState({}, '', '/game');
      
      renderWithProviders(<App />, initialState);
      
      // Should redirect to login
      expect(window.location.pathname).toBe('/login');
    });

    it('should protect statistics route when not authenticated', () => {
      const initialState = {
        auth: {
          isAuthenticated: false,
          loading: false,
          user: null,
          token: null,
          error: null,
        },
      };

      // Navigate to statistics route
      window.history.pushState({}, '', '/statistics');
      
      renderWithProviders(<App />, initialState);
      
      // Should redirect to login
      expect(window.location.pathname).toBe('/login');
    });

    it('should allow access to game route when authenticated', () => {
      const initialState = {
        auth: {
          isAuthenticated: true,
          loading: false,
          user: { id: 1, name: 'Test User' },
          token: 'test-token',
          error: null,
        },
        game: {
          board: [[null, null, null], [null, null, null], [null, null, null]],
          currentPlayer: null,
          gameOver: false,
          winner: null,
          loading: false,
          error: null,
        },
        stats: {
          userStats: null,
          recentGames: [],
          leaderboard: [],
          loading: false,
          error: null,
        },
      };

      // Navigate to game route
      window.history.pushState({}, '', '/game');
      
      renderWithProviders(<App />, initialState);
      
      // Should stay on game route
      expect(window.location.pathname).toBe('/game');
    });
  });

  describe('Default Routes', () => {
    it('should redirect root to login when not authenticated', () => {
      const initialState = {
        auth: {
          isAuthenticated: false,
          loading: false,
          user: null,
          token: null,
          error: null,
        },
      };

      // Navigate to root
      window.history.pushState({}, '', '/');
      
      renderWithProviders(<App />, initialState);
      
      // Should redirect to login
      expect(window.location.pathname).toBe('/login');
    });

    it('should redirect root to game when authenticated', () => {
      const initialState = {
        auth: {
          isAuthenticated: true,
          loading: false,
          user: { id: 1, name: 'Test User' },
          token: 'test-token',
          error: null,
        },
        game: {
          board: [[null, null, null], [null, null, null], [null, null, null]],
          currentPlayer: null,
          gameOver: false,
          winner: null,
          loading: false,
          error: null,
        },
        stats: {
          userStats: null,
          recentGames: [],
          leaderboard: [],
          loading: false,
          error: null,
        },
      };

      // Navigate to root
      window.history.pushState({}, '', '/');
      
      renderWithProviders(<App />, initialState);
      
      // Should redirect to game
      expect(window.location.pathname).toBe('/game');
    });

    it('should redirect unknown routes to root', () => {
      const initialState = {
        auth: {
          isAuthenticated: false,
          loading: false,
          user: null,
          token: null,
          error: null,
        },
      };

      // Navigate to unknown route
      window.history.pushState({}, '', '/unknown-route');
      
      renderWithProviders(<App />, initialState);
      
      // Should redirect to root (which then redirects to login)
      expect(window.location.pathname).toBe('/login');
    });
  });
}); 