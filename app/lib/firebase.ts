import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, collection, where, getDocs, query, limit, QueryDocumentSnapshot, DocumentData, Timestamp } from 'firebase/firestore';
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

export { auth, googleAuthProvider, db, storage };



/**
 * Gets a users/{uid} document with username
 * @param  {string} username
 * @returns {Promise<QueryDocumentSnapshot | undefined>} - Returns the user document or undefined if not found
 */
export async function getUserWithUsername(username: string): Promise<QueryDocumentSnapshot | undefined> {
  const usersRef = collection(db, 'users');
  const q = query(usersRef, where('username', '==', username), limit(1));
  const querySnapshot = await getDocs(q);
  const userDoc = querySnapshot.docs[0];
  return userDoc;
}

// Define an interface for the Firestore data
interface FirestorePost {
    slug: string;
    username: string;
    title: string;
    content: string;
    heartCount?: number;
    published?: boolean;
    createdAt: Timestamp;
    updatedAt?: Timestamp;
  }
  
  // Modify the Post interface for the client-side data
  interface Post {
    slug: string;
    username: string;
    title: string;
    content: string;
    heartCount?: number;
    published?: boolean;
    createdAt: number;
    updatedAt?: number;
  }
  
  export function postToJSON(doc: QueryDocumentSnapshot): Post {
    const data = doc.data() as FirestorePost;
  
    return {
      ...data,
      createdAt: data.createdAt.toMillis(),
      updatedAt: data.updatedAt?.toMillis(),
    };
  }