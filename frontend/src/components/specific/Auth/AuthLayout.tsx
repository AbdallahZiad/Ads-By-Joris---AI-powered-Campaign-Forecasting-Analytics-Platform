import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface Props {
    title: string;
    subtitle?: string;
    children: ReactNode;
}

const AuthLayout: React.FC<Props> = ({ title, subtitle, children }) => {
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.2, 0, 0.2, 1] }}
                className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
            >
                <div className="px-8 pt-10 pb-6 text-center">
                    {/* Logo removed for cleaner look on white background */}
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">{title}</h2>
                    {subtitle && (
                        <p className="mt-2 text-sm text-gray-500">{subtitle}</p>
                    )}
                </div>

                <div className="px-8 pb-8">
                    {children}
                </div>
            </motion.div>
        </div>
    );
};

export default AuthLayout;