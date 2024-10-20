//hooks.ts
import { auth, db } from '../lib/firebase';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { User } from 'firebase/auth';

export function useUserData() {
  const [user, loading, error] = useAuthState(auth);
  const [username, setUsername] = useState<string | null>(null);

  console.log('useUserData - user:', user, 'loading:', loading, 'error:', error);

  useEffect(() => {
    console.log('useUserData effect - user:', user);
    let unsubscribe: (() => void) | undefined;

    if (user) {
      const ref = doc(db, 'users', user.uid);
      unsubscribe = onSnapshot(ref, (doc) => {
        const newUsername = doc.data()?.username || null;
        console.log('Firestore snapshot - username:', newUsername);
        setUsername(newUsername);
      });
    } else {
      setUsername(null);
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user]);

  console.log('useUserData return - user:', user, 'username:', username);
  return { user, username, loading, error };
}