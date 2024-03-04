import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCw3ilT9AjhINcbUGGzyMStS6uccZSLkTI",
  authDomain: "next-chat-app-7d85b.firebaseapp.com",
  projectId: "next-chat-app-7d85b",
  storageBucket: "next-chat-app-7d85b.appspot.com",
  messagingSenderId: "728016960645",
  appId: "1:728016960645:web:0584125f6bf137821b7dec",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage();
export const db = getFirestore(app);
