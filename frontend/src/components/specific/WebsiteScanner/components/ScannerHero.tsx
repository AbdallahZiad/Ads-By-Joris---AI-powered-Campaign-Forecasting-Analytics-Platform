import React from 'react';
import { HiCube, HiLightningBolt, HiTemplate } from 'react-icons/hi';
import styles from './ScannerHero.module.css';

const ScannerHero: React.FC = () => {
    return (
        <div className={styles.heroSection}>
            <h1 className={styles.title}>AI Website Scanner</h1>

            <div className={styles.featurePills}>
                <div className={styles.pill}>
                    <HiLightningBolt className="text-teal-500" />
                    <span>Instant Extraction</span>
                </div>
                <div className={styles.separator} />
                <div className={styles.pill}>
                    <HiTemplate className="text-teal-500" />
                    <span>Smart Categorization</span>
                </div>
                <div className={styles.separator} />
                <div className={styles.pill}>
                    <HiCube className="text-teal-500" />
                    <span>Structured Output</span>
                </div>
            </div>
        </div>
    );
};

export default ScannerHero;