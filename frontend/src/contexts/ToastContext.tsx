import React, { createContext, useCallback, useState, ReactNode } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
    id: string;
    type: ToastType;
    title?: string;
    message: string;
    duration?: number;
}

interface ToastContextType {
    toasts: ToastMessage[];
    addToast: (type: ToastType, message: string, title?: string, duration?: number) => void;
    removeToast: (id: string) => void;
    success: (message: string, title?: string, duration?: number) => void;
    error: (message: string, title?: string, duration?: number) => void;
    warning: (message: string, title?: string, duration?: number) => void;
    info: (message: string, title?: string, duration?: number) => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const addToast = useCallback((type: ToastType, message: string, title?: string, duration = 5000) => {
        const id = Math.random().toString(36).substr(2, 9);
        // We pass the duration to the component, but we DO NOT set a timeout here anymore.
        const newToast: ToastMessage = { id, type, title, message, duration };
        setToasts((prev) => [...prev, newToast]);
    }, []);

    const success = useCallback((msg: string, title?: string, duration?: number) => addToast('success', msg, title, duration), [addToast]);
    const error = useCallback((msg: string, title?: string, duration?: number) => addToast('error', msg, title, duration), [addToast]);
    const warning = useCallback((msg: string, title?: string, duration?: number) => addToast('warning', msg, title, duration), [addToast]);
    const info = useCallback((msg: string, title?: string, duration?: number) => addToast('info', msg, title, duration), [addToast]);

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast, success, error, warning, info }}>
            {children}
        </ToastContext.Provider>
    );
};