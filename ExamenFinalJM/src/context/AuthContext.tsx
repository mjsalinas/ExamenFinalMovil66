import React, { useContext, useEffect } from "react";
import { createContext, useState } from "react";
import { supabase } from "../lib/supabase";
import { Session } from "@supabase/supabase-js";

type User = {
    id: string;
    email: string;
} | null

type AuthContextType = {
    user: User | null;
    register: (email: string, pwd: string)=> Promise<void>,
    login: (email: string, pwd: string)=> Promise<void>;
    logout:()=> Promise<void>;
}

const AuthContext = createContext <AuthContextType | null>(null);

export const AuthProvider =({children}:{children: React.ReactNode})=>{
    const [session, setSession] = useState<Session | null>(null);

    const user: User = session?.user
        ? { id: session.user.id, email: session.user.email ?? "" }
        : null;

    const register = async(email: string, pwd: string)=>{
        const { data, error } = await supabase.auth.signUp({email, password: pwd})
        if (error) throw error;
    }
    
    const login = async(email: string, pwd: string)=>{
        const { data, error } = await supabase.auth.signInWithPassword({email, password: pwd})
        if (error) throw error;
    }
    
    const logout = async()=>{
        const { error } = await supabase.auth.signOut();
        if(error) throw error;
    }

    return(
        <AuthContext.Provider value={{user, register, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () =>{
    const context = useContext(AuthContext);
    if(!context) throw new Error ("useAuth debe ser utilizado dentro de AuthProvider");
    return context;
}