//Navbar.tsx
'use client';

import Link from 'next/link';
import { UserContext } from '../lib/context';
import { useContext } from 'react';
import { User } from 'firebase/auth';

interface UserContextType {
  user: User | null | undefined;
  username: string | null;
}

// Top navbar
export default function Navbar() {
  const { user, username } = useContext(UserContext) as UserContextType;

  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link href="/">
            <button className="btn-logo">FEED</button>
          </Link>
        </li>

        {user === undefined ? (
          // Loading state
          <li>
            <span>Loading...</span>
          </li>
        ) : user && username ? (
          // User is signed-in and has username
          <>
            <li className="push-left">
              <Link href="/admin">
                <button className="btn-blue">Write Posts</button>
              </Link>
            </li>
            <li>
              <Link href={`/${username}`}>
                <img src={user.photoURL || '/default-avatar.png'} alt={username} />
              </Link>
            </li>
          </>
        ) : (
          // User is not signed in OR has not created a username
          <li>
            <Link href="/enter">
              <button className="btn-blue">Log in</button>
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}