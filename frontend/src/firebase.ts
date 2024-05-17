// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: process.env.VITE_FB_KEY,
    authDomain: process.env.VITE_FB_DOMAIN,
    projectId: process.env.VITE_FB_PJID,
    storageBucket: process.env.VITE_FB_BUCKET,
    messagingSenderId: process.env.VITE_FB_SENDER_ID,
    appId: process.env.VITE_FB_APPID
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);