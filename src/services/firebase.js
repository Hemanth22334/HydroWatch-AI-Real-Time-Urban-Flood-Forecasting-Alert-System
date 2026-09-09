import { initializeApp, getApps } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

// Environment configuration for Firebase
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyDemoKeyForLocalTestingModeOnly12345",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "studyforge-app.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "studyforge-app",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "studyforge-app.appspot.com",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "1234567890",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:1234567890:web:abcdef123456",
};

// Check if Firebase is properly configured with a real API key
export const isFirebaseConfigured = Boolean(
  process.env.REACT_APP_FIREBASE_API_KEY && 
  process.env.REACT_APP_FIREBASE_API_KEY !== "AIzaSyDemoKeyForLocalTestingModeOnly12345"
);

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
