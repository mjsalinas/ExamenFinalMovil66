import React, { useContext, createContext, useState } from 'react';

type User = {
    id: string;
    email: string;
};

type AuthContextType = {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    const login = async (email: string, password: string) => {

        console.log("Simulando login para:", email);
    }

    const register = async (email: string, password: string) => {
        
        console.log("Simulando registro para:", email);
    }

    const logout = async () => {

        setUser(null);
    }

    return (
        <AuthContext.Provider value={{user, login, register, logout}}>
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