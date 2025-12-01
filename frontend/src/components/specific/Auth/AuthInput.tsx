import React, { InputHTMLAttributes } from 'react';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

const AuthInput: React.FC<Props> = ({ label, error, className = '', ...props }) => {
    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">
                {label}
            </label>
            <input
                className={`
                    w-full px-4 py-2.5 rounded-lg border bg-gray-50 text-gray-900 text-sm outline-none transition-all duration-200
                    placeholder-gray-400
                    ${error
                    ? 'border-red-300 focus:ring-2 focus:ring-red-100 focus:border-red-400 bg-red-50/30'
                    : 'border-gray-200 focus:ring-2 focus:ring-teal-100 focus:border-teal-400 focus:bg-white'
                }
                    ${className}
                `}
                {...props}
            />
            {error && (
                <p className="mt-1 text-xs text-red-500 ml-1 font-medium animate-pulse">
                    {error}
                </p>
            )}
        </div>
    );
};

export default AuthInput;