import { Children, createContext , useContext, useState} from "react";

//1. Tipado del objeto principal del contexto
type User={
    email: string;
    authToken?: string;
    sessionToken?: string;
    role?: string;
}|null
type AuthContextType={
user: User | null;
login: (email:string)=>boolean;
logout: ()=>{};
}

//2. Creación del contexto
const AuthContext = createContext<AuthContextType | null>(null);

//3.La creación del provider: medio por el cuál manejamos el estado desde otra pantallas.
export const AuthProvider = ({children}:{children: React.ReactNode})=>{
const [user,setUser]= useState<User>(null);

const login=(email:string): boolean =>{
    const isAllowed= email.endsWith('.edu');
    if (isAllowed)
    setUser ({email});

        return isAllowed;
}

    const logout = () =>{ 
          return '';
}

    return( 
        <AuthContext.Provider value={{user,login,logout}}>
            {children}
        </AuthContext.Provider>
    );

};
//4 Hook personalizado : exposicion del contexto a componentes de la aplicacion.
export const UseAuth= () => {
    const context = useContext(AuthContext);
    if (!context)throw new Error ("useAuth debe ser utilizado dentro del Authprovider");
    return context;
  
}

