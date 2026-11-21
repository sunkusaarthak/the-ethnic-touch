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
        try {
            // Purge cached local storage for user privacy and security
            const keysToRemove = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && (key.startsWith('tet_') || key.startsWith('firebase:authUser:'))) {
                    keysToRemove.push(key);
                }
            }
            keysToRemove.forEach(k => localStorage.removeItem(k));
            sessionStorage.clear();
        } catch (e) {
            console.error("[AuthContext] Storage cleanup error:", e);
        }
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
