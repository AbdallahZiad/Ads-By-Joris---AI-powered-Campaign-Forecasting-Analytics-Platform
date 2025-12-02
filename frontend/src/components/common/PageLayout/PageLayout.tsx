import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface Props {
    children: ReactNode;
    className?: string;
}

const PageLayout: React.FC<Props> = ({ children, className = '' }) => {
    return (
        <motion.div
            // The "Magic" Layout Prop: smooths out resizing if content changes size
            layout
            // The "Clean Lift Up" Animation (Matches AuthLayout exactly)
            initial={{ opacity: 0, y: 15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
                duration: 0.3,
                ease: [0.16, 1, 0.3, 1], // "easeOutExpo" for premium feel
            }}
            className={`w-full min-h-full ${className}`}
        >
            {children}
        </motion.div>
    );
};

export default PageLayout;