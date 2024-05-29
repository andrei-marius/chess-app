import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import LeaderboardScreen from './screens/LeaderboardScreen';
import Queue from './screens/Queue';
import Account from './screens/Account';
import MainMenu from './screens/MainMenu';
import Instructions from './screens/Instructions';
import GameOver from './screens/GameOver';
import Win from './screens/Win';
import Draw from './screens/Draw';
import ContextProvider, { useCustomContext } from './contexts/globalContext';
import useFetch from './hooks/useFetch';
import { SimpleLineIcons, MaterialCommunityIcons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { NativeBaseProvider} from "native-base";

const Tab = createBottomTabNavigator();

export default function App() {
  // const { data, fetchData, error } = useFetch();
  // const { setUser, user } = useCustomContext();

  // useEffect(() => {
  //   const checkUserLoggedIn = async () => {
  //     const token = await AsyncStorage.getItem('token');
  //     if (token) {
  //       await fetchData('verifyToken', {
  //          method: 'POST',
  //       }, token);        
  //     }
  //   };

  //   checkUserLoggedIn();
  // }, []);

  // useEffect(() => {
  //   (async () => {
  //     if (data) {
  //       setUser(data);
  //     } 

  //     if (error) {
  //       await AsyncStorage.removeItem('token');
  //       setUser(null);
  //     }
  //   })()
  // }, [data, error])

  return (
  <NativeBaseProvider>
    <NavigationContainer>
      <Tab.Navigator>
          <Tab.Screen 
            name="Login" 
            component={LoginScreen} 
            options={{ 
              tabBarIcon: ({ color, size }) => (
                <SimpleLineIcons name="login" color={color} size={size} />
              ) 
            }} 
          />
          <Tab.Screen 
            name="Signup" 
            component={SignupScreen} 
            options={{ 
              tabBarIcon: ({ color, size }) => (
                <SimpleLineIcons name="user-follow" color={color} size={size} />
              ) 
            }} 
          />
        <Tab.Screen name="MainMenu" component={MainMenu} />
        <Tab.Screen name="Instructions" component={Instructions} />
          <Tab.Screen 
            name="Leaderboard" 
            component={LeaderboardScreen} 
            options={{ 
              tabBarIcon: ({ color, size }) => (
                <MaterialIcons name="leaderboard" color={color} size={size} />
                ) 
              }} 
          />
          <Tab.Screen 
            name="Queue" 
            component={Queue} 
            options={{ 
              tabBarLabel: 'Play Chess', 
              tabBarIcon: ({ color, size }) => (
                <FontAwesome5 name="chess" color={color} size={size} />
              ) 
            }} 
          />
          <Tab.Screen 
            name="Account" 
            component={Account} 
            options={{ 
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="account" color={color} size={size} />
              ) 
            }} 
          />
          <Tab.Screen name="GameOver" component={GameOver} />
          <Tab.Screen name="Win" component={Win} />
          <Tab.Screen name="Draw" component={Draw} />
      </Tab.Navigator>
    </NavigationContainer>
    </NativeBaseProvider>
  );
}
