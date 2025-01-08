import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Import Firebase Storage

// Firebase config object from Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyCjqZeTYZdymes_nChNipb5sIpiQjOi7xM",
  authDomain: "ceomeet-87b0e.firebaseapp.com",
  projectId: "ceomeet-87b0e",
  storageBucket: "ceomeet-87b0e.firebasestorage.app",
  messagingSenderId: "1023421291004",
  appId: "1:1023421291004:web:c3d6d98fbbd63a5809fa79",
  measurementId: "G-GX8H0N8TRX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);  // Initialize Firebase Storage

export { app, auth, db, storage };  // Export the storage service
