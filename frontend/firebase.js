import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

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
const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);

export const auth = getAuth(app);
