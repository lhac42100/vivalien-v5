import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC6PJl-fcdVdKyVbwCbRAtFDEoOxa_eV0Q",
  authDomain: "vivalien.firebaseapp.com",
  projectId: "vivalien",
  storageBucket: "vivalien.firebasestorage.app",
  messagingSenderId: "923794371436",
  appId: "1:923794371436:web:652f43739da7e61a7ff949"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
