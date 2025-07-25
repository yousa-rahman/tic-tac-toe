import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiService from '../../services/api';

const initialState = {
  gamesPlayed: 0,
  gamesWon: 0,
  gamesLost: 0,
  gamesDrawn: 0,
  winRate: 0,
  loading: false,
  error: null,
  recentGames: [],
};

// Async thunks for API calls
export const fetchStats = createAsyncThunk(
  'stats/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      console.log('📊 Fetching user statistics...');
      const response = await apiService.getStats();
      
      console.log('✅ Stats fetched successfully:', response);
      return {
        gamesPlayed: response.totalGames || 0,
        gamesWon: response.wins || 0,
        gamesLost: response.losses || 0,
        gamesDrawn: response.draws || 0,
        winRate: response.winPercentage || 0,
      };
    } catch (error) {
      console.error('❌ Failed to fetch stats:', error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const fetchRecentGames = createAsyncThunk(
  'stats/fetchRecentGames',
  async (limit = 10, { rejectWithValue }) => {
    try {
      console.log('🎮 Fetching recent games...');
      const response = await apiService.getRecentGames(limit);
      
      console.log('✅ Recent games fetched successfully:', response);
      return response.games || [];
    } catch (error) {
      console.error('❌ Failed to fetch recent games:', error.message);
      return rejectWithValue(error.message);
    }
  }
);

const statsSlice = createSlice({
  name: 'stats',
  initialState,
  reducers: {
    updateStats: (state, action) => {
      const { result } = action.payload;
      state.gamesPlayed += 1;
      
      if (result === 'win') {
        state.gamesWon += 1;
      } else if (result === 'loss') {
        state.gamesLost += 1;
      } else if (result === 'draw') {
        state.gamesDrawn += 1;
      }
      
      state.winRate = state.gamesPlayed > 0 ? (state.gamesWon / state.gamesPlayed) * 100 : 0;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Stats
      .addCase(fetchStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.loading = false;
        state.gamesPlayed = action.payload.gamesPlayed;
        state.gamesWon = action.payload.gamesWon;
        state.gamesLost = action.payload.gamesLost;
        state.gamesDrawn = action.payload.gamesDrawn;
        state.winRate = action.payload.winRate;
        state.error = null;
      })
      .addCase(fetchStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Recent Games
      .addCase(fetchRecentGames.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecentGames.fulfilled, (state, action) => {
        state.loading = false;
        state.recentGames = action.payload;
        state.error = null;
      })
      .addCase(fetchRecentGames.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { updateStats, clearError } = statsSlice.actions;
export default statsSlice.reducer; 