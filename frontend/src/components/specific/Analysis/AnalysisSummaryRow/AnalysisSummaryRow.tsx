import React from 'react';
import { HiOutlineFolder, HiOutlineCollection } from 'react-icons/hi';
import { AggregatedStats } from '../../../../types';
import { formatNumber, formatCurrency, formatMultiplier } from '../../../../utils/format';
import styles from './AnalysisSummaryRow.module.css';

interface Props {
    stats: AggregatedStats;
    isSelected: boolean;
    selectionColor?: string;
    onRowClick: (id: string) => void;
    onToggleSelection: (id: string, type: 'CATEGORY' | 'GROUP', isSelected: boolean) => void;
}

const AnalysisSummaryRow: React.FC<Props> = ({ stats, isSelected, selectionColor, onRowClick, onToggleSelection }) => {

    const Icon = stats.type === 'CATEGORY' ? HiOutlineFolder : HiOutlineCollection;
    const isDisabled = stats.validItemCount === 0;

    const dynamicStyle = isSelected && selectionColor ? {
        borderColor: selectionColor,
        boxShadow: `0 0 0 1px ${selectionColor}`,
        backgroundColor: '#fcfcfc'
    } : undefined;

    const handleCheckboxClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Stop row click
        if (!isDisabled) {
            onToggleSelection(stats.id, stats.type, !isSelected);
        }
    };

    return (
        <div
            className={`
                ${styles.rowContainer} 
                ${isSelected && !selectionColor ? 'bg-indigo-50 border-indigo-200 ring-1 ring-indigo-300' : ''}
                ${isDisabled ? styles.disabled : ''}
            `}
            style={dynamicStyle}
            onClick={!isDisabled ? () => onRowClick(stats.id) : undefined}
        >
            {/* Expanded Checkbox Zone */}
            <div className={styles.checkboxWrapper} onClick={handleCheckboxClick}>
                <input
                    type="checkbox"
                    className={styles.checkbox}
                    checked={isSelected}
                    disabled={isDisabled}
                    onChange={() => {}} // handled by wrapper click
                    title={isDisabled ? "No data available for charting" : `Add ${stats.type.toLowerCase()} to chart`}
                    style={isSelected && selectionColor ? {
                        backgroundColor: selectionColor,
                        borderColor: selectionColor
                    } : undefined}
                />
            </div>

            {/* 1. Icon */}
            <div className={styles.iconWrapper}>
                <Icon size={20} />
            </div>

            {/* 2. Name */}
            <div className={styles.nameCol}>
                <span className={styles.nameText}>{stats.name}</span>
                <span className={styles.subText}>
                    {stats.itemCount} keyword{stats.itemCount !== 1 ? 's' : ''}
                    {stats.validItemCount !== stats.itemCount && (
                        <span className="text-xs text-orange-400 ml-1">
                            ({stats.itemCount - stats.validItemCount} empty)
                        </span>
                    )}
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
                <span className={styles.statLabel} style={{ color: '#818cf8' }}>Cur Vol</span>
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

export default React.memo(AnalysisSummaryRow);