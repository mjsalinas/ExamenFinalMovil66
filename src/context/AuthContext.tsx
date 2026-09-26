import React, { useContext, createContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Alert } from 'react-native';

type User = {
    id: string;
    email: string;
};

type AuthContextType = {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    signInWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                setUser({ id: session.user.id, email: session.user.email || '' });
            } else {
                setUser(null);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const login = async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) { throw error; }
    }
    const register = async (email: string, password: string) => {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) Alert.alert('Error de Registro', error.message);
        else Alert.alert('Éxito', 'Cuenta creada. Ya puedes iniciar sesión.');
    }

    const logout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) Alert.alert('Error', error.message);
    }

   /* 
      INVESTIGACIÓN GOOGLE OAUTH
      - En los documentos de supabase.docs lei la guia de Supabase para login social usando Expo y WebBrowser para atrapar los deep links.
      - En la practia quise armar el flujo con expo-auth-session y supabase.auth.signInWithOAuth({ provider: 'google' }).
      - Pero me quede pegado configurando el redirect URI para que el navegador regresara la sesión activa a la app en el emulador y no pude avanzar.
    */
    const signInWithGoogle = async () => {
        Alert.alert('Google OAuth', 'Comentarios de la investigacion en mi codigo');
    }

    return (
        <AuthContext.Provider value={{user, login, register, logout, signInWithGoogle}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) 
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    return context;
}