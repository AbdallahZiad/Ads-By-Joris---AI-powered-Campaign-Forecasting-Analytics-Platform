import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface Props {
    title: string;
    subtitle?: string;
    children: ReactNode;
}

const AuthLayout: React.FC<Props> = ({ title, subtitle, children }) => {
    return (
        <div className="min-h-full w-full flex items-center justify-center p-4">
            <motion.div
                // "layout" prop enables smooth height resizing between tabs
                layout
                // The "Clean Lift Up" Animation
                initial={{ opacity: 0, y: 15, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                    duration: 0.3,
                    ease: [0.16, 1, 0.3, 1], // "easeOutExpo" for a premium feel
                    layout: { duration: 0.3 } // Smooth resize speed
                }}
                className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
            >
                <div className="px-8 pt-10 pb-6 text-center">
                    <motion.h2
                        layout="position" // Animate text position if layout changes
                        className="text-2xl font-bold text-gray-900 tracking-tight"
                    >
                        {title}
                    </motion.h2>
                    {subtitle && (
                        <motion.p
                            layout="position"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mt-2 text-sm text-gray-500"
                        >
                            {subtitle}
                        </motion.p>
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