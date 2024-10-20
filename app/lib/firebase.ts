//firebase.ts
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyD8umMSHZKFoN_L38RFBY1o1l1ELd_QyWU",
    authDomain: "fireship-firebase-basics-53218.firebaseapp.com",
    projectId: "fireship-firebase-basics-53218",
    storageBucket: "fireship-firebase-basics-53218.appspot.com",
    messagingSenderId: "719151951875",
    appId: "1:719151951875:web:989e04ecd42eb4f14b9e36",
    measurementId: "G-VEWYPJS747"
  };

// Check if Firebase is already initialized, if not, initialize it
let app;
if (!getApps().length) {
    app = initializeApp(firebaseConfig);
} else {
    app = getApps()[0];  // Use the already initialized app
}

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const googleAuthProvider = new GoogleAuthProvider();

console.log('Firebase initialized:', app);
console.log('Auth instance:', auth);

export { auth, googleAuthProvider, db, storage };