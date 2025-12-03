import React from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { HiRefresh } from 'react-icons/hi';
import GoogleCallback from './GoogleCallback';

const RootDispatcher: React.FC = () => {
    const [searchParams] = useSearchParams();
    const { isAuthenticated, isLoading } = useAuth();

    // Check if Google sent us back with a code
    const hasGoogleCode = !!searchParams.get('code');

    // 1. If we have a code, WE MUST RENDER THE CALLBACK.
    // We do this regardless of auth state, because GoogleCallback handles
    // both "Login" (Guest) and "Linking" (User) scenarios.
    if (hasGoogleCode) {
        return <GoogleCallback />;
    }

    // 2. Wait for Auth to initialize before redirecting normal traffic
    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900">
                <HiRefresh className="animate-spin text-teal-600 mb-4" size={40} />
            </div>
        );
    }

    // 3. Normal Traffic Routing
    if (isAuthenticated) {
        return <Navigate to="/scanner" replace />;
    }

    return <Navigate to="/auth/signin" replace />;
};

export default RootDispatcher;