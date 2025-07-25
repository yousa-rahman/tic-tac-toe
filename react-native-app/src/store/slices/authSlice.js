import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiService from '../../services/api';

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  token: null,
};

// Async thunks for API calls
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      console.log('🔐 Attempting login for:', email);
      const response = await apiService.login(email, password);
      
      // Store token in API service for future requests
      apiService.setToken(response.token);
      
      // Store token in localStorage for persistence
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('token', response.token);
      }
      
      console.log('✅ Login successful:', response.user);
      return response;
    } catch (error) {
      console.error('❌ Login failed:', error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      console.log('📝 Attempting registration for:', email);
      const response = await apiService.register(name, email, password);
      
      // Store token in API service for future requests
      apiService.setToken(response.token);
      
      // Store token in localStorage for persistence
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('token', response.token);
      }
      
      console.log('✅ Registration successful:', response.user);
      return response;
    } catch (error) {
      console.error('❌ Registration failed:', error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const verifyToken = createAsyncThunk(
  'auth/verifyToken',
  async (_, { rejectWithValue }) => {
    try {
      // Get token from localStorage
      const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
      
      if (!token) {
        throw new Error('No token found');
      }
      
      // Set token in API service
      apiService.setToken(token);
      
      // Verify token by making a request to get user stats
      await apiService.getStats();
      
      // If we get here, token is valid
      return { token };
    } catch (error) {
      console.error('❌ Token verification failed:', error.message);
      // Clear invalid token
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('token');
      }
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      state.token = null;
      
      // Clear token from API service
      apiService.setToken(null);
      
      // Clear token from localStorage
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('token');
      }
      
      console.log('🚪 User logged out');
    },
    clearError: (state) => {
      state.error = null;
    },
    initializeAuth: (state) => {
      // Try to restore auth state from localStorage
      if (typeof localStorage !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
          state.token = token;
          apiService.setToken(token);
          console.log('🔄 Restored token from localStorage');
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Verify Token
      .addCase(verifyToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyToken.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(verifyToken.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.token = null;
        state.error = action.payload;
      });
  },
});

export const { logout, clearError, initializeAuth } = authSlice.actions;
export default authSlice.reducer; 