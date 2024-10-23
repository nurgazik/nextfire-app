// components/UserProfile.tsx
import React from 'react';

interface User {
  photoURL: string | null;
  username: string;
  displayName: string | null;
}

export default function UserProfile({ user }: { user: User }) {
  return (
    <div className="box-center">
      <img src={user.photoURL || 'https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png'} className="card-img-center" alt="User profile" />
      <p>
        <i>@{user.username}</i>
      </p>
      <h1>{user.displayName || 'Anonymous User'}</h1>
    </div>
  );
}
