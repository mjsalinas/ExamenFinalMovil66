import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../lib/supabase';

export type User = {
  id: string;
  email: string;
};

type LoginResult = {
  exito: boolean;
  error?: string;
};

export type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<LoginResult>;
  register: (email: string, password: string) => Promise<LoginResult>;
  logout: () => Promise<void>;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({ id: session.user.id, email: session.user.email ?? '' });
      }
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({ id: session.user.id, email: session.user.email ?? '' });
      } else {
        setUser(null);
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<LoginResult> => {
    if (!email.trim() || !password.trim()) {
      return { exito: false, error: 'Correo y contraseña son obligatorios' };
    }
    if (!emailRegex.test(email)) {
      return { exito: false, error: 'Ingresa un correo válido' };
    }
    if (password.length < 6) {
      return { exito: false, error: 'La contraseña debe tener al menos 6 caracteres' };
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      return { exito: false, error: error.message };
    }
    if (data.user) {
      setUser({ id: data.user.id, email: data.user.email ?? '' });
    }
    return { exito: true };
  };

  const register = async (email: string, password: string): Promise<LoginResult> => {
    if (!email.trim() || !password.trim()) {
      return { exito: false, error: 'Correo y contraseña son obligatorios' };
    }
    if (!emailRegex.test(email)) {
      return { exito: false, error: 'Ingresa un correo válido' };
    }
    if (password.length < 6) {
      return { exito: false, error: 'La contraseña debe tener al menos 6 caracteres' };
    }

    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      return { exito: false, error: error.message };
    }
    if (data.user) {
      setUser({ id: data.user.id, email: data.user.email ?? '' });
    }
    return { exito: true };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
}