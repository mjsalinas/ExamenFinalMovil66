import type { Session, User } from '@supabase/supabase-js';
import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { supabase } from '@/lib/supabase';

export type AppUser = {
  id: string;
  email: string | null;
};

export class AuthError extends Error {}

function mapUser(user: User): AppUser {
  return {
    id: user.id,
    email: user.email ?? null,
  };
}

type AuthContextValue = {
  session: Session | null;
  user: AppUser | null;
  /** true mientras se restaura la sesión guardada al abrir la app. */
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (active) setSession(data.session);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    // Mantiene el estado sincronizado con login, logout, refresh de token y
    // con cualquier cambio hecho desde otra pestaña en web.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (active) setSession(nextSession);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session ? mapUser(session.user) : null,
      loading,
      signIn: async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw new AuthError(error.message);
        setSession(data.session);
      },
      signUp: async (email, password) => {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw new AuthError(error.message);
        if (data.session) setSession(data.session);
      },
      signOut: async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw new AuthError(error.message);
        setSession(null);
      },
    }),
    [session, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth debe usarse dentro de un <AuthProvider>');
  }

  return context;
}
