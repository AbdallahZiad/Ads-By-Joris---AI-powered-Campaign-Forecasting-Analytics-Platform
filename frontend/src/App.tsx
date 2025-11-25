import { useState, useRef } from 'react';
import { motion, Variants } from 'framer-motion';
import { Category } from './types';
import CategoryManagement from './components/specific/CategoryManagement/CategoryManagement';
import KeywordAnalysis from './components/specific/Analysis/KeywordAnalysis';
import WebsiteScanner from './components/specific/WebsiteScanner/WebsiteScanner';
import Navbar from './components/common/Navbar/Navbar';
import Sidebar from './components/common/Sidebar/Sidebar';
import './index.css';

type ViewMode = 'management' | 'analysis' | 'scanner';

interface AnalysisInputs {
    selection: Category[];
    countryId?: string;
    languageId?: string;
}

function App() {
    const [viewMode, setViewMode] = useState<ViewMode>('scanner'); // Start at scanner
    const [analysisInputs, setAnalysisInputs] = useState<AnalysisInputs | null>(null);
    const [importedCategories, setImportedCategories] = useState<Category[]>([]);

    // Flow Control States
    const [hasScannedData, setHasScannedData] = useState(false);
    const [hasAnalysisData, setHasAnalysisData] = useState(false);

    const mainContentRef = useRef<HTMLElement>(null);

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
        // Reset analysis when new data comes in to ensure consistency
        setHasAnalysisData(false);
        setAnalysisInputs(null);

        setViewMode('management');
        if (mainContentRef.current) mainContentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleNavChange = (mode: ViewMode) => {
        // Strict Flow Control
        if (mode === 'management' && !hasScannedData) return;
        if (mode === 'analysis' && !hasAnalysisData) return;

        setViewMode(mode);
        if (mainContentRef.current) mainContentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }

    const variants: Variants = {
        active: { opacity: 1, y: 0, scale: 1, display: 'block', transition: { duration: 0.4, ease: [0.2, 0, 0.2, 1] as const, delay: 0.1 } },
        inactive: { opacity: 0, y: 10, scale: 0.98, transition: { duration: 0.3, ease: [0.4, 0, 1, 1] as const }, transitionEnd: { display: 'none' } }
    };

    return (
        <div className="min-h-screen main-container">
            <Navbar />

            <div className="flex flex-1 overflow-hidden">
                <Sidebar
                    viewMode={viewMode}
                    onNavigate={handleNavChange}
                    hasScannedData={hasScannedData}
                    hasAnalysisData={hasAnalysisData}
                />

                <main ref={mainContentRef} className="flex-1 overflow-y-auto ml-16 bg-gray-100">
                    <div className="grid grid-cols-1 grid-rows-1 items-start">

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