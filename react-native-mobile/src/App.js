import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { verifyToken } from './store/slices/authSlice';
import { clearError as clearAuthError } from './store/slices/authSlice';
import { clearError as clearGameError } from './store/slices/gameSlice';
import { clearError as clearStatsError } from './store/slices/statsSlice';

import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import GameScreen from './screens/GameScreen';
import StatisticsScreen from './screens/StatisticsScreen';
import LoadingScreen from './screens/LoadingScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'Game') {
          iconName = 'games';
        } else if (route.name === 'Statistics') {
          iconName = 'bar-chart';
        }

        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#667eea',
      tabBarInactiveTintColor: 'gray',
      headerShown: false,
    })}
  >
    <Tab.Screen name="Game" component={GameScreen} />
    <Tab.Screen name="Statistics" component={StatisticsScreen} />
  </Tab.Navigator>
);

const App = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, loading: authLoading, error: authError } = useSelector(state => state.auth);
  const { error: gameError } = useSelector(state => state.game);
  const { error: statsError } = useSelector(state => state.stats);

  // Verify token on app load
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(verifyToken());
    }
  }, [dispatch, isAuthenticated]);

  // Handle errors with toast notifications
  useEffect(() => {
    if (authError) {
      Toast.show({
        type: 'error',
        text1: 'Authentication Error',
        text2: authError,
      });
      dispatch(clearAuthError());
    }
    if (gameError) {
      Toast.show({
        type: 'error',
        text1: 'Game Error',
        text2: gameError,
      });
      dispatch(clearGameError());
    }
    if (statsError) {
      Toast.show({
        type: 'error',
        text1: 'Statistics Error',
        text2: statsError,
      });
      dispatch(clearStatsError());
    }
  }, [authError, gameError, statsError, dispatch]);

  if (authLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#667eea" />
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#667eea',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        {isAuthenticated ? (
          <Stack.Screen 
            name="Main" 
            component={MainTabs} 
            options={{ headerShown: false }}
          />
        ) : (
          <>
            <Stack.Screen 
              name="Login" 
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="Register" 
              component={RegisterScreen}
              options={{ title: 'Register' }}
            />
          </>
        )}
      </Stack.Navigator>
    </>
  );
};

export default App; 