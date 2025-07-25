import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import Login from './Login';
import Register from './Register';
import TicTacToe from './TicTacToe';
import Statistics from './Statistics';

const Stack = createStackNavigator();

const Navigation = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {!isAuthenticated ? (
          // Auth screens
          <>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
          </>
        ) : (
          // App screens
          <>
            <Stack.Screen name="Game" component={TicTacToe} />
            <Stack.Screen name="Statistics" component={Statistics} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation; 