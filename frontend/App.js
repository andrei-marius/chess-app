import React from "react";
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Queue from "./screens/Queue";
import Chess from "./screens/Chess";
import MainMenu from "./screens/MainMenu";
import ContextProvider from "./contexts/globalContext";
import Settings from "./screens/Settings";
import Instructions from "./screens/Instructions";
import Win from "./screens/Win";
import GameOver from "./screens/GameOver";
import Draw from "./screens/Draw";


const Stack = createNativeStackNavigator();

const App = () => {
    return (
      <ContextProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="MainMenu" component={MainMenu}/>
            <Stack.Screen name="Settings" component={Settings}/>
            <Stack.Screen name="Instructions" component={Instructions}/>
            <Stack.Screen name="Queue" component={Queue} />
            <Stack.Screen name="Chess" component={Chess} />
            <Stack.Screen name="GameOver" component={GameOver}/>
            <Stack.Screen name="Win" component={Win}/>
            <Stack.Screen name="Draw" component={Draw}/>
          </Stack.Navigator>
        </NavigationContainer>
      </ContextProvider>
    );
}

export default App;