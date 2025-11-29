import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiCheck } from 'react-icons/hi';
import styles from './WebsiteScanner.module.css';
import { ScannerConfig, ScannerResponse, Category } from '../../../types';
import { useScanner } from '../../../hooks/useScanner';

// Sub-components
import ScannerHero from './components/ScannerHero';
import ScannerConfigForm from './components/ScannerConfigForm';
import ScanStatsPanel from './components/ScanStatsPanel';
import CategoryComponent from '../Category/Category';

interface Props {
    onScanComplete: (categories: Category[]) => void;
}

const WebsiteScanner: React.FC<Props> = ({ onScanComplete }) => {
    const [config, setConfig] = useState<ScannerConfig>({
        start_url: 'https://',
        max_pages: 100,
        max_depth: 2,
        headlines_only: true,
        stay_in_domain: true,
        min_request_delay: 0.5,
    });

    // Validation State
    const [urlError, setUrlError] = useState<string | null>(null);

    // API Hook
    const { mutateAsync: scanWebsite, isPending: isScanning } = useScanner();

    const [scanResult, setScanResult] = useState<ScannerResponse | null>(null);
    const [showStats, setShowStats] = useState(false);

    const validateUrl = (url: string): boolean => {
        if (!url || url === 'https://' || url === 'http://') {
            setUrlError("Please enter a valid website URL");
            return false;
        }
        try {
            new URL(url); // Native browser validation
            setUrlError(null);
            return true;
        } catch (e) {
            setUrlError("Invalid URL format (e.g., https://example.com)");
            return false;
        }
    };

    const handleScan = async () => {
        if (!validateUrl(config.start_url)) return;

        try {
            const response = await scanWebsite(config);
            setScanResult(response);
        } catch (error) {
            // Error is logged by the hook, but we can show a specific UI error here if needed
            // For now, the hook handles console logging.
        }
    };

    const handleAccept = () => {
        if (!scanResult) return;
        const newCategories: Category[] = scanResult.structured_data.map((rawCat, index) => ({
            id: `scan_c_${Date.now()}_${index}`,
            name: rawCat.category_name,
            groups: rawCat.groups.map((rawGrp, gIndex) => ({
                id: `scan_g_${Date.now()}_${index}_${gIndex}`,
                name: rawGrp.group_name,
                keywords: rawGrp.keywords
            }))
        }));

        onScanComplete(newCategories);
    };

    const handleReset = () => {
        // Only clear the result, keeping the previous config/URL for easy editing
        setScanResult(null);
        // We do NOT reset setConfig here anymore.
    };

    // Wrapper to clear error when user types
    const handleConfigChange = (newConfig: ScannerConfig) => {
        if (urlError && newConfig.start_url !== config.start_url) {
            setUrlError(null);
        }
        setConfig(newConfig);
    };

    return (
        <div className={styles.container}>
            <ScannerHero />

            <AnimatePresence mode="wait">
                {!scanResult ? (
                    <motion.div
                        key="config"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="w-full flex justify-center"
                    >
                        <ScannerConfigForm
                            config={config}
                            onConfigChange={handleConfigChange}
                            isScanning={isScanning}
                            onStartScan={handleScan}
                            error={urlError} // Pass validation error
                        />
                    </motion.div>
                ) : (
                    <motion.div
                        key="results"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full"
                    >
                        <div className={styles.resultsHeader}>
                            <h2 className="text-xl font-bold text-gray-800">Extracted Keyword Hierarchy</h2>
                            <button
                                className={styles.statsButton}
                                onClick={() => setShowStats(!showStats)}
                            >
                                {showStats ? 'Hide Metrics' : 'View Crawl Metrics'}
                            </button>
                        </div>

                        <AnimatePresence>
                            {showStats && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <ScanStatsPanel
                                        crawlStats={scanResult.crawl_stats}
                                        llmMetrics={scanResult.llm_metrics}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="space-y-4">
                            {scanResult.structured_data.map((rawCat, i) => {
                                const tempCat: Category = {
                                    id: `preview_c_${i}`,
                                    name: rawCat.category_name,
                                    groups: rawCat.groups.map((g, j) => ({
                                        id: `preview_g_${i}_${j}`,
                                        name: g.group_name,
                                        keywords: g.keywords
                                    }))
                                };

                                return (
                                    <div key={i} className={styles.readOnlyCategory}>
                                        <CategoryComponent
                                            category={tempCat}
                                            initialOpen={false}
                                            selected={false}
                                            onSelect={() => {}}
                                            selectedGroupIds={new Set()}
                                            onGroupSelect={() => {}}
                                            onRemove={() => {}}
                                            onNameSave={() => {}}
                                            onEnrich={() => {}}
                                            onRunAnalysis={() => {}}
                                            onGroupAdd={() => {}}
                                            onGroupRemove={() => {}}
                                            onGroupNameSave={() => {}}
                                            onGroupEnrich={() => {}}
                                            onGroupRunAnalysis={() => {}}
                                            selectedKeywordsByGroup={new Map()}
                                            onKeywordSelect={() => {}}
                                            onKeywordSave={() => {}}
                                            onKeywordCopy={() => {}}
                                            readOnly={true}
                                        />
                                    </div>
                                )
                            })}
                        </div>

                        <div className={styles.acceptActions}>
                            <button className={styles.cancelButton} onClick={handleReset}>
                                Discard & Rescan
                            </button>
                            <button className={styles.acceptButton} onClick={handleAccept}>
                                <HiCheck className="inline mr-1" size={16} />
                                Import Hierarchy
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default WebsiteScanner;