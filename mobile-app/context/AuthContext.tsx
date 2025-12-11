import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AuthContextType = {
    userToken: string | null;
    user: any;
    isLoading: boolean;
    signIn: (token: string, user: any) => Promise<void>;
    signOut: () => Promise<void>;
    updateUser: (profileData: any) => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
    userToken: null,
    user: null,
    isLoading: true,
    signIn: async () => { },
    signOut: async () => { },
    updateUser: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [userToken, setUserToken] = useState<string | null>(null);
    const [user, setUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const bootstrapAsync = async () => {
            let token: string | null = null;
            let userData: any = null;

            try {
                token = await AsyncStorage.getItem('token');
                const userStr = await AsyncStorage.getItem('user');
                if (userStr) {
                    userData = JSON.parse(userStr);
                }
            } catch (e) {
                // Restoring token failed
            }

            setUserToken(token);
            setUser(userData);
            setIsLoading(false);
        };

        bootstrapAsync();
    }, []);

    const signIn = async (token: string, userProfile: any) => {
        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('user', JSON.stringify(userProfile));
        setUserToken(token);
        setUser(userProfile);
    };

    const signOut = async () => {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('user');
        setUserToken(null);
        setUser(null);
    };

    const updateUser = async (profileData: any) => {
        const currentUser = await AsyncStorage.getItem('user');
        if (currentUser) {
            const parsedUser = JSON.parse(currentUser);
            const updatedUser = { ...parsedUser, ...profileData };
            await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser); // Update the local state as well
        }
    };

    return (
        <AuthContext.Provider value={{ userToken, user, isLoading, signIn, signOut, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};
