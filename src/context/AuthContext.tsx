import React, { createContext, useContext, useMemo, useState } from 'react';

type AuthState = {
  isAuthenticated: boolean;
  user: string | null;
  signIn: (name: string) => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<string | null>(null);

  const value = useMemo<AuthState>(
    () => ({
      isAuthenticated: Boolean(user),
      user,
      signIn: (name: string) => setUser(name),
      signOut: () => setUser(null),
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

export default AuthContext;
