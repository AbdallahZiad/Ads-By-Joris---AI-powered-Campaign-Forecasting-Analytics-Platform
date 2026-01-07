import React from 'react';
import { HiOutlineFolder, HiOutlineCollection } from 'react-icons/hi';
import { AggregatedStats } from '../../../../types';
import { formatNumber, formatCurrency, formatMultiplier, renderStat } from '../../../../utils/format';
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
        e.stopPropagation();
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
            <div className={styles.checkboxWrapper} onClick={handleCheckboxClick}>
                <input
                    type="checkbox"
                    className={styles.checkbox}
                    checked={isSelected}
                    disabled={isDisabled}
                    onChange={() => {}}
                    title={isDisabled ? "No data available for charting" : `Add ${stats.type.toLowerCase()} to chart`}
                    style={isSelected && selectionColor ? {
                        backgroundColor: selectionColor,
                        borderColor: selectionColor
                    } : undefined}
                />
            </div>

            <div className={styles.iconWrapper}>
                <Icon size={20} />
            </div>

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

            <div className={styles.statCol}>
                {formatNumber(stats.totalVolume)}
                <span className={styles.statLabel}>Avg Vol</span>
            </div>

            <div className={styles.statCol}>
                {stats.avgCompetition.toFixed(1)}
                <span className={styles.statLabel}>Comp</span>
            </div>

            <div className={styles.statCol}>
                {formatCurrency(stats.avgCpc)}
                <span className={styles.statLabel}>CPC</span>
            </div>

            {/* ▼▼▼ FIX: Use renderStat for Cur Vol to support Null/Dash ▼▼▼ */}
            <div className={`${styles.statCol} ${styles.forecastStart}`}>
                {renderStat(stats.forecastCurrent, false, formatNumber)}
                <span className={styles.statLabel} style={{ color: '#818cf8' }}>Cur Vol</span>
            </div>

            <div className={styles.forecastCol}>
                {renderStat(stats.forecastYoY, false, formatMultiplier)}
                <span className={styles.statLabel}>YoY</span>
            </div>

            <div className={styles.forecastCol}>
                {renderStat(stats.forecast1M, false, formatMultiplier)}
                <span className={styles.statLabel}>+1 M</span>
            </div>

            <div className={styles.forecastCol}>
                {renderStat(stats.forecast3M, false, formatMultiplier)}
                <span className={styles.statLabel}>+3 M</span>
            </div>

            <div className={styles.forecastCol}>
                {renderStat(stats.forecast6M, false, formatMultiplier)}
                <span className={styles.statLabel}>+6 M</span>
            </div>
        </div>
    );
};

export default React.memo(AnalysisSummaryRow);