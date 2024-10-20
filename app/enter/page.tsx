// app/enter/page.tsx
'use client';

import { useEffect, useState, useCallback, useContext } from 'react';
import { auth, googleAuthProvider, db } from '../lib/firebase';
import { signInWithPopup, signOut } from 'firebase/auth';
import { doc, getDoc, writeBatch } from 'firebase/firestore';
import { UserContext } from '../lib/context';
import debounce from 'lodash.debounce';

export default function EnterPage() {
  const { user, username } = useContext(UserContext);

  // 1. User is signed out <SignInButton />
  // 2. User is signed in but missing username <UsernameForm />
  // 3. User is signed in and has username <SignOutButton />
  return (
    <main>
      {user ? (!username ? <UsernameForm /> : <SignOutButton />) : <SignInButton />}
    </main>
  );
}

// Sign in with Google button
function SignInButton() {
  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleAuthProvider);
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  return (
    <button onClick={signInWithGoogle}>
      <img src="/google.png" alt="Google logo" /> Sign in with Google
    </button>
  );
}

// Sign out button
function SignOutButton() {
  const signOutUser = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return <button onClick={signOutUser}>Sign Out</button>;
}

// Username form component
function UsernameForm() {
  const [formValue, setFormValue] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user } = useContext(UserContext);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    // Create references for both documents
    const userDoc = doc(db, 'users', user.uid);
    const usernameDoc = doc(db, 'usernames', formValue);

    // Commit both docs together as a batch write
    const batch = writeBatch(db);
    batch.set(userDoc, {
      username: formValue,
      photoURL: user.photoURL,
      displayName: user.displayName,
    });
    batch.set(usernameDoc, { uid: user.uid });

    try {
      await batch.commit();
    } catch (error) {
      console.error('Error creating username:', error);
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Force form value typed in form to match correct format
    const val = e.target.value.toLowerCase();
    const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

    // Only set form value if length is less than 3 or it passes regex
    if (val.length < 3) {
      setFormValue(val);
      setLoading(false);
      setIsValid(false);
    }

    if (re.test(val)) {
      setFormValue(val);
      setLoading(true);
      setIsValid(false);
    }
  };

  useEffect(() => {
    checkUsername(formValue);
  }, [formValue]);

  // Check username availability after each debounced change
  const checkUsername = useCallback(
    debounce(async (username: string) => {
      if (username.length >= 3) {
        const ref = doc(db, 'usernames', username);
        const docSnap = await getDoc(ref);
        console.log('Firestore read executed!');
        setIsValid(!docSnap.exists());
        setLoading(false);
      }
    }, 500),
    []
  );

  return (
    <section>
      <h3>Choose Username</h3>
      <form onSubmit={onSubmit}>
        <input
          name="username"
          placeholder="myname"
          value={formValue}
          onChange={onChange}
        />
        <UsernameMessage username={formValue} isValid={isValid} loading={loading} />
        <button type="submit" disabled={!isValid}>
          Choose
        </button>

        <h3>Debug State</h3>
        <div>
          Username: {formValue}
          <br />
          Loading: {loading.toString()}
          <br />
          Username Valid: {isValid.toString()}
        </div>
      </form>
    </section>
  );
}

// Component to display username validation messages
function UsernameMessage({
  username,
  isValid,
  loading,
}: {
  username: string;
  isValid: boolean;
  loading: boolean;
}) {
  if (loading) {
    return <p>Checking...</p>;
  } else if (isValid) {
    return <p className="text-success">{username} is available!</p>;
  } else if (username && !isValid) {
    return <p className="text-danger">That username is taken!</p>;
  } else {
    return <p></p>;
  }
}
