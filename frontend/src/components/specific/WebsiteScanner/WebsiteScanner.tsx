import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiCheck } from 'react-icons/hi';
import styles from './WebsiteScanner.module.css';
import { ScannerConfig, ScannerResponse, Category } from '../../../types';
import { mockApi } from '../../../api/mockApi';

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

    const [isScanning, setIsScanning] = useState(false);
    const [scanResult, setScanResult] = useState<ScannerResponse | null>(null);
    const [showStats, setShowStats] = useState(false);

    const handleScan = async () => {
        setIsScanning(true);
        try {
            const response = await mockApi.scanWebsite(config);
            setScanResult(response);
        } catch (error) {
            console.error("Scan failed:", error);
            alert("Scan failed. Please try again.");
        } finally {
            setIsScanning(false);
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
        setScanResult(null);
        setConfig({ ...config, start_url: 'https://' });
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
                            onConfigChange={setConfig}
                            isScanning={isScanning}
                            onStartScan={handleScan}
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
                                // Create temp category for preview
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