import { initializeApp } from "firebase/app";

import {
  getAuth,
  GoogleAuthProvider
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBelnoZnOQd-HNnKl_RZckK485HkGr1ThI",
  authDomain: "intellimail-88e3d.firebaseapp.com",
  projectId: "intellimail-88e3d",
  storageBucket: "intellimail-88e3d.firebasestorage.app",
  messagingSenderId: "349452819841",
  appId: "1:349452819841:web:094bed1a54a27a8ccbdc80",
  measurementId: "G-HRHXFKNSLB"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const provider = new GoogleAuthProvider();