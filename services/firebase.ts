
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// TODO: Replace with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyArbj0meNNd4nFq8rz6fguzUbIMTcTdlZI",
  authDomain: "dzakhousewarming.firebaseapp.com",
  projectId: "dzakhousewarming",
  storageBucket: "dzakhousewarming.firebasestorage.app",
  messagingSenderId: "206223136841",
  appId: "1:206223136841:web:e24e1434bc17dc9e194798",
  measurementId: "G-SZ51N799LS"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };
