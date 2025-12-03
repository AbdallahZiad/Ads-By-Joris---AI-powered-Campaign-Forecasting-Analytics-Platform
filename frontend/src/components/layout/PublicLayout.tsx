import React from 'react';
import { Outlet } from 'react-router-dom';

const PublicLayout: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 relative overflow-hidden">

            {/* 1. Ambient Background Effects */}
            {/* A subtle teal glow behind the center to tie in the brand color without overwhelming */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-teal-900/20 rounded-full blur-3xl pointer-events-none" />

            {/* A faint technical grid pattern to give it structure */}
            <div
                className="absolute inset-0 z-0 opacity-[0.03]"
                style={{
                    backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }}
            />

            {/* 2. Main Content Area */}
            <div className="relative z-10 w-full max-w-md px-4 flex flex-col items-center gap-8">

                {/* Logo - Sits naturally on the dark background */}
                {/* No headers, no boxes. Just the brand standing out cleanly. */}
                <div className="flex flex-col items-center gap-2">
                    <img
                        src="/images/base-logo.svg"
                        alt="Ads By Joris"
                        className="h-10 w-auto object-contain drop-shadow-lg"
                    />
                </div>

                {/* The Auth Card (Rendered by Outlet) */}
                <div className="w-full">
                    <Outlet />
                </div>

                {/* Footer Links - Subtle and integrated */}
                <nav className="flex gap-6 text-sm font-medium text-gray-500">
                    <a href="#" className="hover:text-gray-300 transition-colors duration-200">Documentation</a>
                    <a href="#" className="hover:text-gray-300 transition-colors duration-200">Support</a>
                    <a href="#" className="hover:text-gray-300 transition-colors duration-200">Terms</a>
                </nav>
            </div>

            {/* 3. Bottom Legal Text */}
            <footer className="absolute bottom-6 w-full text-center">
                <p className="text-xs text-gray-600">
                    &copy; {new Date().getFullYear()} Ads By Joris. Secure Platform.
                </p>
            </footer>
        </div>
    );
};

export default PublicLayout;