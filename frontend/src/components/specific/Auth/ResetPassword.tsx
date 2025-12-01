import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { HiCheckCircle } from 'react-icons/hi';
import AuthLayout from './AuthLayout';
import AuthInput from './AuthInput';
import { authService } from '../../../api/services/authService';

interface Props {
    token: string;
    onNavigate: (view: 'signin') => void;
}

const ResetPassword: React.FC<Props> = ({ token, onNavigate }) => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [success, setSuccess] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const mutation = useMutation({
        mutationFn: authService.resetPassword,
        onSuccess: () => {
            setSuccess(true);
        },
        onError: (error: Error) => {
            setErrorMsg(error.message || 'Failed to reset password. The link may be expired.');
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');
        if (password.length < 8) {
            setErrorMsg('Password must be at least 8 characters.');
            return;
        }
        if (password !== confirmPassword) {
            setErrorMsg('Passwords do not match.');
            return;
        }
        mutation.mutate({ token, new_password: password });
    };

    if (success) {
        return (
            <AuthLayout title="Password Reset">
                <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <HiCheckCircle size={32} />
                    </div>
                    <p className="text-gray-600 mb-6">
                        Your password has been updated successfully.
                    </p>
                    <button
                        onClick={() => onNavigate('signin')}
                        className="w-full py-3 px-4 bg-gray-900 text-white font-semibold rounded-xl shadow-lg hover:bg-gray-800 transition-all"
                    >
                        Sign In with New Password
                    </button>
                </div>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout
            title="Set New Password"
            subtitle="Please create a secure password"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <AuthInput
                    label="New Password"
                    type="password"
                    placeholder="Min 8 chars"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <AuthInput
                    label="Confirm Password"
                    type="password"
                    placeholder="Repeat password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                    {mutation.isPending ? 'Resetting...' : 'Reset Password'}
                </button>
            </form>
        </AuthLayout>
    );
};

export default ResetPassword;