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
        <AnimatePresence>
            {totalSelections > 0 && (
                <motion.div
                    className={styles.contextualFooter}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                >
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
                        Clear Selections
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ContextualFooter;