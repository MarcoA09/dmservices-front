import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAqNPgmd7U73XBHRmRrrj0u_ok1n9suTtY",
  authDomain: "pruebaseg-fbae4.firebaseapp.com",
  projectId: "pruebaseg-fbae4",
  storageBucket: "pruebaseg-fbae4.firebasestorage.app",
  messagingSenderId: "211690663535",
  appId: "1:211690663535:web:44fcb1aa0dec20cd7ba79a",
  measurementId: "G-Z5WL9RZ3FN"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app); 
const db = getFirestore(app);

export { auth, db }; 