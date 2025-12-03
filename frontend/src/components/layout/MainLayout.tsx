import React from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import Navbar from '../common/Navbar/Navbar';
import Sidebar from '../common/Sidebar/Sidebar';
import { useProject } from '../../contexts/ProjectContext';

const MainLayout: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { hasAnalysisData } = useProject(); // Removed hasScannedData

    const getCurrentViewMode = () => {
        const path = location.pathname;
        if (path.includes('/analysis')) return 'analysis';
        if (path.includes('/planner')) return 'management';
        if (path.includes('/scanner')) return 'scanner';
        if (path.includes('/google-ads')) return 'google-ads';
        return 'none';
    };

    const handleNavigate = (mode: 'scanner' | 'management' | 'analysis' | 'google-ads') => {
        // Strict Flow Control (Only Analysis needs data presence check)
        if (mode === 'analysis' && !hasAnalysisData) return;

        const routes = {
            scanner: '/scanner',
            management: '/planner',
            analysis: '/analysis',
            'google-ads': '/google-ads'
        };
        navigate(routes[mode]);
    };

    return (
        <div className="min-h-screen main-container flex flex-col bg-gray-100">
            <Navbar />
            <div className="flex flex-1 overflow-hidden relative">
                <Sidebar
                    // @ts-ignore
                    viewMode={getCurrentViewMode()}
                    onNavigate={handleNavigate}
                    hasAnalysisData={hasAnalysisData}
                    onAuthClick={() => navigate('/auth/signin')}
                />

                <main className="flex-1 overflow-y-auto ml-16 relative">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;