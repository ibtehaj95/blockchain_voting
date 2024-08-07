import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
import {getAuth} from "firebase/auth";

const firebaseConfig = {
  apiKey: "your-value-here",
  authDomain: "your-value-here",
  projectId: "your-value-here",
  storageBucket: "your-value-here",
  messagingSenderId: "your-value-here",
  appId: "your-value-here",
  measurementId: "your-value-here"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);