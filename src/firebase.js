// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBMkAU_4hs9aOnRu-aHcCPQQ-mDkACpXts",
  authDomain: "body-36982.firebaseapp.com",
  projectId: "body-36982",
  storageBucket: "body-36982.appspot.com",
  messagingSenderId: "297237107965",
  appId: "1:297237107965:web:cfa3d5d0f8882d0abb5a94",
  measurementId: "G-DF39XRHWMK",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
