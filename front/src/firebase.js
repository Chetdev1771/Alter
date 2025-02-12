import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyD_aOGeNArk7E7_SRlLXkl6CnR80k2qSxs",
    authDomain: "alter-21e5a.firebaseapp.com",
    projectId: "alter-21e5a",
    storageBucket: "alter-21e5a.firebasestorage.app",
    messagingSenderId: "699025512589",
    appId: "1:699025512589:web:0bd484471061cc76182ac4",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider, signInWithPopup, signOut };
