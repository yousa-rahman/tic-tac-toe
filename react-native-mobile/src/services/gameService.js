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

export const gameService = {
  // Start a new game
  async startGame(startedBy) {
    const response = await apiClient.post('/game/start', { startedBy });
    return response.data;
  },

  // Make a move
  async makeMove(moveData) {
    const response = await apiClient.post('/game/move', moveData);
    return response.data;
  },

  // Get current game state
  async getGameState(gameId) {
    const response = await apiClient.get(`/game/state/${gameId}`);
    return response.data;
  },

  // Helper function to check if a move is valid
  isValidMove(board, row, col) {
    return board[row][col] === 0;
  },

  // Helper function to check if game is over
  checkGameOver(board) {
    // Check rows
    for (let i = 0; i < 3; i++) {
      if (board[i][0] !== 0 && 
          board[i][0] === board[i][1] && 
          board[i][1] === board[i][2]) {
        return { gameOver: true, winner: board[i][0] };
      }
    }

    // Check columns
    for (let j = 0; j < 3; j++) {
      if (board[0][j] !== 0 && 
          board[0][j] === board[1][j] && 
          board[1][j] === board[2][j]) {
        return { gameOver: true, winner: board[0][j] };
      }
    }

    // Check diagonals
    if (board[0][0] !== 0 && 
        board[0][0] === board[1][1] && 
        board[1][1] === board[2][2]) {
      return { gameOver: true, winner: board[0][0] };
    }

    if (board[0][2] !== 0 && 
        board[0][2] === board[1][1] && 
        board[1][1] === board[2][0]) {
      return { gameOver: true, winner: board[0][2] };
    }

    // Check for draw
    const isDraw = board.every(row => row.every(cell => cell !== 0));
    if (isDraw) {
      return { gameOver: true, winner: null, isDraw: true };
    }

    return { gameOver: false, winner: null };
  },

  // Helper function to get current player
  getCurrentPlayer(board) {
    const xCount = board.flat().filter(cell => cell === 1).length;
    const oCount = board.flat().filter(cell => cell === 2).length;
    return xCount === oCount ? 'X' : 'O';
  },

  // Helper function to make a move on the board
  makeMoveOnBoard(board, row, col, player) {
    const newBoard = board.map(row => [...row]);
    newBoard[row][col] = player === 'X' ? 1 : 2;
    return newBoard;
  },
}; 