// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCHPyBCRrDLXbl_S77b3rLmAXOllguUbhk",
    authDomain: "ctrl-t.firebaseapp.com",
    projectId: "ctrl-t",
    storageBucket: "ctrl-t.firebasestorage.app",
    messagingSenderId: "725430144635",
    appId: "1:725430144635:web:02cb2a6326af0c42f39cde"
};
const app = initializeApp(firebaseConfig);
// Initialize Firebase
export const auth = getAuth(app);
export default app;