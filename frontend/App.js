import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import LeaderboardScreen from './screens/LeaderboardScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Queue from "./screens/Queue";
import Chess from "./screens/Chess";
import ContextProvider from "./contexts/globalContext";

const AuthStack = createStackNavigator();
const AppStack = createStackNavigator();

const AuthStackScreen = () => (
  <AuthStack.Navigator>
    <AuthStack.Screen name="Login" component={LoginScreen} />
    <AuthStack.Screen name="Signup" component={SignupScreen} />
  </AuthStack.Navigator>
);

const AppStackScreen = () => (
  <AppStack.Navigator>
    <AppStack.Screen name="Queue" component={Queue} />
    <AppStack.Screen name="Chess" component={Chess} />
    <AppStack.Screen name="Leaderboard" component={LeaderboardScreen} />
  </AppStack.Navigator>
);

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUserLoggedIn = async () => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const response = await fetch('http://192.168.0.19:3000/verifyToken', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          await AsyncStorage.removeItem('token');
        }
      }
    };

    checkUserLoggedIn();
  }, []);

  return (
    <ContextProvider>
      <NavigationContainer>
        {user ? <AppStackScreen /> : <AuthStackScreen />}
      </NavigationContainer>
    </ContextProvider>
  );
}
