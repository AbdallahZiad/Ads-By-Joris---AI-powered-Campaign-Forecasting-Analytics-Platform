import React, { useMemo } from 'react';
import { HiSparkles } from 'react-icons/hi';
import Collapsible from '../../../common/Collapsible/Collapsible';
import AnalyzedKeywordRow from '../AnalyzedKeywordRow/AnalyzedKeywordRow';
import { AnalyzedGroup as AnalyzedGroupType, AnalyzedKeyword, SortConfig } from '../../../../types';
import styles from './AnalyzedGroup.module.css';

interface Props {
    group: AnalyzedGroupType;
    chartSelection: Set<string>;
    onChartSelectionChange: (keywords: string[], isSelected: boolean) => void;
    sortConfig: SortConfig; // ▼▼▼ NEW PROP
}

const AnalyzedGroup: React.FC<Props> = ({ group, chartSelection, onChartSelectionChange, sortConfig }) => {

    const isSelectable = (k: AnalyzedKeyword) => !(k.history === null && k.forecast === null);

    // 1. Get Selectable Keywords (for Checkbox logic)
    const selectableKeywords = useMemo(() =>
            group.keywords.filter(isSelectable).map(k => k.text),
        [group]
    );

    // 2. Sort Keywords for Display
    const sortedKeywords = useMemo(() => {
        const sorted = [...group.keywords];
        const { field, order } = sortConfig;
        const m = order === 'ASC' ? 1 : -1;

        sorted.sort((a, b) => {
            let valA: number | string = 0;
            let valB: number | string = 0;

            if (field === 'NAME') {
                return a.text.localeCompare(b.text) * m;
            } else if (field === 'VOLUME') {
                valA = a.history?.avg_monthly_searches || 0;
                valB = b.history?.avg_monthly_searches || 0;
            } else if (field === 'COMPETITION') {
                valA = a.history?.competition_index || 0;
                valB = b.history?.competition_index || 0;
            } else if (field === 'GROWTH') {
                // Use YoY growth for sorting
                valA = a.forecast?.annual_growth_rate || 0;
                valB = b.forecast?.annual_growth_rate || 0;
            }

            if (valA < valB) return -1 * m;
            if (valA > valB) return 1 * m;
            return 0;
        });

        return sorted;
    }, [group.keywords, sortConfig]);


    const handleGroupChartToggle = (isSelected: boolean) => {
        onChartSelectionChange(selectableKeywords, isSelected);
    }

    const isFullySelected = selectableKeywords.length > 0 &&
        selectableKeywords.every(k => chartSelection.has(k));

    const isGroupDisabled = selectableKeywords.length === 0;

    return (
        <Collapsible
            title={`${group.name} (${group.keywords.length})`}
            initialOpen={true}
            containerClassName={styles.groupContainer}
            contentClassName={styles.groupContent}
            selectable={true}
            selected={isFullySelected}
            onSelect={!isGroupDisabled ? handleGroupChartToggle : undefined}
        >
            <div className="mt-2">
                {group.keywords.length > 0 && (
                    <div className={styles.headerRow}>
                        <div></div>
                        <div>Keyword</div>
                        <div className={styles.headerStat}>Avg. Vol</div>
                        <div className={styles.headerStat}>Comp</div>
                        <div className={styles.headerStat}>CPC</div>
                        <div className={styles.forecastHeader} title="Forecasted Data by AI">
                            <HiSparkles size={14} className="opacity-75" /> Cur. Vol
                        </div>
                        <div className={styles.forecastStat}>YoY</div>
                        <div className={styles.forecastStat}>+1M</div>
                        <div className={styles.forecastStat}>+3M</div>
                        <div className={styles.forecastStat}>+6M</div>
                    </div>
                )}

                {sortedKeywords.map((analyzedKeyword) => (
                    <AnalyzedKeywordRow
                        key={analyzedKeyword.text}
                        data={analyzedKeyword}
                        isSelectedForChart={chartSelection.has(analyzedKeyword.text)}
                        onToggleChart={(keyword, isSelected) => onChartSelectionChange([keyword], isSelected)}
                    />
                ))}
            </div>
        </Collapsible>
    );
};

export default AnalyzedGroup;