import React from 'react';
import { AnalyzedKeyword } from '../../../../types';
import styles from './AnalyzedKeywordRow.module.css';
import {
    formatCompetition,
    formatCurrency,
    formatMultiplier,
    formatNumber,
    renderStat
} from "../../../../utils/format.tsx";

interface Props {
    data: AnalyzedKeyword;
    isSelectedForChart: boolean;
    onToggleChart: (keyword: string, isSelected: boolean) => void;
}

const AnalyzedKeywordRow: React.FC<Props> = ({
                                                 data,
                                                 isSelectedForChart,
                                                 onToggleChart,
                                             }) => {
    const { text, history, forecast } = data;

    const isDisabled = history === null && forecast === null;
    const isChecked = isSelectedForChart && !isDisabled;

    return (
        <div className={`${styles.rowContainer} ${isDisabled ? styles.disabled : ''}`}>
            <input
                type="checkbox"
                className={styles.checkbox}
                checked={isChecked}
                disabled={isDisabled}
                onChange={(e) => onToggleChart(text, e.target.checked)}
                title={isDisabled ? "No data available" : "Show on chart"}
            />

            <div className={styles.keywordText} title={text}>
                {text}
            </div>

            {/* --- HISTORY DATA --- */}
            <div className={styles.stat} title="Average Monthly Searches">
                {renderStat(history?.avg_monthly_searches, history === undefined, formatNumber)}
            </div>
            <div className={styles.stat} title="Competition Level">
                {renderStat(history?.competition, history === undefined, formatCompetition)}
            </div>
            <div className={styles.stat} title="Average CPC">
                {renderStat(history?.average_cpc_micros, history === undefined, formatCurrency)}
            </div>

            {/* --- FORECAST DATA --- */}
            <div className={`${styles.stat} ${styles.forecastStart}`} title="Current Month Expected Volume">
                {renderStat(forecast?.current_month_expected_volume, forecast === undefined, formatNumber)}
            </div>
            <div className={styles.stat} title="Annual Growth Rate">
                {renderStat(forecast?.annual_growth_rate, forecast === undefined, formatMultiplier)}
            </div>
            <div className={styles.stat} title="Expected Increase (1 Month)">
                {renderStat(forecast?.expected_increase_1m, forecast === undefined, formatMultiplier)}
            </div>
            <div className={styles.stat} title="Expected Increase (3 Months)">
                {renderStat(forecast?.expected_increase_3m, forecast === undefined, formatMultiplier)}
            </div>
            <div className={styles.stat} title="Expected Increase (6 Months)">
                {renderStat(forecast?.expected_increase_6m, forecast === undefined, formatMultiplier)}
            </div>
        </div>
    );
};

// ▼▼▼ PERFORMANCE FIX: Memoize ▼▼▼
export default React.memo(AnalyzedKeywordRow);