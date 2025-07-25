import { configureStore } from '@reduxjs/toolkit';
import gameReducer from './slices/gameSlice';
import authReducer from './slices/authSlice';
import statsReducer from './slices/statsSlice';

export const store = configureStore({
  reducer: {
    game: gameReducer,
    auth: authReducer,
    stats: statsReducer,
  },
}); 