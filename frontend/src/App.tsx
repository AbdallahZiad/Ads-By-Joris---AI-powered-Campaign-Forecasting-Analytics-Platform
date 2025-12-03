import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { HiRefresh } from 'react-icons/hi';
import './index.css';

// Contexts
import { useAuth } from './contexts/AuthContext';
import { ProjectProvider } from './contexts/ProjectContext';

// Layouts
import MainLayout from './components/layout/MainLayout';
import PublicLayout from './components/layout/PublicLayout';

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
import RootDispatcher from './components/specific/Auth/RootDispatcher'; // ▼▼▼ Import

// --- AUTH GUARD (Guest Only) ---
const AuthRoute = ({ children }: { children: React.ReactNode }) => {
    const navigate = useNavigate();
    const { isAuthenticated, isLoading } = useAuth();

    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            navigate('/scanner');
        }
    }, [isAuthenticated, isLoading, navigate]);

    if (isLoading) return null;

    return <>{children}</>;
};

// --- PROTECTED ROUTE (User Only) ---
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <HiRefresh className="animate-spin text-teal-600 mb-4" size={40} />
                <p className="text-gray-400 text-sm font-medium animate-pulse">Initializing Platform...</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/auth/signin" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};

function App() {
    return (
        <BrowserRouter>
            <ProjectProvider>
                <Routes>

                    {/* === PROTECTED APP ROUTES ===
                        Note: We removed path="/" from here.
                        RootDispatcher handles it now.
                    */}
                    <Route element={
                        <ProtectedRoute>
                            <MainLayout />
                        </ProtectedRoute>
                    }>
                        <Route path="/scanner" element={<WebsiteScanner />} />
                        <Route path="/planner" element={<CategoryManagement />} />
                        <Route path="/analysis" element={<KeywordAnalysis />} />
                        <Route path="/google-ads" element={<GoogleAdsManager />} />
                    </Route>

                    {/* === PUBLIC / AUTH ROUTES === */}
                    <Route element={<PublicLayout />}>
                        <Route path="/auth/signin" element={<AuthRoute><SignIn /></AuthRoute>} />
                        <Route path="/auth/signup" element={<AuthRoute><SignUp /></AuthRoute>} />
                        <Route path="/auth/forgot-password" element={<AuthRoute><ForgotPassword /></AuthRoute>} />

                        <Route path="/auth/verify-email" element={<VerifyEmail />} />
                        <Route path="/auth/reset-password" element={<ResetPassword />} />
                    </Route>

                    {/* === ROOT HANDLER ===
                        This sits outside guards to intercept the OAuth Code properly
                    */}
                    <Route path="/" element={<RootDispatcher />} />

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </ProjectProvider>
        </BrowserRouter>
    );
}

export default App;