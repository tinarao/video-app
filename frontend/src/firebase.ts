// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FB_KEY,
    authDomain: import.meta.env.VITE_FB_DOMAIN,
    projectId: import.meta.env.VITE_FB_PJID,
    storageBucket: import.meta.env.VITE_FB_BUCKET,
    messagingSenderId: import.meta.env.VITE_FB_SENDER_ID,
    appId: import.meta.env.VITE_FB_APPID
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);