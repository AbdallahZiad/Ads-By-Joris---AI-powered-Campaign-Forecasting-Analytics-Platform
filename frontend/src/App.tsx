import { useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { Category } from './types';
import CategoryManagement from './components/specific/CategoryManagement/CategoryManagement';
import KeywordAnalysis from './components/specific/Analysis/KeywordAnalysis';
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

    const handleRunAnalysis = (
        selection: Category[],
        countryId: string | undefined,
        languageId: string | undefined
    ) => {
        setAnalysisInputs({ selection, countryId, languageId });
        setViewMode('analysis');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleBackToManagement = () => {
        setViewMode('management');
    };

    // Elegant transition variants with fixed types
    const variants: Variants = {
        active: {
            opacity: 1,
            y: 0,
            scale: 1,
            display: 'block',
            transition: {
                duration: 0.4,
                ease: [0.2, 0, 0.2, 1] as const,
                delay: 0.1
            }
        },
        inactive: {
            opacity: 0,
            y: 10,
            scale: 0.98,
            transition: {
                duration: 0.3,
                ease: [0.4, 0, 1, 1] as const
            },
            transitionEnd: {
                display: 'none'
            }
        }
    };

    return (
        <div className="min-h-screen main-container">
            <div className="grid grid-cols-1 grid-rows-1 items-start">

                {/* VIEW 1: Category Management (Always Mounted) */}
                <motion.div
                    className="col-start-1 row-start-1 w-full"
                    initial="active"
                    animate={viewMode === 'management' ? 'active' : 'inactive'}
                    variants={variants}
                    style={{ pointerEvents: viewMode === 'management' ? 'auto' : 'none', zIndex: viewMode === 'management' ? 1 : 0 }}
                >
                    <div className="max-w-5xl mx-auto p-6">
                        <h1 className="text-2xl font-bold text-gray-800 mb-6">
                            Keyword Strategy Planner
                        </h1>
                        <CategoryManagement onRunAnalysis={handleRunAnalysis} />
                    </div>
                </motion.div>

                {/* VIEW 2: Keyword Analysis (Mounted when data is ready) */}
                {analysisInputs && (
                    <motion.div
                        className="col-start-1 row-start-1 w-full"
                        initial="inactive"
                        animate={viewMode === 'analysis' ? 'active' : 'inactive'}
                        variants={variants}
                        style={{ pointerEvents: viewMode === 'analysis' ? 'auto' : 'none', zIndex: viewMode === 'analysis' ? 1 : 0 }}
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
        </div>
    );
}

export default App;