// @/lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBFyfX9YSza4K4aSIhwofyOC3CQz6n9cRM",
  authDomain: "dbexpensetrack.firebaseapp.com",  
  projectId: "dbexpensetrack",
  storageBucket: "dbexpensetrack.firebasestorage.app",
  messagingSenderId: "1062515498078",
  appId: "1:1062515498078:web:4792096c2b2d6636dce8cf",
  measurementId: "G-V06DL9CC2X"
};



// Initialiser Firebase
const app = initializeApp(firebaseConfig);

// Initialiser Firebase Auth
export const auth = getAuth(app);

// Initialiser Firestore
export const db = getFirestore(app);

export default app;