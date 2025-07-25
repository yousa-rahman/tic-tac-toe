import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { statsService } from '../../services/statsService';

// Async thunks
export const fetchUserStats = createAsyncThunk(
  'stats/fetchUserStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await statsService.getUserStats();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch user stats' });
    }
  }
);

export const fetchRecentGames = createAsyncThunk(
  'stats/fetchRecentGames',
  async (limit = 10, { rejectWithValue }) => {
    try {
      const response = await statsService.getRecentGames(limit);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch recent games' });
    }
  }
);

export const fetchLeaderboard = createAsyncThunk(
  'stats/fetchLeaderboard',
  async (limit = 10, { rejectWithValue }) => {
    try {
      const response = await statsService.getLeaderboard(limit);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch leaderboard' });
    }
  }
);

const initialState = {
  userStats: {
    wins: 0,
    losses: 0,
    draws: 0,
    totalGames: 0,
    winPercentage: 0,
  },
  recentGames: [],
  leaderboard: [],
  loading: false,
  error: null,
};

const statsSlice = createSlice({
  name: 'stats',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateUserStats: (state, action) => {
      state.userStats = { ...state.userStats, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch User Stats
      .addCase(fetchUserStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserStats.fulfilled, (state, action) => {
        state.loading = false;
        state.userStats = action.payload;
      })
      .addCase(fetchUserStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch user stats';
      })
      // Fetch Recent Games
      .addCase(fetchRecentGames.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecentGames.fulfilled, (state, action) => {
        state.loading = false;
        state.recentGames = action.payload.games;
      })
      .addCase(fetchRecentGames.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch recent games';
      })
      // Fetch Leaderboard
      .addCase(fetchLeaderboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeaderboard.fulfilled, (state, action) => {
        state.loading = false;
        state.leaderboard = action.payload.leaderboard;
      })
      .addCase(fetchLeaderboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch leaderboard';
      });
  },
});

export const { clearError, updateUserStats } = statsSlice.actions;
export default statsSlice.reducer; 