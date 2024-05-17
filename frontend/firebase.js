import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';  // If using Realtime Database

const firebaseConfig = {
  apiKey: "AIzaSyBsVakZ09gvMzKnZ5_sgWuIjtgaOSPUn_g",
  authDomain: "chess-game-c2020.firebaseapp.com",
  projectId: "chess-game-c2020",
  storageBucket: "chess-game-c2020.appspot.com",
  messagingSenderId: "761637882672",
  appId: "1:761637882672:web:a1e62512864389e1a216f5",
  measurementId: "G-RP3H5B7MV0"
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const database = firebase.database();
