import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiCheck } from 'react-icons/hi';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import styles from './WebsiteScanner.module.css';
import { ScannerConfig, ScannerResponse, Category, CreateProjectTreePayload } from '../../../types';
import { useScanner } from '../../../hooks/useScanner';
import { useProject } from '../../../contexts/ProjectContext';
import { projectService } from '../../../api/services/projectService';

import ScannerHero from './components/ScannerHero';
import ScannerConfigForm from './components/ScannerConfigForm';
import ScanStatsPanel from './components/ScanStatsPanel';
import CategoryComponent from '../Category/Category';
import PageLayout from '../../common/PageLayout/PageLayout';

const WebsiteScanner: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const queryClient = useQueryClient();
    const { setCurrentProjectId } = useProject();

    // Check if we are here to replace an empty project
    const replaceProjectId = location.state?.replaceProjectId;
    const replaceProjectTitle = location.state?.replaceProjectTitle; // ▼▼▼ GET TITLE

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

    // Mutation for saving the project
    const saveProjectMutation = useMutation({
        mutationFn: projectService.createProjectTree,
        onSuccess: async (newProject) => {
            // 1. If we are replacing an old empty project, delete it now
            if (replaceProjectId) {
                try {
                    await projectService.deleteProject(replaceProjectId);
                } catch (e) {
                    console.warn("Failed to clean up old project during replacement", e);
                }
            }

            await queryClient.invalidateQueries({ queryKey: ['projects-list'] });
            setCurrentProjectId(newProject.id);
            navigate('/planner');
        },
        onError: (err) => {
            console.error("Failed to save project tree", err);
            alert("Failed to save project. Please try again.");
        }
    });

    const normalizeUrl = (input: string): string => {
        let url = input.trim();
        if (url && !/^https?:\/\//i.test(url)) {
            url = 'https://' + url;
        }
        return url;
    };

    const checkUrlValidity = (input: string): boolean => {
        if (!input) return false;
        try {
            const urlStr = normalizeUrl(input);
            const url = new URL(urlStr);
            if (!url.hostname) return false;
            if (url.hostname !== 'localhost' && !url.hostname.includes('.')) return false;
            const parts = url.hostname.split('.');
            if (parts.length > 1 && parts[parts.length - 1].length < 2) return false;
            return true;
        } catch (e) {
            return false;
        }
    };

    const handleScan = async () => {
        const urlToScan = normalizeUrl(config.start_url);
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

        let projectTitle = replaceProjectTitle;

        // Only generate new title if we aren't replacing an existing one
        if (!projectTitle) {
            let titleDomain = config.start_url.replace(/^https?:\/\//, '').replace(/^www\./, '');
            if (titleDomain.includes('/')) titleDomain = titleDomain.split('/')[0];
            const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            projectTitle = `${titleDomain} Scan (${dateStr})`;
        }

        const payload: CreateProjectTreePayload = {
            title: projectTitle,
            categories: scanResult.structured_data.map(c => ({
                name: c.category_name,
                groups: c.groups.map(g => ({
                    name: g.group_name,
                    keywords: g.keywords
                }))
            }))
        };

        saveProjectMutation.mutate(payload);
    };

    const handleReset = () => {
        setScanResult(null);
    };

    const handleConfigChange = (newConfig: ScannerConfig) => {
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
                                            keywords: g.keywords.map((k, kIdx) => ({
                                                id: `preview_k_${i}_${j}_${kIdx}`,
                                                text: k
                                            }))
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
                                <button
                                    className={styles.acceptButton}
                                    onClick={handleAccept}
                                    disabled={saveProjectMutation.isPending}
                                >
                                    {saveProjectMutation.isPending ? (
                                        <span className="animate-pulse">Saving Project...</span>
                                    ) : (
                                        <>
                                            <HiCheck className="inline mr-1" size={16} />
                                            Import Hierarchy
                                        </>
                                    )}
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