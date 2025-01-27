import React, {createContext , useState, useContext, useEffect } from "react";
import { auth } from "../firebase/firebase";
// import { onAuthStateChanged } from "../firebase/auth"
import { onAuthStateChanged } from "firebase/auth";
const AuthContext  = createContext();

export function useAuth(){
    return useContext(AuthContext)
}

export function AuthProvider({children}) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userLoggedIn, setUserLoggedIn] = useState(false);


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth , initializeUser);
        return unsubscribe;
    }, [])

    async function initializeUser(user) {
        if (user) {
            setCurrentUser({...user});
            setUserLoggedIn(true);
        }
        else {
            setCurrentUser(null);
            setUserLoggedIn(false);
        }
        setLoading(false);
        
    }

    const value = {
        currentUser,
        userLoggedIn,
        loading
    }
    
    return (
        <AuthContext.Provider value={value}>
            {!loading ? children : null}
        </AuthContext.Provider>
    )
}


