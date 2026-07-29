// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

// Configuración
const firebaseConfig = {
  apiKey: "AIzaSyCcuy8Wtbhn72dU6ayYqfcYN8bbRSeauSw",
  authDomain: "hydronexis-ch.firebaseapp.com",
  projectId: "hydronexis-ch",
  storageBucket: "hydronexis-ch.firebasestorage.app",
  messagingSenderId: "666732053585",
  appId: "1:666732053585:web:d736f714c9bfaaa8a5e470",
  measurementId: "G-QMH74LWN26"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Authentication
const auth = getAuth(app);

// Firestore
const db = getFirestore(app);

console.log("Firebase conectado");

// Exportar
export { app, auth, db };