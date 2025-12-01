import { useState, useRef, useEffect } from 'react';
import { motion, Variants } from 'framer-motion';
import { Category } from './types';
import CategoryManagement from './components/specific/CategoryManagement/CategoryManagement';
import KeywordAnalysis from './components/specific/Analysis/KeywordAnalysis';
import WebsiteScanner from './components/specific/WebsiteScanner/WebsiteScanner';
import Navbar from './components/common/Navbar/Navbar';
import Sidebar from './components/common/Sidebar/Sidebar';
import './index.css';

// Auth Components
import SignIn from './components/specific/Auth/SignIn';
import SignUp from './components/specific/Auth/SignUp';
import ForgotPassword from './components/specific/Auth/ForgotPassword';
import VerifyEmail from './components/specific/Auth/VerifyEmail';
import ResetPassword from './components/specific/Auth/ResetPassword';
import { useAuth } from './contexts/AuthContext';

type ViewMode = 'management' | 'analysis' | 'scanner';
type AuthView = 'none' | 'signin' | 'signup' | 'forgot-password' | 'verify-email' | 'reset-password';

interface AnalysisInputs {
    selection: Category[];
    countryId?: string;
    languageId?: string;
}

function App() {
    const [viewMode, setViewMode] = useState<ViewMode>('scanner');
    const [authView, setAuthView] = useState<AuthView>('none');

    // Auth URL Parameter Handling
    const [urlToken, setUrlToken] = useState<string>('');

    const [analysisInputs, setAnalysisInputs] = useState<AnalysisInputs | null>(null);
    const [importedCategories, setImportedCategories] = useState<Category[]>([]);

    const [hasScannedData, setHasScannedData] = useState(false);
    const [hasAnalysisData, setHasAnalysisData] = useState(false);

    const mainContentRef = useRef<HTMLElement>(null);
    const { isAuthenticated, isLoading: isAuthLoading } = useAuth();

    // --- DEEP LINK HANDLER ---
    useEffect(() => {
        const path = window.location.pathname;
        const params = new URLSearchParams(window.location.search);

        const verifyToken = params.get('token'); // from verify email link
        const resetToken = params.get('token'); // from password reset (usually same param name)
        // Note: Logic below assumes path differentiates them, or backend uses unique params.
        // Based on previous instructions, path differentiates.

        const googleCode = params.get('code'); // ▼▼▼ FROM GOOGLE REDIRECT

        // 1. Google Auth Redirect
        if (googleCode) {
            // We must open the SignIn view so it can process the code
            setAuthView('signin');
            // We do NOT clean the URL here; SignIn.tsx needs to read it first.
        }
        // 2. Email Verification Link
        else if (path === '/verify-email' && verifyToken) {
            setUrlToken(verifyToken);
            setAuthView('verify-email');
            window.history.replaceState({}, document.title, "/");
        }
        // 3. Password Reset Link
        else if (path === '/reset-password' && resetToken) {
            setUrlToken(resetToken);
            setAuthView('reset-password');
            window.history.replaceState({}, document.title, "/");
        }
    }, []);

    const handleRunAnalysis = (
        selection: Category[],
        countryId: string | undefined,
        languageId: string | undefined
    ) => {
        setAnalysisInputs({ selection, countryId, languageId });
        setHasAnalysisData(true);
        setViewMode('analysis');
        if (mainContentRef.current) mainContentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleBackToManagement = () => {
        setViewMode('management');
        if (mainContentRef.current) mainContentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleScanComplete = (newCategories: Category[]) => {
        setImportedCategories(newCategories);
        setHasScannedData(true);
        setHasAnalysisData(false);
        setAnalysisInputs(null);

        setViewMode('management');
        if (mainContentRef.current) mainContentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleNavChange = (mode: ViewMode) => {
        if (mode === 'management' && !hasScannedData) return;
        if (mode === 'analysis' && !hasAnalysisData) return;

        setViewMode(mode);
        if (mainContentRef.current) mainContentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }

    const variants: Variants = {
        active: { opacity: 1, y: 0, scale: 1, display: 'block', transition: { duration: 0.4, ease: [0.2, 0, 0.2, 1] as const, delay: 0.1 } },
        inactive: { opacity: 0, y: 10, scale: 0.98, transition: { duration: 0.3, ease: [0.4, 0, 1, 1] as const }, transitionEnd: { display: 'none' } }
    };

    useEffect(() => {
        if (isAuthenticated && authView !== 'none') {
            setAuthView('none');
        }
    }, [isAuthenticated]);

    if (isAuthLoading) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-400">Loading...</div>;
    }

    return (
        <div className="min-h-screen main-container">
            <Navbar />

            <div className="flex flex-1 overflow-hidden relative">
                <Sidebar
                    viewMode={viewMode}
                    onNavigate={handleNavChange}
                    hasScannedData={hasScannedData}
                    hasAnalysisData={hasAnalysisData}
                    onAuthClick={() => setAuthView('signin')}
                />

                <main ref={mainContentRef} className="flex-1 overflow-y-auto ml-16 bg-gray-100 relative">
                    {/* AUTH OVERLAY */}
                    {authView !== 'none' && (
                        <div className="absolute inset-0 z-50 bg-gray-100">
                            {authView === 'signin' && <SignIn onNavigate={(v) => setAuthView(v)} />}
                            {authView === 'signup' && <SignUp onNavigate={(v) => setAuthView(v)} />}
                            {authView === 'forgot-password' && <ForgotPassword onNavigate={(v) => setAuthView(v)} />}
                            {authView === 'verify-email' && <VerifyEmail token={urlToken} />}
                            {authView === 'reset-password' && <ResetPassword token={urlToken} onNavigate={(v) => setAuthView(v)} />}

                            {/* Close Button (Hidden for critical flows) */}
                            {authView !== 'verify-email' && authView !== 'reset-password' && (
                                <button
                                    onClick={() => setAuthView('none')}
                                    className="absolute top-6 right-6 text-gray-400 hover:text-gray-600"
                                >
                                    ✕ Close
                                </button>
                            )}
                        </div>
                    )}

                    <div className={`grid grid-cols-1 grid-rows-1 items-start ${authView !== 'none' ? 'hidden' : ''}`}>

                        {/* VIEW 1: Category Management */}
                        <motion.div
                            className="col-start-1 row-start-1 w-full"
                            initial="inactive"
                            animate={viewMode === 'management' ? 'active' : 'inactive'}
                            variants={variants}
                            style={{ pointerEvents: viewMode === 'management' ? 'auto' : 'none', zIndex: viewMode === 'management' ? 1 : 0 }}
                        >
                            <CategoryManagement
                                onRunAnalysis={handleRunAnalysis}
                                mainContentRef={mainContentRef}
                                initialImportedCategories={importedCategories}
                            />
                        </motion.div>

                        {/* VIEW 2: Keyword Analysis */}
                        {analysisInputs && (
                            <motion.div
                                className="col-start-1 row-start-1 w-full"
                                initial="inactive"
                                animate={viewMode === 'analysis' ? 'active' : 'inactive'}
                                variants={variants}
                                style={{ pointerEvents: viewMode === 'analysis' ? 'auto' : 'none', zIndex: viewMode === 'analysis' ? 20 : 0 }}
                            >
                                <KeywordAnalysis
                                    selection={analysisInputs.selection}
                                    countryId={analysisInputs.countryId}
                                    languageId={analysisInputs.languageId}
                                    onBack={handleBackToManagement}
                                />
                            </motion.div>
                        )}

                        {/* VIEW 3: Website Scanner */}
                        <motion.div
                            className="col-start-1 row-start-1 w-full"
                            initial="active"
                            animate={viewMode === 'scanner' ? 'active' : 'inactive'}
                            variants={variants}
                            style={{ pointerEvents: viewMode === 'scanner' ? 'auto' : 'none', zIndex: viewMode === 'scanner' ? 10 : 0 }}
                        >
                            <WebsiteScanner onScanComplete={handleScanComplete} />
                        </motion.div>

                    </div>
                </main>
            </div>
        </div>
    );
}

export default App;