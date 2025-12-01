import React, { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import AuthLayout from './AuthLayout';
import AuthInput from './AuthInput';
import { authService } from '../../../api/services/authService';
import { HiCheckCircle, HiRefresh } from 'react-icons/hi';

interface Props {
    onNavigate: (view: 'signin') => void;
}

const SignUp: React.FC<Props> = ({ onNavigate }) => {
    const [formData, setFormData] = useState({ full_name: '', email: '', password: '' });
    const [success, setSuccess] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    // Timer State
    const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes in seconds

    const signupMutation = useMutation({
        mutationFn: authService.signup,
        onSuccess: () => {
            setSuccess(true);
            setTimeLeft(15 * 60); // Reset timer on success
        },
        onError: (error: Error) => {
            setErrorMsg(error.message || 'Registration failed. Please try again.');
        }
    });

    const resendMutation = useMutation({
        mutationFn: authService.resendVerification,
        onSuccess: () => {
            alert(`Verification email resent to ${formData.email}`);
            setTimeLeft(15 * 60); // Reset timer
        },
        onError: (error: Error) => {
            alert('Failed to resend email: ' + error.message);
        }
    });

    // Timer Logic
    useEffect(() => {
        if (!success) return;
        if (timeLeft <= 0) return;

        const intervalId = setInterval(() => {
            setTimeLeft((t) => t - 1);
        }, 1000);

        return () => clearInterval(intervalId);
    }, [success, timeLeft]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');
        if (formData.password.length < 8) {
            setErrorMsg('Password must be at least 8 characters long.');
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
                            onClick={() => onNavigate('signin')}
                            className="w-full py-2 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors"
                        >
                            Return to Sign In
                        </button>

                        <button
                            onClick={() => resendMutation.mutate(formData.email)}
                            disabled={resendMutation.isPending || timeLeft <= 0}
                            className="text-sm text-gray-500 hover:text-gray-800 underline flex items-center justify-center gap-1 disabled:opacity-50 disabled:no-underline"
                        >
                            {resendMutation.isPending ? 'Sending...' : 'Resend verification email'}
                            {!resendMutation.isPending && <HiRefresh size={14} />}
                        </button>
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

                {errorMsg && (
                    <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium border border-red-100">
                        {errorMsg}
                    </div>
                )}

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
                        onClick={() => onNavigate('signin')}
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