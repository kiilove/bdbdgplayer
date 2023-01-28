// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "bdbdg-player.firebaseapp.com",
  projectId: "bdbdg-player",
  storageBucket: "bdbdg-player.appspot.com",
  messagingSenderId: "334496296449",
  appId: process.env.FIREBASE_APP_ID,
  measurementId: "G-YFBSQ3PBEX",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
