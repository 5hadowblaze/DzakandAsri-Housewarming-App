
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// TODO: Replace with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyArbj0meNNd4nFq8rz6fguzUbIMTcTdlZI",
  authDomain: "dzakhousewarming.firebaseapp.com",
  // I've added the databaseURL below. You can verify this in your Firebase console.
  databaseURL: "https://dzakhousewarming-default-rtdb.firebaseio.com",
  projectId: "dzakhousewarming",
  // I've also corrected the storageBucket URL format.
  storageBucket: "dzakhousewarming.appspot.com",
  messagingSenderId: "206223136841",
  appId: "1:206223136841:web:e24e1434bc17dc9e194798",
  measurementId: "G-SZ51N799LS"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };
