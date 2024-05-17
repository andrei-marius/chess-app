import { AppRegistry } from 'react-native';
import App from './App';  // Ensure the path to App is correct
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
