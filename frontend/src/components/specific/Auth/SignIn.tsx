import React, { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useGoogleLogin } from '@react-oauth/google';
import { FcGoogle } from 'react-icons/fc';
import AuthLayout from './AuthLayout';
import AuthInput from './AuthInput';
import { authService } from '../../../api/services/authService';
import { useAuth } from '../../../contexts/AuthContext';

interface Props {
    onNavigate: (view: 'signup' | 'forgot-password') => void;
}

const SignIn: React.FC<Props> = ({ onNavigate }) => {
    const { login } = useAuth();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [errorMsg, setErrorMsg] = useState('');

    // Mutation for Standard Email/Pass Login
    const loginMutation = useMutation({
        mutationFn: authService.login,
        onSuccess: (data) => {
            login(data);
        },
        onError: (error: Error) => {
            setErrorMsg(error.message || 'Invalid email or password.');
        }
    });

    // Mutation for Google Login (Sends Code to Backend)
    const googleMutation = useMutation({
        mutationFn: authService.loginGoogle,
        onSuccess: (data) => {
            login(data);
        },
        onError: (error: Error) => {
            console.error(error);
            setErrorMsg(error.message || 'Google sign-in failed.');
        }
    });

    // ▼▼▼ NEW: Capture Google Code after Redirect ▼▼▼
    useEffect(() => {
        const query = new URLSearchParams(window.location.search);
        const code = query.get('code');

        if (code) {
            // 1. Clear the code from URL so we don't loop or look messy
            window.history.replaceState({}, document.title, window.location.pathname);

            // 2. Send the "Golden Ticket" to backend
            googleMutation.mutate(code);
        }
    }, []); // Run once on mount

    // ▼▼▼ UPDATED: Redirect Flow Configuration ▼▼▼
    const loginWithGoogle = useGoogleLogin({
        flow: 'auth-code',
        ux_mode: 'redirect', // <--- Critical: Redirects browser to Google
        redirect_uri: 'http://localhost:8080', // Must match Console & App URL exactly
        onError: (error) => {
            console.error('Google Login Error:', error);
            setErrorMsg('Google Sign-In failed to initialize.');
        }
        // Note: onSuccess is not used here because the page reloads
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');
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
                            onClick={() => onNavigate('forgot-password')}
                            className="text-xs font-medium text-teal-600 hover:text-teal-700 transition-colors"
                        >
                            Forgot password?
                        </button>
                    </div>
                </div>

                {errorMsg && (
                    <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium border border-red-100">
                        {errorMsg}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loginMutation.isPending || googleMutation.isPending}
                    className="w-full py-3 px-4 bg-gray-900 text-white font-semibold rounded-xl shadow-lg hover:bg-gray-800 focus:ring-4 focus:ring-gray-200 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
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

                {/* Custom Google Button triggering the Hook */}
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
                        onClick={() => onNavigate('signup')}
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