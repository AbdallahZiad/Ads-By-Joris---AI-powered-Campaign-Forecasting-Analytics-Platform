import React from 'react';
import { HiDatabase, HiSparkles } from 'react-icons/hi';

interface Props {
    history?: boolean;
    forecast?: boolean;
}

const LoadingOverlay: React.FC<Props> = ({ history = false, forecast = false }) => {
    if (!history && !forecast) return null;

    return (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/80 backdrop-blur-[2px] transition-all duration-500">
            <div className="flex flex-col gap-3 p-6 bg-white/90 rounded-xl shadow-lg border border-gray-100/50">
                {history && (
                    <div className="flex items-center gap-3 text-teal-600">
                        <div className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-teal-500"></span>
                        </div>
                        <HiDatabase className="animate-pulse" size={20} />
                        <span className="text-sm font-medium">Gathering historical metrics...</span>
                    </div>
                )}
                {forecast && (
                    <div className="flex items-center gap-3 text-indigo-600">
                        <div className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                        </div>
                        <HiSparkles className="animate-pulse" size={20} />
                        <span className="text-sm font-medium">Running forecast models...</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LoadingOverlay;