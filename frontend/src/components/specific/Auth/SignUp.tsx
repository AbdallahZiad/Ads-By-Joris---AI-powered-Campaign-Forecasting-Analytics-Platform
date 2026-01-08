import React, { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import AuthLayout from './AuthLayout';
import AuthInput from './AuthInput';
import { authService } from '../../../api/services/authService';
import { HiCheckCircle, HiRefresh, HiCheck } from 'react-icons/hi';
import { useToast } from '../../../hooks/useToast';

const SignUp: React.FC = () => {
    const navigate = useNavigate();
    const toast = useToast();

    const [formData, setFormData] = useState({ full_name: '', email: '', password: '' });
    const [success, setSuccess] = useState(false);

    const [timeLeft, setTimeLeft] = useState(15 * 60);
    const [resendCooldown, setResendCooldown] = useState(60);

    const [resendStatus, setResendStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const signupMutation = useMutation({
        mutationFn: authService.signup,
        onSuccess: () => {
            setSuccess(true);
            setTimeLeft(15 * 60);
            setResendCooldown(60);
            toast.success("Account created! Please check your email.", "Welcome");
        },
        onError: (error: Error) => {
            // ▼▼▼ FIX: Handle Offline/Network Errors Gracefully ▼▼▼
            const isNetworkError = error.message === 'Failed to fetch';

            toast.error(
                isNetworkError
                    ? 'Unable to connect to the server. Please check your internet connection.'
                    : error.message || 'Registration failed. Please try again.',
                isNetworkError ? 'Connection Error' : 'Sign Up Failed'
            );
        }
    });

    const resendMutation = useMutation({
        mutationFn: authService.resendVerification,
        onSuccess: () => {
            setResendStatus('success');
            setTimeLeft(15 * 60);
            setResendCooldown(60);
            toast.success("Verification email resent.");
            setTimeout(() => setResendStatus('idle'), 3000);
        },
        onError: (error: Error) => {
            console.error("Resend failed:", error);
            setResendStatus('error');

            // Handle Network Error on Resend too
            const isNetworkError = error.message === 'Failed to fetch';
            toast.error(
                isNetworkError ? "Connection lost. Could not resend email." : "Failed to resend verification email."
            );
            setTimeout(() => setResendStatus('idle'), 3000);
        }
    });

    useEffect(() => {
        if (!success) return;
        if (timeLeft <= 0) return;

        const intervalId = setInterval(() => {
            setTimeLeft((t) => t - 1);
        }, 1000);

        return () => clearInterval(intervalId);
    }, [success, timeLeft]);

    useEffect(() => {
        if (!success) return;
        if (resendCooldown <= 0) return;

        const intervalId = setInterval(() => {
            setResendCooldown((t) => t - 1);
        }, 1000);

        return () => clearInterval(intervalId);
    }, [success, resendCooldown]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password.length < 8) {
            toast.warning('Password must be at least 8 characters long.', 'Weak Password');
            return;
        }
        signupMutation.mutate(formData);
    };

    if (success) {
        return (
            <AuthLayout title="Check your email">
                <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <HiCheckCircle size={32} />
                    </div>
                    <p className="text-gray-600 mb-2">
                        We've sent a verification link to <strong>{formData.email}</strong>.
                    </p>
                    <p className="text-sm text-gray-500 mb-6">
                        Link expires in <span className="font-mono font-medium text-gray-700">{formatTime(timeLeft)}</span>
                    </p>

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => navigate('/auth/signin')}
                            className="w-full py-2 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors"
                        >
                            Return to Sign In
                        </button>

                        <div className="h-8 flex items-center justify-center relative">
                            <AnimatePresence mode="wait">
                                {resendStatus === 'success' ? (
                                    <motion.div
                                        key="success"
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -5 }}
                                        className="flex items-center gap-1 text-sm text-green-600 font-medium"
                                    >
                                        <HiCheck size={16} /> Email sent successfully!
                                    </motion.div>
                                ) : resendStatus === 'error' ? (
                                    <motion.div
                                        key="error"
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -5 }}
                                        className="text-sm text-red-500 font-medium"
                                    >
                                        Failed to send email.
                                    </motion.div>
                                ) : (
                                    <motion.button
                                        key="button"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        onClick={() => resendMutation.mutate(formData.email)}
                                        disabled={resendMutation.isPending || resendCooldown > 0}
                                        className="text-sm text-gray-500 hover:text-gray-800 underline flex items-center justify-center gap-1 disabled:opacity-50 disabled:no-underline disabled:cursor-not-allowed"
                                    >
                                        {resendMutation.isPending
                                            ? 'Sending...'
                                            : resendCooldown > 0
                                                ? `Resend available in ${resendCooldown}s`
                                                : 'Resend verification email'
                                        }
                                        {!resendMutation.isPending && resendCooldown === 0 && <HiRefresh size={14} />}
                                    </motion.button>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout
            title="Create an account"
            subtitle="Start organizing your strategy today"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <AuthInput
                    label="Full Name"
                    placeholder="John Doe"
                    value={formData.full_name}
                    onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                    required
                />
                <AuthInput
                    label="Email Address"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                />
                <AuthInput
                    label="Password"
                    type="password"
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required
                />

                {/* Removed Inline Error Div */}

                <button
                    type="submit"
                    disabled={signupMutation.isPending}
                    className="w-full py-3 px-4 bg-teal-600 text-white font-bold rounded-xl shadow-lg hover:bg-teal-700 focus:ring-4 focus:ring-teal-200 transition-all duration-200 disabled:opacity-70"
                >
                    {signupMutation.isPending ? 'Creating Account...' : 'Create Account'}
                </button>

                <p className="text-center text-sm text-gray-500 mt-6">
                    Already have an account?{' '}
                    <button
                        type="button"
                        onClick={() => navigate('/auth/signin')}
                        className="font-semibold text-teal-600 hover:text-teal-700 transition-colors"
                    >
                        Sign in
                    </button>
                </p>
            </form>
        </AuthLayout>
    );
};

export default SignUp;