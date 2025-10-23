// js/firebaseConfig.js

// Import Firebase modules from CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-database.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-storage.js";

// Your Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyASPJ3k8F0hu6c5AN2TPyZhZxi6ob7uQ4Q",
  authDomain: "stagenix-bf75b.firebaseapp.com",
  projectId: "stagenix-bf75b",
  storageBucket: "stagenix-bf75b.appspot.com",
  messagingSenderId: "547369807533",
  appId: "1:547369807533:web:dd1d9d279842ec48a5e024",
  databaseURL: "https://stagenix-bf75b-default-rtdb.firebaseio.com"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Export Firebase services for use in your project
export const db = getFirestore(app);    // Firestore database
export const auth = getAuth(app);       // Authentication
export const rtdb = getDatabase(app);   // Realtime Database
export const storage = getStorage(app); // Storage for assets
