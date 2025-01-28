// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "task-management-42b85.firebaseapp.com",
  projectId: "task-management-42b85",
  storageBucket: "task-management-42b85.firebasestorage.app",
  messagingSenderId: "932572301217",
  appId: "1:932572301217:web:a8455bb47dbaf09a462de0",
  measurementId: "G-HNK14K8364"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { app, auth };