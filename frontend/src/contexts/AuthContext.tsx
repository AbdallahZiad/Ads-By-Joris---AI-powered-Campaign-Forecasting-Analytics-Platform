import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, TokenResponse } from '../types';
import { apiClient } from '../api/apiClient';
import { authService } from '../api/services/authService';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (tokenData: TokenResponse) => void;
    logout: () => void;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const refreshUser = async () => {
        try {
            const userData = await authService.getMe();
            setUser(userData);
        } catch (error) {
            console.error("Failed to fetch user profile", error);
            logout(); // Invalid token? Log out.
        }
    };

    useEffect(() => {
        const initAuth = async () => {
            const token = apiClient.getToken();
            if (token) {
                await refreshUser();
            }
            setIsLoading(false);
        };
        initAuth();
    }, []);

    const login = (tokenData: TokenResponse) => {
        localStorage.setItem('accessToken', tokenData.access_token);
        // After setting token, fetch user details
        refreshUser();
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: !!user,
            isLoading,
            login,
            logout,
            refreshUser
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};