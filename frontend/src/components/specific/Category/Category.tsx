import React from 'react';
import Collapsible from '../../common/Collapsable/Collapsible';
import Group from '../Group/Group';
import { Category as CategoryType } from '../../../types';
import styles from './Category.module.css';

interface CategoryProps {
    category: CategoryType;
    initialOpen?: boolean;
    // Category selection
    selected: boolean;
    onSelect: (isSelected: boolean) => void;
    // Group selection (function that takes groupId and status)
    selectedGroupIds: Set<string>;
    onGroupSelect: (groupId: string, isSelected: boolean) => void;
    // Other actions
    onNameSave: (newName: string) => void;
    onEnrich: () => void;
    onRunAnalysis: () => void;
    onGroupNameSave: (groupId: string, newName: string) => void;
    onGroupEnrich: (groupId: string) => void;
    onGroupRunAnalysis: (groupId: string) => void;
    onKeywordSave: (groupId: string, newKeywords: string[]) => void;
    onKeywordCopy: (groupId: string, keywordsText: string) => void;
    onKeywordEdit?: (groupId: string) => void;
}

const Category: React.FC<CategoryProps> = ({
                                               category,
                                               initialOpen = false,
                                               selected,
                                               onSelect,
                                               selectedGroupIds,
                                               onGroupSelect,
                                               onNameSave,
                                               onEnrich,
                                               onRunAnalysis,
                                               onGroupNameSave,
                                               onGroupEnrich,
                                               onGroupRunAnalysis,
                                               onKeywordSave,
                                               onKeywordCopy,
                                               onKeywordEdit,
                                           }) => {
    return (
        <Collapsible
            title={category.name}
            initialOpen={initialOpen}
            onTitleSave={onNameSave}
            containerClassName={styles.categoryContainer}
            contentClassName={styles.categoryContent}
            // Enable selection for Categories
            selectable={true}
            selected={selected}
            onSelect={onSelect}
            headerActions={
                <>
                    <button className={styles.actionButton} onClick={onEnrich}>
                        Enrich
                    </button>
                    <button className={styles.actionButton} onClick={onRunAnalysis}>
                        Run Analysis
                    </button>
                </>
            }
        >
            {category.groups.map((group) => (
                <Group
                    key={group.id}
                    group={group}
                    initialOpen={false}
                    // Pass down selection state
                    selected={selectedGroupIds.has(group.id)}
                    onSelect={(isSelected) => onGroupSelect(group.id, isSelected)}
                    // Pass down other handlers
                    onNameSave={(newName) => onGroupNameSave(group.id, newName)}
                    onEnrich={() => onGroupEnrich(group.id)}
                    onRunAnalysis={() => onGroupRunAnalysis(group.id)}
                    onKeywordSave={(newKeywords) => onKeywordSave(group.id, newKeywords)}
                    onKeywordCopy={(keywordsText) => onKeywordCopy(group.id, keywordsText)}
                    onKeywordEdit={() => onKeywordEdit?.(group.id)}
                />
            ))}
        </Collapsible>
    );
};

export default Category;