import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import './index.css';

// Contexts
import { useAuth } from './contexts/AuthContext';
import { ProjectProvider } from './contexts/ProjectContext';

// Layout
import MainLayout from './components/layout/MainLayout';

// Main Views
import WebsiteScanner from './components/specific/WebsiteScanner/WebsiteScanner';
import CategoryManagement from './components/specific/CategoryManagement/CategoryManagement';
import KeywordAnalysis from './components/specific/Analysis/KeywordAnalysis';
import GoogleAdsManager from './components/specific/GoogleAds/GoogleAdsManager';

// Auth Views
import SignIn from './components/specific/Auth/SignIn';
import SignUp from './components/specific/Auth/SignUp';
import ForgotPassword from './components/specific/Auth/ForgotPassword';
import VerifyEmail from './components/specific/Auth/VerifyEmail';
import ResetPassword from './components/specific/Auth/ResetPassword';
import GoogleCallback from './components/specific/Auth/GoogleCallback';

// --- AUTH GUARD ---
const AuthRoute = ({ children }: { children: React.ReactNode }) => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/scanner');
        }
    }, [isAuthenticated, navigate]);

    return <>{children}</>;
};

function App() {
    return (
        <BrowserRouter>
            <ProjectProvider>
                <Routes>
                    <Route element={<MainLayout />}>

                        {/* === APP ROUTES === */}
                        <Route path="/scanner" element={<WebsiteScanner />} />
                        <Route path="/planner" element={<CategoryManagement />} />
                        <Route path="/analysis" element={<KeywordAnalysis />} />
                        <Route path="/google-ads" element={<GoogleAdsManager />} />

                        {/* === AUTH ROUTES === */}
                        <Route path="/auth/signin" element={<AuthRoute><SignIn /></AuthRoute>} />
                        <Route path="/auth/signup" element={<AuthRoute><SignUp /></AuthRoute>} />
                        <Route path="/auth/forgot-password" element={<AuthRoute><ForgotPassword /></AuthRoute>} />

                        {/* === ACTION ROUTES === */}
                        <Route path="/auth/verify-email" element={<VerifyEmail />} />
                        <Route path="/auth/reset-password" element={<ResetPassword />} />

                        {/* === ROOT HANDLER === */}
                        <Route path="/" element={<GoogleCallback />} />

                    </Route>

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </ProjectProvider>
        </BrowserRouter>
    );
}

export default App;