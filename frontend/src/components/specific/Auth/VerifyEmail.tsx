import React, { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useSearchParams, useNavigate } from 'react-router-dom'; // ▼▼▼ Updated Imports
import { HiCheckCircle, HiExclamationCircle, HiRefresh } from 'react-icons/hi';
import AuthLayout from './AuthLayout';
import { authService } from '../../../api/services/authService';
import { useAuth } from '../../../contexts/AuthContext';

const VerifyEmail: React.FC = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token'); // ▼▼▼ Hook way

    const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
    const [errorMsg, setErrorMsg] = useState('');

    const mutation = useMutation({
        mutationFn: authService.verifyEmail,
        onSuccess: (data) => {
            setStatus('success');
            setTimeout(() => {
                login(data);
                navigate('/scanner'); // Redirect to app
            }, 2000);
        },
        onError: (error: Error) => {
            setStatus('error');
            setErrorMsg(error.message || 'Verification token is invalid or expired.');
        }
    });

    useEffect(() => {
        if (token) {
            mutation.mutate({ token });
        } else {
            setStatus('error');
            setErrorMsg('No verification token found in URL.');
        }
    }, [token]);

    return (
        <AuthLayout title="Verifying Email">
            <div className="text-center py-4">
                {status === 'verifying' && (
                    <div className="flex flex-col items-center">
                        <HiRefresh className="animate-spin text-teal-500 mb-4" size={40} />
                        <p className="text-gray-600">Please wait while we verify your email...</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
                        <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-4">
                            <HiCheckCircle size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Verified!</h3>
                        <p className="text-gray-600">Redirecting you to the dashboard...</p>
                    </div>
                )}

                {status === 'error' && (
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-4">
                            <HiExclamationCircle size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Verification Failed</h3>
                        <p className="text-red-600 mb-6">{errorMsg}</p>
                        <button
                            onClick={() => navigate('/')}
                            className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                        >
                            Back to Home
                        </button>
                    </div>
                )}
            </div>
        </AuthLayout>
    );
};

export default VerifyEmail;