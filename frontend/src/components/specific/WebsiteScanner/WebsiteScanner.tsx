import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiCheck } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import styles from './WebsiteScanner.module.css';
import { ScannerConfig, ScannerResponse, Category } from '../../../types';
import { useScanner } from '../../../hooks/useScanner';
import { useProject } from '../../../contexts/ProjectContext';

import ScannerHero from './components/ScannerHero';
import ScannerConfigForm from './components/ScannerConfigForm';
import ScanStatsPanel from './components/ScanStatsPanel';
import CategoryComponent from '../Category/Category';
import PageLayout from '../../common/PageLayout/PageLayout';

const WebsiteScanner: React.FC = () => {
    const navigate = useNavigate();
    const { setImportedCategories } = useProject();

    const [config, setConfig] = useState<ScannerConfig>({
        start_url: '',
        max_pages: 100,
        max_depth: 2,
        headlines_only: true,
        stay_in_domain: true,
        min_request_delay: 0.5,
    });

    const [urlError, setUrlError] = useState<string | null>(null);
    const { mutateAsync: scanWebsite, isPending: isScanning } = useScanner();
    const [scanResult, setScanResult] = useState<ScannerResponse | null>(null);
    const [showStats, setShowStats] = useState(false);

    // Helper to normalize URL (auto-prepend https)
    const normalizeUrl = (input: string): string => {
        let url = input.trim();
        if (url && !/^https?:\/\//i.test(url)) {
            url = 'https://' + url;
        }
        return url;
    };

    // ▼▼▼ IMPROVED: Strict Validity Check ▼▼▼
    const checkUrlValidity = (input: string): boolean => {
        if (!input) return false;
        try {
            const urlStr = normalizeUrl(input);
            const url = new URL(urlStr);

            // 1. Must contain a hostname
            if (!url.hostname) return false;

            // 2. STRICT CHECK: Must have a TLD (contain a dot) OR be localhost
            // This blocks "test", "mysite", etc., but allows "google.com" or "localhost"
            if (url.hostname !== 'localhost' && !url.hostname.includes('.')) {
                return false;
            }

            // 3. Basic TLD check (last part must be at least 2 chars)
            // e.g. prevents "google.c" if user stopped typing
            const parts = url.hostname.split('.');
            if (parts.length > 1 && parts[parts.length - 1].length < 2) {
                return false;
            }

            return true;
        } catch (e) {
            return false;
        }
    };

    const handleScan = async () => {
        const urlToScan = normalizeUrl(config.start_url);

        // Run the strict check before proceeding
        if (!checkUrlValidity(config.start_url)) {
            setUrlError("Please enter a valid domain (e.g. example.com)");
            return;
        } else {
            setUrlError(null);
        }

        try {
            const effectiveConfig = { ...config, start_url: urlToScan };
            const response = await scanWebsite(effectiveConfig);
            setScanResult(response);
        } catch (error) {
            console.error(error);
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

        setImportedCategories(newCategories);
        navigate('/planner');
    };

    const handleReset = () => {
        setScanResult(null);
    };

    const handleConfigChange = (newConfig: ScannerConfig) => {
        // Clear error as user types to be friendly
        if (urlError && newConfig.start_url !== config.start_url) {
            setUrlError(null);
        }
        setConfig(newConfig);
    };

    const isUrlValid = checkUrlValidity(config.start_url);

    return (
        <PageLayout>
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
                                error={urlError}
                                isValid={isUrlValid}
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
        </PageLayout>
    );
};

export default WebsiteScanner;