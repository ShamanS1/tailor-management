import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import axios from 'axios';

interface User {
    firebaseUid: string;
    name: string;
    role: string;
    _id: string;
}

const UserContext = createContext<{
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    logout: () => void;
}>({ user: null, setUser: () => {}, logout: () => {} });

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const auth = getAuth();

        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                try {
                    // Adjust the API URL as necessary
                    const response = await axios.get(`http://localhost:5010/api/user/${firebaseUser.uid}`);
                    const userData: User = response.data;
                    setUser(userData);
                } catch (error) {
                    console.error("Error fetching user data", error);
                    setUser(null); // Clear user data if there's an error
                }
            } else {
                setUser(null); // No user logged in
            }
            setLoading(false); // Set loading to false once user data is fetched (or error occurs)
        });

        return unsubscribe; // Cleanup on component unmount
    }, []);

    const logout = () => {
        const auth = getAuth();
        auth.signOut().then(() => setUser(null)).catch(console.error);
    };

    // Return the context provider
    return (
        <UserContext.Provider value={{ user, setUser, logout }}>
            {!loading && children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => useContext(UserContext);
