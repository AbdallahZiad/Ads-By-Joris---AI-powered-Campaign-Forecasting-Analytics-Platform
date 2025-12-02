import React from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import Navbar from '../common/Navbar/Navbar';
import Sidebar from '../common/Sidebar/Sidebar';
import { useProject } from '../../contexts/ProjectContext';

const MainLayout: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { hasScannedData, hasAnalysisData } = useProject();

    // Determine active view based on path
    const getCurrentViewMode = () => {
        const path = location.pathname;
        if (path.includes('/analysis')) return 'analysis';
        if (path.includes('/planner')) return 'management';
        if (path.includes('/scanner')) return 'scanner';
        return 'none';
    };

    const handleNavigate = (mode: 'scanner' | 'management' | 'analysis') => {
        // Strict Flow Control
        if (mode === 'management' && !hasScannedData) return;
        if (mode === 'analysis' && !hasAnalysisData) return;

        const routes = {
            scanner: '/scanner',
            management: '/planner',
            analysis: '/analysis'
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
                    hasScannedData={hasScannedData}
                    hasAnalysisData={hasAnalysisData}
                    onAuthClick={() => navigate('/auth/signin')}
                />

                {/* ▼▼▼ FIX: Static Main Container ▼▼▼
                    We removed AnimatePresence here.
                    Now, this container NEVER unmounts during route changes.
                    The specific pages (Scanner, Planner, Auth) manage their own entry animations.
                */}
                <main className="flex-1 overflow-y-auto ml-16 relative">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;