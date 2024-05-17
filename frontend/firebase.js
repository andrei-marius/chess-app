import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyBsVakZ09gvMzKnZ5_sgWuIjtgaOSPUn_g",
  authDomain: "chess-game-c2020.firebaseapp.com",
  projectId: "chess-game-c2020",
  storageBucket: "chess-game-c2020.appspot.com",
  messagingSenderId: "761637882672",
  appId: "1:761637882672:web:a1e62512864389e1a216f5",
  measurementId: "G-RP3H5B7MV0"
};

const app = initializeApp(firebaseConfig);

export const firestore = getFirestore(app);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});
