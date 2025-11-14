import { useState, useRef } from 'react';
import { motion, Variants } from 'framer-motion';
import { Category } from './types';
import CategoryManagement from './components/specific/CategoryManagement/CategoryManagement';
import KeywordAnalysis from './components/specific/Analysis/KeywordAnalysis';
import Navbar from './components/common/Navbar/Navbar';
import Sidebar from './components/common/Sidebar/Sidebar';
import './index.css';

type ViewMode = 'management' | 'analysis';

// Store all analysis inputs together
interface AnalysisInputs {
    selection: Category[];
    countryId?: string;
    languageId?: string;
}

function App() {
    const [viewMode, setViewMode] = useState<ViewMode>('management');
    const [analysisInputs, setAnalysisInputs] = useState<AnalysisInputs | null>(null);
    const mainContentRef = useRef<HTMLElement>(null);

    const handleRunAnalysis = (
        selection: Category[],
        countryId: string | undefined,
        languageId: string | undefined
    ) => {
        setAnalysisInputs({ selection, countryId, languageId });
        setViewMode('analysis');

        if (mainContentRef.current) {
            mainContentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleBackToManagement = () => {
        setViewMode('management');
        if (mainContentRef.current) {
            mainContentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // Elegant transition variants with fixed types
    const variants: Variants = {
        active: {
            opacity: 1,
            display: 'block',
            transition: {
                duration: 0.3,
                ease: 'easeInOut',
            }
        },
        inactive: {
            opacity: 0,
            transition: {
                duration: 0.3,
                ease: 'easeInOut'
            },
            transitionEnd: {
                display: 'none'
            }
        }
    };

    return (
        <div className="min-h-screen main-container">
            <Navbar />

            <div className="flex flex-1 overflow-hidden">
                <Sidebar viewMode={viewMode} />

                <main ref={mainContentRef} className="flex-1 overflow-y-auto ml-16 bg-gray-100">
                    <div className="grid grid-cols-1 grid-rows-1 items-start">
                        {/* VIEW 1: Category Management (Always Mounted) */}
                        <motion.div
                            className="col-start-1 row-start-1 w-full"
                            initial="active"
                            animate={viewMode === 'management' ? 'active' : 'inactive'}
                            variants={variants}
                            style={{
                                pointerEvents: viewMode === 'management' ? 'auto' : 'none',
                                zIndex: viewMode === 'management' ? 1 : 0
                            }}
                        >
                            <CategoryManagement
                                onRunAnalysis={handleRunAnalysis}
                                mainContentRef={mainContentRef}
                            />
                        </motion.div>

                        {/* VIEW 2: Keyword Analysis (Mounted when data is ready) */}
                        {analysisInputs && (
                            <motion.div
                                className="col-start-1 row-start-1 w-full"
                                initial="inactive"
                                animate={viewMode === 'analysis' ? 'active' : 'inactive'}
                                variants={variants}
                                style={{
                                    pointerEvents: viewMode === 'analysis' ? 'auto' : 'none',
                                    zIndex: viewMode === 'analysis' ? 20 : 0
                                }}
                            >
                                <KeywordAnalysis
                                    selection={analysisInputs.selection}
                                    countryId={analysisInputs.countryId}
                                    languageId={analysisInputs.languageId}
                                    onBack={handleBackToManagement}
                                />
                            </motion.div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}

export default App;