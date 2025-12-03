import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { HiRefresh, HiCheckCircle, HiExclamationCircle } from 'react-icons/hi';
import { useAuth } from '../../../contexts/AuthContext';
import { authService } from '../../../api/services/authService';

const GoogleCallback: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { isAuthenticated, refreshUser, isLoading: isAuthLoading } = useAuth();
    const code = searchParams.get('code');

    const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
    const [message, setMessage] = useState('Processing secure connection...');

    const linkAdsMutation = useMutation({
        mutationFn: authService.linkGoogleAds,
        onSuccess: async () => {
            setStatus('success');
            setMessage('Google Ads account linked successfully!');
            await refreshUser();
            // ▼▼▼ FIX: Redirect to the Google Ads page after linking ▼▼▼
            setTimeout(() => navigate('/google-ads'), 2000);
        },
        onError: (error: Error) => {
            setStatus('error');
            setMessage(error.message || 'Failed to link Google Ads account.');
            // Go back to the ads page so they can try again
            setTimeout(() => navigate('/google-ads'), 4000);
        }
    });

    useEffect(() => {
        if (isAuthLoading) return;

        if (!code) {
            navigate('/scanner', { replace: true });
            return;
        }

        if (status !== 'processing') return;

        if (isAuthenticated) {
            // CASE A: Linking Ads
            window.history.replaceState({}, document.title, window.location.pathname);
            setMessage('Linking your Google Ads account...');
            linkAdsMutation.mutate(code);
        } else {
            // CASE B: Sign In
            navigate(`/auth/signin?code=${code}`, { replace: true });
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [code, isAuthenticated, isAuthLoading, navigate]);

    if (isAuthLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen text-gray-500 bg-gray-50">
                <HiRefresh className="animate-spin mb-3 text-teal-600" size={32} />
                <p>Verifying session...</p>
            </div>
        );
    }

    if (!isAuthenticated && code) {
        return (
            <div className="flex flex-col items-center justify-center h-screen text-gray-500 bg-gray-50">
                <HiRefresh className="animate-spin mb-3 text-teal-600" size={32} />
                <p>Redirecting to login...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-50 p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 max-w-sm w-full text-center">
                {status === 'processing' && (
                    <>
                        <HiRefresh className="animate-spin mx-auto mb-4 text-teal-600" size={48} />
                        <h3 className="text-lg font-bold text-gray-900">Connecting...</h3>
                        <p className="text-gray-500 mt-2 text-sm">{message}</p>
                    </>
                )}

                {status === 'success' && (
                    <div className="animate-in zoom-in duration-300">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <HiCheckCircle size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">Success!</h3>
                        <p className="text-gray-600 mt-2 text-sm">{message}</p>
                    </div>
                )}

                {status === 'error' && (
                    <div className="animate-in zoom-in duration-300">
                        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <HiExclamationCircle size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">Linking Failed</h3>
                        <p className="text-red-500 mt-2 text-sm">{message}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GoogleCallback;