// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDP81ucTYDVgMwb9JItUxSI8Siv-Y9nxc4",
  authDomain: "solriggs-eff76.firebaseapp.com",
  projectId: "solriggs-eff76",
  storageBucket: "solriggs-eff76.appspot.com",
  messagingSenderId: "111431938771",
  appId: "1:111431938771:web:fe439aef9afd40ef1f1a26"
};

// Initialize Firebase
// const app = initializeApp(firebaseConfig);

const firebaseApp = firebase.initializeApp(firebaseConfig);

export const auth = firebaseApp.auth();
export const firestore = firebaseApp.firestore();
export const storage = firebaseApp.storage();