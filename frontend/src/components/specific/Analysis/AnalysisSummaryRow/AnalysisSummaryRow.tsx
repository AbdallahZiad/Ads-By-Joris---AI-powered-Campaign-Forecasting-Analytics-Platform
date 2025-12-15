import React from 'react';
import { HiChevronRight, HiOutlineFolder, HiOutlineCollection } from 'react-icons/hi';
import { AggregatedStats } from '../../../../types';
import { formatNumber, formatCurrency, formatMultiplier } from '../../../../utils/format';
import styles from './AnalysisSummaryRow.module.css';

interface Props {
    stats: AggregatedStats;
    onClick: () => void;
}

const AnalysisSummaryRow: React.FC<Props> = ({ stats, onClick }) => {

    // Icon based on type
    const Icon = stats.type === 'CATEGORY' ? HiOutlineFolder : HiOutlineCollection;

    return (
        <div className={styles.rowContainer} onClick={onClick}>
            {/* Icon */}
            <div className={styles.iconWrapper}>
                <Icon size={20} />
            </div>

            {/* Name & Count */}
            <div className={styles.nameCol}>
                <span className={styles.nameText}>{stats.name}</span>
                <span className={styles.subText}>
                    {stats.itemCount} keyword{stats.itemCount !== 1 ? 's' : ''} inside
                </span>
            </div>

            {/* Total Volume */}
            <div className={styles.statCol}>
                {formatNumber(stats.totalVolume)}
                <div className="text-[10px] text-gray-400 font-normal uppercase">Total Vol</div>
            </div>

            {/* Avg CPC */}
            <div className={styles.statCol}>
                {formatCurrency(stats.avgCpc)}
                <div className="text-[10px] text-gray-400 font-normal uppercase">Avg CPC</div>
            </div>

            {/* Avg Comp */}
            <div className={styles.statCol}>
                {stats.avgCompetition.toFixed(1)} / 100
                <div className="text-[10px] text-gray-400 font-normal uppercase">Competition</div>
            </div>

            {/* Max Growth */}
            <div className={`${styles.statCol} ${stats.maxGrowth > 0 ? styles.growthPositive : styles.growthNegative}`}>
                {formatMultiplier(stats.maxGrowth)}
                <div className="text-[10px] text-gray-400 font-normal uppercase">Top Trend</div>
            </div>

            {/* Action */}
            <div className={styles.actionCol}>
                <HiChevronRight size={20} />
            </div>
        </div>
    );
};

export default AnalysisSummaryRow;