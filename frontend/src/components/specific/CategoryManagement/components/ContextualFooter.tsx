import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from '../CategoryManagement.module.css';

interface Props {
    totalSelections: number;
    onEnrich: () => void;
    onRunAnalysis: () => void;
    onSelectAll: () => void;
    onClear: () => void;
}

const ContextualFooter: React.FC<Props> = ({
                                               totalSelections,
                                               onEnrich,
                                               onRunAnalysis,
                                               onSelectAll,
                                               onClear
                                           }) => {
    return (
        <div className={styles.footerContainer}>
            <AnimatePresence>
                {totalSelections > 0 && (
                    <motion.div
                        className={styles.footerContent}
                        initial={{ opacity: 0, y: 30, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 30, scale: 0.95 }}
                        transition={{
                            type: 'spring',
                            stiffness: 400,
                            damping: 30,
                            mass: 0.8
                        }}
                    >
                        <div className="flex items-center gap-3">
                            <button className={styles.actionButton} onClick={onEnrich}>
                                Enrich Selected
                            </button>
                            <button className={styles.actionButton} onClick={onRunAnalysis}>
                                Run Analysis
                            </button>
                            <button className={styles.secondaryButton} onClick={onSelectAll}>
                                Select All
                            </button>
                            <button className={styles.secondaryButton} onClick={onClear}>
                                Clear
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ContextualFooter;