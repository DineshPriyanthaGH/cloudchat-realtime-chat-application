// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAYgZbJ7O4Iz3Uj68BXxR2QadiPJW3YBpg",
  authDomain: "cloudchat-real-time-chatapp.firebaseapp.com",
  databaseURL: "https://cloudchat-real-time-chatapp-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "cloudchat-real-time-chatapp",
  storageBucket: "cloudchat-real-time-chatapp.firebasestorage.app",
  messagingSenderId: "655455333637",
  appId: "1:655455333637:web:10727fffc4d50cb339db6c",
  measurementId: "G-8G3095H7QZ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, googleProvider, db, storage };