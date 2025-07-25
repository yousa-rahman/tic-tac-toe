import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiService from '../../services/api';

const initialState = {
  board: [
    [null, null, null],
    [null, null, null],
    [null, null, null]
  ],
  currentPlayer: 'X',
  gameOver: false,
  winner: null,
  firstPlayer: null,
  gameId: null,
  loading: false,
  error: null,
};

// Async thunks for API calls
export const startGameAPI = createAsyncThunk(
  'game/startGameAPI',
  async (startedBy, { rejectWithValue }) => {
    try {
      console.log('🎮 Starting new game with:', startedBy);
      const response = await apiService.startGame(startedBy);
      
      console.log('✅ Game started successfully:', response);
      return response;
    } catch (error) {
      console.error('❌ Failed to start game:', error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const makeMoveAPI = createAsyncThunk(
  'game/makeMoveAPI',
  async ({ row, col }, { rejectWithValue, getState }) => {
    try {
      const { gameId } = getState().game;
      console.log('🎯 Making move:', { row, col, gameId });
      
      const response = await apiService.makeMove(gameId, row, col);
      
      console.log('✅ Move made successfully:', response);
      return response;
    } catch (error) {
      console.error('❌ Failed to make move:', error.message);
      return rejectWithValue(error.message);
    }
  }
);

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    resetGame: (state) => {
      state.board = [
        [null, null, null],
        [null, null, null],
        [null, null, null]
      ];
      state.currentPlayer = 'X';
      state.gameOver = false;
      state.winner = null;
      state.firstPlayer = null;
      state.gameId = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Start Game
      .addCase(startGameAPI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(startGameAPI.fulfilled, (state, action) => {
        state.loading = false;
        state.board = action.payload.board;
        state.currentPlayer = action.payload.currentPlayer;
        state.gameOver = action.payload.gameOver;
        state.winner = action.payload.winner;
        state.firstPlayer = action.payload.startedBy;
        state.gameId = action.payload.gameId;
        state.error = null;
      })
      .addCase(startGameAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Make Move
      .addCase(makeMoveAPI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(makeMoveAPI.fulfilled, (state, action) => {
        state.loading = false;
        state.board = action.payload.board;
        state.currentPlayer = action.payload.currentPlayer;
        state.gameOver = action.payload.gameOver;
        state.winner = action.payload.winner;
        state.error = null;
      })
      .addCase(makeMoveAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

// Helper functions
const checkWinner = (board) => {
  // Check rows
  for (let i = 0; i < 3; i++) {
    if (board[i][0] && board[i][0] === board[i][1] && board[i][0] === board[i][2]) {
      return board[i][0];
    }
  }
  
  // Check columns
  for (let i = 0; i < 3; i++) {
    if (board[0][i] && board[0][i] === board[1][i] && board[0][i] === board[2][i]) {
      return board[0][i];
    }
  }
  
  // Check diagonals
  if (board[0][0] && board[0][0] === board[1][1] && board[0][0] === board[2][2]) {
    return board[0][0];
  }
  if (board[0][2] && board[0][2] === board[1][1] && board[0][2] === board[2][0]) {
    return board[0][2];
  }
  
  return null;
};

const isBoardFull = (board) => {
  return board.every(row => row.every(cell => cell !== null));
};

export const { resetGame, clearError } = gameSlice.actions;
export default gameSlice.reducer; 