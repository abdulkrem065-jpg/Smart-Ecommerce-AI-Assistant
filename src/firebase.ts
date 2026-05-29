import { initializeApp, getApp, getApps } from "firebase/app";
import { getDatabase } from "firebase/database";

// Configuration for Al-Dhibani store Realtime Database
const firebaseConfig = {
  apiKey: "AIzaSyDayX79CxIKjPjSxIo9FpuehUm888lK6YA",
  authDomain: "aldhibani-store.firebaseapp.com",
  databaseURL: "https://aldhibani-store-default-rtdb.firebaseio.com",
  projectId: "aldhibani-store",
  storageBucket: "aldhibani-store.firebasestorage.app",
  messagingSenderId: "560427181766",
  appId: "1:560427181766:web:ab1aee4ec9c9f8aaca99c7"
};

// Guard against double initialization
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const db = getDatabase(app);
