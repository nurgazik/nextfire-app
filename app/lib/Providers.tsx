'use client';

import { UserContext } from "./context";
import { useUserData } from './hooks';

export default function Providers({ children }: { children: React.ReactNode }) {
  const { user, username } = useUserData();

  return (
    <UserContext.Provider value={{ user, username }}>
      {children}
    </UserContext.Provider>
  );
}