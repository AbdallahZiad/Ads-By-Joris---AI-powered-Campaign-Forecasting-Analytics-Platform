import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query'; // ▼▼▼ Import QueryClient
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

    // ▼▼▼ Access the global cache ▼▼▼
    const queryClient = useQueryClient();

    const refreshUser = async () => {
        try {
            const userData = await authService.getMe();
            setUser(userData);
        } catch (error) {
            console.error("Failed to fetch user profile", error);
            logout();
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
        refreshUser();
    };

    const logout = () => {
        // 1. Clear Token
        localStorage.removeItem('accessToken');

        // 2. Clear User State
        setUser(null);

        // 3. ▼▼▼ SECURITY: Wipe all cached data (Projects, Keywords, etc.) ▼▼▼
        // This ensures the next user doesn't see a millisecond of the old user's data
        queryClient.removeQueries();
        // Also clear mutation state to be safe
        queryClient.clear();
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