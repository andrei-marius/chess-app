import React from "react";
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Queue from "./screens/Queue";
import Chess from "./screens/Chess";
import MainMenu from "./screens/MainMenu";
import ContextProvider from "./contexts/globalContext";

const Stack = createNativeStackNavigator();

const App = () => {
    return (
      <ContextProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="MainMenu" component={MainMenu}/>
            <Stack.Screen name="Queue" component={Queue} />
            <Stack.Screen name="Chess" component={Chess} />
          </Stack.Navigator>
        </NavigationContainer>
      </ContextProvider>
    );
}

export default App;