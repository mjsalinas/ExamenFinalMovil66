import React, { useContext, createContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

type User = {
  id: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  register: (email: string, pwd: string) => Promise<void>;
  login: (email: string, pwd: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();

      if (data.session?.user) {
        setUser({
          id: data.session.user.id,
          email: data.session.user.email ?? "",
        });
      }
    };

    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email ?? "",
          });
        } else {
          setUser(null);
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const register = async (email: string, pwd: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password: pwd,
    });

    if (error) throw error;
  };

  const login = async (email: string, pwd: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: pwd,
    });

    if (error) throw error;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth debe ser utilizado dentro de AuthProvider");
  }

  return context;
};