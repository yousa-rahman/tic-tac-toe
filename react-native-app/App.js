import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { StatusBar } from 'expo-status-bar';
import { store } from './src/store';
import Navigation from './src/components/Navigation';
import { initializeAuth, verifyToken } from './src/store/slices/authSlice';

export default function App() {
  console.log('🚀 APP RELOADED - REAL API CALLS ENABLED! 🚀');
  
  useEffect(() => {
    // Initialize auth state from localStorage
    store.dispatch(initializeAuth());
    
    // Verify token if it exists
    const state = store.getState();
    if (state.auth.token) {
      console.log('🔍 Verifying existing token...');
      store.dispatch(verifyToken());
    }
  }, []);

  return (
    <Provider store={store}>
      <Navigation />
      <StatusBar style="light" />
    </Provider>
  );
}
