// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  sendEmailVerification,
} from "firebase/auth";

import {
  getFirestore,
  query,
  getDocs,
  collection,
  where,
  addDoc,
} from "firebase/firestore";
import { API_BASE_URL, API_ENDPOINTS } from "../api/endpoints";
import axios from "axios";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

// users endpoint
const userURL = API_BASE_URL + API_ENDPOINTS.USERS;

const googleProvider = new GoogleAuthProvider();
const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;

    // Try to send to backend, but don't block login if it fails
    try {
      const idToken = await user.getIdToken();
      await axios.post(userURL, {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        authProvider: "google",
      }, {
        headers: {
          Authorization: `Bearer ${idToken}`
        }
      });
    } catch (backendErr) {
      // Log but don't block the login
      console.warn("Failed to sync user to backend:", backendErr);
    }
  } catch (err) {
    console.error(err);
    if (err instanceof Error) {
      alert(err.message);
    } else {
      alert("An error occurred");
    }
  }
};

const logInWithEmailAndPassword = async (email: string, password: string) => {
  try {
    const res = await signInWithEmailAndPassword(auth, email, password);
    const user = res.user
    console.log(user.emailVerified)
    if (!user.emailVerified) {
      logout();
      throw new Error('Please verify your email before logging in.');
    }
  } catch (err) {
    console.error(err);
    if (err instanceof Error) {
      alert(err.message);
    } else {
      alert("An error occurred");
    }
  }
};

const registerWithEmailAndPassword = async (
  name: string,
  email: string,
  password: string,
  confirmPassword: string,
) => {
  try {
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    sendEmailVerification(user).then(() => {
      alert('Verification email sent!');
    }).catch((error) => {
      alert(`Failed to send verification email: ${error}`);
    });
  } catch (err) {
    if (err instanceof Error) {
      alert(err.message);
    } else {
      alert("An error occurred");
    }
  }
};

const sendPasswordReset = async (email: string) => {
  await sendPasswordResetEmail(auth, email);
};

const logout = () => {
  signOut(auth);
};

export {
  auth,
  db,
  signInWithGoogle,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordReset,
  logout,
};
