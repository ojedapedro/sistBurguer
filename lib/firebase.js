import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyADN6Aqz3f7vKcAIT-QzddX929Lo4GYAAk",
  authDomain: "sistburguer.firebaseapp.com",
  projectId: "sistburguer",
  storageBucket: "sistburguer.firebasestorage.app",
  messagingSenderId: "978242560633",
  appId: "1:978242560633:web:51440978b38c90fcf82aa8",
  measurementId: "G-BHYY65ZXRR"
};

// Evitar inicializar múltiples apps en hot-reload de Next.js
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { db, firebaseConfig };

