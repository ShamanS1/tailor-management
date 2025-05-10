// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { Auth, browserSessionPersistence, getAuth, setPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyCZ6lZoh6bCYwlnr8zBs0KVJYUxuV7NcEc",
  authDomain: "tailormanagementmain.firebaseapp.com",
  projectId: "tailormanagementmain",
  storageBucket: "tailormanagementmain.firebasestorage.app",
  messagingSenderId: "685887315511",
  appId: "1:685887315511:web:196970ac3e5e82343fa9b2",
  measurementId: "G-5TK25CPTDE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
setPersistence(auth, browserSessionPersistence)
  .then(() => {
    console.log("Session persistence set to browser session.");
  })
  .catch((error) => {
    console.error("Error setting session persistence:", error);
  });


export {auth};
