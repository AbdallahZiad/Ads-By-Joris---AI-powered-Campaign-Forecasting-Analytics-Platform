import React, { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useGoogleLogin } from '@react-oauth/google';
import { FcGoogle } from 'react-icons/fc';
import { useNavigate } from 'react-router-dom';
import AuthLayout from './AuthLayout';
import AuthInput from './AuthInput';
import { authService } from '../../../api/services/authService';
import { useAuth } from '../../../contexts/AuthContext';
import { useToast } from '../../../hooks/useToast';

const SignIn: React.FC = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const toast = useToast();

    const [formData, setFormData] = useState({ email: '', password: '' });

    const loginMutation = useMutation({
        mutationFn: authService.login,
        onSuccess: (data) => {
            login(data);
        },
        onError: (error: Error) => {
            // ▼▼▼ FIX: Handle Offline/Network Errors Gracefully ▼▼▼
            const isNetworkError = error.message === 'Failed to fetch';

            toast.error(
                isNetworkError
                    ? 'Unable to connect to the server. Please check your internet connection.'
                    : error.message || 'Invalid email or password. Please try again.',
                isNetworkError ? 'Connection Error' : 'Sign In Failed'
            );
        }
    });

    const googleMutation = useMutation({
        mutationFn: authService.loginGoogle,
        onSuccess: (data) => {
            login(data);
        },
        onError: (error: Error) => {
            console.error(error);
            const isNetworkError = error.message === 'Failed to fetch';

            toast.error(
                isNetworkError
                    ? 'Unable to connect to the server. Please check your connection.'
                    : 'Could not authenticate with Google. Please try again.',
                isNetworkError ? 'Connection Error' : 'Google Sign-In Failed'
            );
        }
    });

    useEffect(() => {
        const query = new URLSearchParams(window.location.search);
        const code = query.get('code');

        if (code) {
            window.history.replaceState({}, document.title, window.location.pathname);
            googleMutation.mutate(code);
        }
    }, []);

    const loginWithGoogle = useGoogleLogin({
        flow: 'auth-code',
        ux_mode: 'redirect',
        redirect_uri: window.location.origin,
        onError: (error) => {
            console.error('Google Login Error:', error);
            toast.error('Google Sign-In failed to initialize. Please reload the page.', 'Connection Error');
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        loginMutation.mutate(formData);
    };

    return (
        <AuthLayout
            title="Welcome back"
            subtitle="Sign in to your account to continue"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <AuthInput
                    label="Email Address"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                />

                <div>
                    <AuthInput
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        required
                    />
                    <div className="flex justify-end -mt-3 mb-4">
                        <button
                            type="button"
                            onClick={() => navigate('/auth/forgot-password')}
                            className="text-xs font-medium text-teal-600 hover:text-teal-700 transition-colors"
                        >
                            Forgot password?
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loginMutation.isPending || googleMutation.isPending}
                    className="w-full py-3 px-4 bg-teal-600 text-white font-semibold rounded-xl shadow-lg hover:bg-teal-700 focus:ring-4 focus:ring-teal-200 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {loginMutation.isPending || googleMutation.isPending ? 'Signing in...' : 'Sign In'}
                </button>

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">Or continue with</span>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => loginWithGoogle()}
                    disabled={googleMutation.isPending}
                    className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-white text-gray-700 border border-gray-200 font-medium rounded-xl hover:bg-gray-50 hover:shadow-sm focus:ring-4 focus:ring-gray-100 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {googleMutation.isPending ? (
                        <span className="text-gray-500">Verifying...</span>
                    ) : (
                        <>
                            <FcGoogle size={22} />
                            <span>Sign in with Google</span>
                        </>
                    )}
                </button>

                <p className="text-center text-sm text-gray-500 mt-8">
                    Don't have an account?{' '}
                    <button
                        type="button"
                        onClick={() => navigate('/auth/signup')}
                        className="font-semibold text-teal-600 hover:text-teal-700 transition-colors"
                    >
                        Sign up
                    </button>
                </p>
            </form>
        </AuthLayout>
    );
};

export default SignIn;