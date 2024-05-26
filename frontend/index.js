import App from './App';
import ContextProvider from './contexts/globalContext';
import registerRootComponent from 'expo/build/launch/registerRootComponent';

const Root = () => (
  <ContextProvider>
    <App />
  </ContextProvider>
);

registerRootComponent(Root);
