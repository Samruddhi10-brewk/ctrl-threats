// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {

  apiKey: "AIzaSyDB4Byl87cGaW0lbCWxpTkp_7iFz1teS9s",
  authDomain: "ctrl-t-c73cb.firebaseapp.com",
  projectId: "ctrl-t-c73cb",
  storageBucket: "ctrl-t-c73cb.firebasestorage.app",
  messagingSenderId: "1088084845086",
  appId: "1:1088084845086:web:a9e0f45d8960a311c3840f",
  measurementId: "G-63DB161467"
};

export const app = initializeApp(firebaseConfig);
// const app = initializeApp(firebaseConfig);
// Initialize Firebase
// export const auth = getAuth(app);
export default app;
