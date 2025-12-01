import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { HiMail } from 'react-icons/hi';
import AuthLayout from './AuthLayout';
import AuthInput from './AuthInput';
import { authService } from '../../../api/services/authService';

interface Props {
    onNavigate: (view: 'signin') => void;
}

const ForgotPassword: React.FC<Props> = ({ onNavigate }) => {
    const [email, setEmail] = useState('');
    const [success, setSuccess] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const mutation = useMutation({
        mutationFn: authService.requestPasswordRecovery,
        onSuccess: () => {
            setSuccess(true);
        },
        onError: (error: Error) => {
            setErrorMsg(error.message || 'Failed to send recovery email.');
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');
        mutation.mutate(email);
    };

    if (success) {
        return (
            <AuthLayout title="Check your inbox">
                <div className="text-center">
                    <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <HiMail size={32} />
                    </div>
                    <p className="text-gray-600 mb-6">
                        We've sent a password reset link to <strong>{email}</strong>.
                    </p>
                    <button
                        onClick={() => onNavigate('signin')}
                        className="text-teal-600 font-semibold hover:text-teal-700 underline"
                    >
                        Back to Sign In
                    </button>
                </div>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout
            title="Reset Password"
            subtitle="Enter your email to receive recovery instructions"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <AuthInput
                    label="Email Address"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                {errorMsg && (
                    <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium border border-red-100">
                        {errorMsg}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={mutation.isPending}
                    className="w-full py-3 px-4 bg-teal-600 text-white font-bold rounded-xl shadow-lg hover:bg-teal-700 focus:ring-4 focus:ring-teal-200 transition-all duration-200 disabled:opacity-70"
                >
                    {mutation.isPending ? 'Sending...' : 'Send Reset Link'}
                </button>

                <div className="text-center mt-6">
                    <button
                        type="button"
                        onClick={() => onNavigate('signin')}
                        className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
                    >
                        Back to Sign In
                    </button>
                </div>
            </form>
        </AuthLayout>
    );
};

export default ForgotPassword;