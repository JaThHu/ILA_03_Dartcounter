import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Deine Konfigurationsdaten aus der Firebase-Konsole
const firebaseConfig = {
  apiKey: "AIzaSyBxrf7_2Sgeqhr5m87jDbVbBo97WmhmmWE",
  authDomain: "frickdartv2.firebaseapp.com",
  projectId: "frickdartv2",
  storageBucket: "frickdartv2.firebasestorage.app",
  messagingSenderId: "244016300225",
  appId: "1:244016300225:web:4415309ab00dee5f5f1440",
};

// Firebase initialisieren
const app = initializeApp(firebaseConfig);

// Dienste exportieren, die du verwenden möchtest
export const db = getFirestore(app);
export const auth = getAuth(app);
