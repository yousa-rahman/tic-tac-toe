import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { gameService } from '../../services/gameService';

// Async thunks
export const startGame = createAsyncThunk(
  'game/startGame',
  async (startedBy, { rejectWithValue }) => {
    try {
      const response = await gameService.startGame(startedBy);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to start game' });
    }
  }
);

export const makeMove = createAsyncThunk(
  'game/makeMove',
  async (moveData, { rejectWithValue }) => {
    try {
      const response = await gameService.makeMove(moveData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to make move' });
    }
  }
);

export const getGameState = createAsyncThunk(
  'game/getGameState',
  async (gameId, { rejectWithValue }) => {
    try {
      const response = await gameService.getGameState(gameId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to get game state' });
    }
  }
);

const initialState = {
  board: [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
  ],
  currentPlayer: 'X',
  gameOver: false,
  winner: null,
  isDraw: false,
  gameId: null,
  startedBy: null,
  loading: false,
  error: null,
  nextMove: null,
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    resetGame: (state) => {
      state.board = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
      ];
      state.currentPlayer = 'X';
      state.gameOver = false;
      state.winner = null;
      state.isDraw = false;
      state.gameId = null;
      state.startedBy = null;
      state.error = null;
      state.nextMove = null;
    },
    setBoard: (state, action) => {
      state.board = action.payload;
    },
    setCurrentPlayer: (state, action) => {
      state.currentPlayer = action.payload;
    },
    setGameOver: (state, action) => {
      state.gameOver = action.payload;
    },
    setWinner: (state, action) => {
      state.winner = action.payload;
    },
    setIsDraw: (state, action) => {
      state.isDraw = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setNextMove: (state, action) => {
      state.nextMove = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Start Game
      .addCase(startGame.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(startGame.fulfilled, (state, action) => {
        state.loading = false;
        state.board = action.payload.board;
        state.currentPlayer = action.payload.currentPlayer;
        state.gameOver = action.payload.gameOver;
        state.winner = action.payload.winner;
        state.isDraw = action.payload.isDraw;
        state.gameId = action.payload.gameId;
        state.startedBy = action.payload.startedBy;
        state.nextMove = action.payload.nextMove;
      })
      .addCase(startGame.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to start game';
      })
      // Make Move
      .addCase(makeMove.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(makeMove.fulfilled, (state, action) => {
        state.loading = false;
        state.board = action.payload.board;
        state.currentPlayer = action.payload.currentPlayer;
        state.gameOver = action.payload.gameOver;
        state.winner = action.payload.winner;
        state.isDraw = action.payload.isDraw;
        state.nextMove = action.payload.nextMove;
      })
      .addCase(makeMove.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to make move';
      })
      // Get Game State
      .addCase(getGameState.pending, (state) => {
        state.loading = true;
      })
      .addCase(getGameState.fulfilled, (state, action) => {
        state.loading = false;
        state.board = action.payload.board;
        state.gameOver = action.payload.gameOver;
        state.winner = action.payload.winner;
        state.isDraw = action.payload.isDraw;
        state.startedBy = action.payload.startedBy;
      })
      .addCase(getGameState.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to get game state';
      });
  },
});

export const {
  resetGame,
  setBoard,
  setCurrentPlayer,
  setGameOver,
  setWinner,
  setIsDraw,
  clearError,
  setNextMove,
} = gameSlice.actions;

export default gameSlice.reducer; 