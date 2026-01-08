import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiCheckCircle, HiExclamationCircle, HiInformationCircle, HiExclamation, HiX } from 'react-icons/hi';
import { ToastMessage } from '../../../contexts/ToastContext';

interface Props {
    toast: ToastMessage;
    onRemove: (id: string) => void;
}

const variants = {
    initial: { opacity: 0, x: 100, scale: 0.9 },
    animate: { opacity: 1, x: 0, scale: 1 },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } }
};

const Toast: React.FC<Props> = ({ toast, onRemove }) => {
    const [isPaused, setIsPaused] = useState(false);
    const duration = toast.duration ?? 5000;

    // ▼▼▼ FIX: Pause-on-Hover Logic ▼▼▼
    useEffect(() => {
        // If duration is 0 (infinite) or we are paused, do nothing.
        if (duration <= 0 || isPaused) return;

        // Start the timer
        const timer = setTimeout(() => {
            onRemove(toast.id);
        }, duration);

        // Cleanup: Clear timer if component unmounts OR if isPaused changes to true
        return () => clearTimeout(timer);
    }, [duration, isPaused, onRemove, toast.id]);

    const styles = {
        success: {
            bg: 'bg-white',
            border: 'border-l-4 border-teal-500',
            icon: <HiCheckCircle className="text-teal-500 w-6 h-6 flex-shrink-0" />,
            title: 'text-gray-900',
        },
        error: {
            bg: 'bg-white',
            border: 'border-l-4 border-red-500',
            icon: <HiExclamationCircle className="text-red-500 w-6 h-6 flex-shrink-0" />,
            title: 'text-gray-900',
        },
        warning: {
            bg: 'bg-white',
            border: 'border-l-4 border-amber-500',
            icon: <HiExclamation className="text-amber-500 w-6 h-6 flex-shrink-0" />,
            title: 'text-gray-900',
        },
        info: {
            bg: 'bg-white',
            border: 'border-l-4 border-blue-500',
            icon: <HiInformationCircle className="text-blue-500 w-6 h-6 flex-shrink-0" />,
            title: 'text-gray-900',
        }
    };

    const style = styles[toast.type];

    return (
        <motion.div
            layout
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            // ▼▼▼ Event Handlers for Pause logic ▼▼▼
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            className={`
                flex items-start gap-3 p-4 rounded-lg shadow-lg pointer-events-auto
                w-full max-w-sm border border-gray-100 ${style.bg} ${style.border}
                cursor-pointer /* Hint that it's interactive */
            `}
        >
            {style.icon}

            <div className="flex-1 min-w-0">
                {toast.title && (
                    <h4 className={`text-sm font-semibold mb-0.5 ${style.title}`}>
                        {toast.title}
                    </h4>
                )}
                <p className="text-sm text-gray-600 leading-tight break-words">
                    {toast.message}
                </p>
            </div>

            <button
                onClick={(e) => {
                    e.stopPropagation(); // Prevent any parent clicks if necessary
                    onRemove(toast.id);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors p-0.5"
            >
                <HiX size={16} />
            </button>
        </motion.div>
    );
};

export default Toast;