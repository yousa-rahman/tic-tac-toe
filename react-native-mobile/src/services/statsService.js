import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://localhost:3001/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token expiration
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      AsyncStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

export const statsService = {
  // Get user's statistics
  async getUserStats() {
    const response = await apiClient.get('/stats/my-stats');
    return response.data;
  },

  // Get user's recent games
  async getRecentGames(limit = 10) {
    const response = await apiClient.get(`/stats/recent-games?limit=${limit}`);
    return response.data;
  },

  // Get global leaderboard
  async getLeaderboard(limit = 10) {
    const response = await apiClient.get(`/stats/leaderboard?limit=${limit}`);
    return response.data;
  },

  // Get detailed statistics
  async getDetailedStats() {
    const response = await apiClient.get('/stats/detailed-stats');
    return response.data;
  },

  // Helper function to format win percentage
  formatWinPercentage(percentage) {
    return `${percentage.toFixed(1)}%`;
  },

  // Helper function to get game result text
  getGameResultText(result) {
    switch (result) {
      case 'win':
        return 'Won';
      case 'loss':
        return 'Lost';
      case 'draw':
        return 'Draw';
      default:
        return 'Unknown';
    }
  },

  // Helper function to get game result color
  getGameResultColor(result) {
    switch (result) {
      case 'win':
        return '#28a745';
      case 'loss':
        return '#dc3545';
      case 'draw':
        return '#ffc107';
      default:
        return '#6c757d';
    }
  },

  // Helper function to format date
  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  },
}; 