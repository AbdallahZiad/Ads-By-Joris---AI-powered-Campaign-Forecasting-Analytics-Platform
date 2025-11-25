import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineSearch, HiOutlineChevronDown, HiOutlineChevronRight } from 'react-icons/hi';
import styles from './ScannerConfigForm.module.css';
import { ScannerConfig } from '../../../../types';
import ProportionalCheckbox from '../../../common/ProportionalCheckbox/ProportionalCheckbox';

interface Props {
    config: ScannerConfig;
    onConfigChange: (newConfig: ScannerConfig) => void;
    isScanning: boolean;
    onStartScan: () => void;
}

const ScannerConfigForm: React.FC<Props> = ({ config, onConfigChange, isScanning, onStartScan }) => {
    const [showAdvanced, setShowAdvanced] = useState(false);

    return (
        <div className="relative">
            {/* Loading Overlay */}
            {isScanning && (
                <div className="absolute inset-0 z-20 rounded-xl overflow-hidden">
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm">
                        <div className="flex flex-col items-center gap-4 text-teal-600 bg-white p-8 rounded-2xl shadow-2xl border border-teal-50">
                             <span className="relative flex h-4 w-4">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-4 w-4 bg-teal-500"></span>
                             </span>
                            <div className="text-center">
                                <span className="text-lg font-semibold block mb-1">Processing Site Content</span>
                                <span className="text-sm text-gray-400">Crawling, extracting text & grouping keywords...</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className={styles.configCard}>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Target Website</label>
                    <div className={styles.inputWrapper}>
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                            <HiOutlineSearch className="text-gray-400" size={20} />
                        </div>
                        <input
                            type="text"
                            className={styles.mainInput}
                            placeholder="https://www.example.com"
                            value={config.start_url}
                            onChange={(e) => onConfigChange({ ...config, start_url: e.target.value })}
                            disabled={isScanning}
                        />
                    </div>
                </div>

                <div className={styles.gridRow}>
                    <div className="space-y-1">
                        <label className={styles.label}>Max Pages</label>
                        <input
                            type="number"
                            className={styles.numberInput}
                            value={config.max_pages}
                            onChange={(e) => onConfigChange({ ...config, max_pages: Number(e.target.value) })}
                            disabled={isScanning}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className={styles.label}>Crawl Depth</label>
                        <input
                            type="number"
                            className={styles.numberInput}
                            value={config.max_depth}
                            onChange={(e) => onConfigChange({ ...config, max_depth: Number(e.target.value) })}
                            disabled={isScanning}
                        />
                    </div>

                    <div className="flex items-end">
                        <ProportionalCheckbox
                            label="Headlines Only (H1-H6)"
                            checked={config.headlines_only}
                            onChange={(checked) => onConfigChange({...config, headlines_only: checked})}
                            disabled={isScanning}
                        />
                    </div>
                </div>

                <div
                    className={styles.advancedToggle}
                    onClick={() => setShowAdvanced(!showAdvanced)}
                >
                    {showAdvanced ? <HiOutlineChevronDown className="mr-1"/> : <HiOutlineChevronRight className="mr-1"/>}
                    Advanced Configuration
                </div>

                <AnimatePresence>
                    {showAdvanced && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                                <div className="space-y-1">
                                    <label className={styles.label}>Min Request Delay (sec)</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        className={styles.numberInput}
                                        value={config.min_request_delay}
                                        onChange={(e) => onConfigChange({ ...config, min_request_delay: Number(e.target.value) })}
                                        disabled={isScanning}
                                    />
                                </div>

                                <div>
                                    <ProportionalCheckbox
                                        label="Stay in Domain"
                                        checked={config.stay_in_domain}
                                        onChange={(checked) => onConfigChange({...config, stay_in_domain: checked})}
                                        disabled={isScanning}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <button
                    className={styles.scanButton}
                    onClick={onStartScan}
                    disabled={isScanning || !config.start_url}
                >
                    {isScanning ? 'Initializing Agents...' : 'Start Intelligence Scan'}
                </button>
            </div>
        </div>
    );
};

export default ScannerConfigForm;