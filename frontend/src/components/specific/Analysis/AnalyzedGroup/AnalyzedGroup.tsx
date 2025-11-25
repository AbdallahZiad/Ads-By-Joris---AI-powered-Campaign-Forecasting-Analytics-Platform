import React, { useMemo } from 'react';
import { HiSparkles } from 'react-icons/hi';
import Collapsible from '../../../common/Collapsible/Collapsible';
import AnalyzedKeywordRow from '../AnalyzedKeywordRow/AnalyzedKeywordRow';
import { AnalyzedGroup as AnalyzedGroupType, AnalyzedKeyword } from '../../../../types';
import styles from './AnalyzedGroup.module.css';

interface Props {
    group: AnalyzedGroupType;
    chartSelection: Set<string>;
    onChartSelectionChange: (keywords: string[], isSelected: boolean) => void;
}

const AnalyzedGroup: React.FC<Props> = ({ group, chartSelection, onChartSelectionChange }) => {

    // ▼▼▼ ROBUSTNESS: Only selectable if at least one data source exists ▼▼▼
    const isSelectable = (k: AnalyzedKeyword) => !(k.history === null && k.forecast === null);

    // Get only the keywords that actually have data
    const selectableKeywords = useMemo(() =>
            group.keywords.filter(isSelectable).map(k => k.text),
        [group]
    );

    const handleGroupChartToggle = (isSelected: boolean) => {
        // Only toggle keywords that have data
        onChartSelectionChange(selectableKeywords, isSelected);
    }

    // Group is fully selected if it HAS selectable keywords AND they are ALL selected.
    const isFullySelected = selectableKeywords.length > 0 &&
        selectableKeywords.every(k => chartSelection.has(k));

    // Disable group checkbox if it has NO selectable keywords
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

                {group.keywords.map((analyzedKeyword) => (
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