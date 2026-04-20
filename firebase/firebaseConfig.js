import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { initializeFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAcqOcf2T7j6WyY8iYlpM1lHp7X8o-sy4E",
  authDomain: "to-do-list-4240c.firebaseapp.com",
  projectId: "to-do-list-4240c",
  storageBucket: "to-do-list-4240c.firebasestorage.app",
  messagingSenderId: "180232823299",
  appId: "1:180232823299:web:82edaec43e55df022a6436",
  measurementId: "G-RYBCRK9YME",
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});

export { auth, db };
