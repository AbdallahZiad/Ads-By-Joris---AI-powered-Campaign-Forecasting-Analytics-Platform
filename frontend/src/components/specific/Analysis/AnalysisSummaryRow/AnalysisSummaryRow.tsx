import React from 'react';
import { HiOutlineFolder, HiOutlineCollection } from 'react-icons/hi'; // ▼▼▼ FIX: Removed HiChevronRight
import { AggregatedStats } from '../../../../types';
import { formatNumber, formatCurrency, formatMultiplier } from '../../../../utils/format';
import styles from './AnalysisSummaryRow.module.css';

interface Props {
    stats: AggregatedStats;
    onClick: () => void;
}

const AnalysisSummaryRow: React.FC<Props> = ({ stats, onClick }) => {

    const Icon = stats.type === 'CATEGORY' ? HiOutlineFolder : HiOutlineCollection;

    return (
        <div className={styles.rowContainer} onClick={onClick}>
            {/* 1. Icon */}
            <div className={styles.iconWrapper}>
                <Icon size={20} />
            </div>

            {/* 2. Name */}
            <div className={styles.nameCol}>
                <span className={styles.nameText}>{stats.name}</span>
                <span className={styles.subText}>
                    {stats.itemCount} keyword{stats.itemCount !== 1 ? 's' : ''}
                </span>
            </div>

            {/* 3. Avg. Vol */}
            <div className={styles.statCol}>
                {formatNumber(stats.totalVolume)}
                <span className={styles.statLabel}>Avg Vol</span>
            </div>

            {/* 4. Comp */}
            <div className={styles.statCol}>
                {stats.avgCompetition.toFixed(1)}
                <span className={styles.statLabel}>Comp</span>
            </div>

            {/* 5. CPC */}
            <div className={styles.statCol}>
                {formatCurrency(stats.avgCpc)}
                <span className={styles.statLabel}>CPC</span>
            </div>

            {/* 6. Cur. Vol (Forecast) */}
            <div className={`${styles.statCol} ${styles.forecastStart}`}>
                {formatNumber(stats.forecastCurrent)}
                <span className={styles.statLabel}>Cur Vol</span>
            </div>

            {/* 7. YoY */}
            <div className={styles.forecastCol}>
                {formatMultiplier(stats.forecastYoY)}
                <span className={styles.statLabel}>YoY</span>
            </div>

            {/* 8. +1M */}
            <div className={styles.forecastCol}>
                {formatMultiplier(stats.forecast1M)}
                <span className={styles.statLabel}>+1 M</span>
            </div>

            {/* 9. +3M */}
            <div className={styles.forecastCol}>
                {formatMultiplier(stats.forecast3M)}
                <span className={styles.statLabel}>+3 M</span>
            </div>

            {/* 10. +6M */}
            <div className={styles.forecastCol}>
                {formatMultiplier(stats.forecast6M)}
                <span className={styles.statLabel}>+6 M</span>
            </div>
        </div>
    );
};

export default AnalysisSummaryRow;