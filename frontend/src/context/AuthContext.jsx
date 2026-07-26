import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../data/config';

const AuthContext = createContext({
    authUser: null,
    authLoading: true,
    logout: async () => {}
});

export const AuthProvider = ({ children }) => {
    const [authUser, setAuthUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);

    useEffect(() => {
        if (!auth) {
            setAuthLoading(false);
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setAuthUser(user);
            setAuthLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const logout = async () => {
        if (auth) {
            await signOut(auth);
        }
    };

    return (
        <AuthContext.Provider value={{ authUser, authLoading, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
