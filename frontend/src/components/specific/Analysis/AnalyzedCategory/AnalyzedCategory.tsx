import React, { useMemo } from 'react';
import Collapsible from '../../../common/Collapsible/Collapsible';
import AnalyzedGroup from '../AnalyzedGroup/AnalyzedGroup';
import { AnalyzedCategory as AnalyzedCategoryType, AnalyzedKeyword, SortConfig } from '../../../../types';
import styles from './AnalyzedCategory.module.css';

interface Props {
    category: AnalyzedCategoryType;
    chartSelection: Set<string>;
    onChartSelectionChange: (keywords: string[], isSelected: boolean) => void;
    sortConfig: SortConfig; // ▼▼▼ NEW PROP
}

const AnalyzedCategory: React.FC<Props> = ({ category, chartSelection, onChartSelectionChange, sortConfig }) => {

    const isSelectable = (k: AnalyzedKeyword) => !(k.history === null && k.forecast === null);

    const allSelectableCategoryKeywords = useMemo(() =>
            category.groups.flatMap(g => g.keywords.filter(isSelectable).map(k => k.text)),
        [category]
    );

    const handleCategoryChartToggle = (isSelected: boolean) => {
        onChartSelectionChange(allSelectableCategoryKeywords, isSelected);
    }

    const isFullySelected = allSelectableCategoryKeywords.length > 0 &&
        allSelectableCategoryKeywords.every(k => chartSelection.has(k));

    return (
        <Collapsible
            title={category.name}
            initialOpen={true}
            containerClassName={styles.categoryContainer}
            contentClassName={styles.categoryContent}
            selectable={true}
            selected={isFullySelected}
            onSelect={handleCategoryChartToggle}
        >
            {category.groups.map((group) => (
                <AnalyzedGroup
                    key={group.id}
                    group={group}
                    chartSelection={chartSelection}
                    onChartSelectionChange={onChartSelectionChange}
                    sortConfig={sortConfig} // ▼▼▼ Pass Down
                />
            ))}
        </Collapsible>
    );
};

export default AnalyzedCategory;