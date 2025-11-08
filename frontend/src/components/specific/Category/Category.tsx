import React from 'react';
import Collapsible from '../../common/Collapsible/Collapsible';
import Group from '../Group/Group';
import AddItemButton from '../../common/AddItemButton/AddItemButton';
import { Category as CategoryType } from '../../../types';
import styles from './Category.module.css';

interface CategoryProps {
    category: CategoryType;
    initialOpen?: boolean;
    selected: boolean;
    onSelect: (isSelected: boolean) => void;
    onRemove: () => void;
    onNameSave: (newName: string) => void;
    onEnrich: () => void;
    onRunAnalysis: () => void;
    onGroupAdd: (categoryId: string) => void;
    selectedGroupIds: Set<string>;
    onGroupSelect: (groupId: string, isSelected: boolean) => void;
    onGroupRemove: (groupId: string) => void;
    onGroupNameSave: (groupId: string, newName: string) => void;
    onGroupEnrich: (groupId: string) => void;
    onGroupRunAnalysis: (groupId: string) => void;
    onKeywordSave: (groupId: string, newKeywords: string[]) => void;
    onKeywordCopy: (groupId: string, keywordsText: string) => void;
    onKeywordEdit?: (groupId: string) => void;
    selectedKeywordsByGroup: Map<string, Set<string>>;
    onKeywordSelect: (groupId: string, keyword: string, isSelected: boolean) => void;
}

const Category: React.FC<CategoryProps> = ({
                                               category,
                                               initialOpen = false,
                                               selected,
                                               onSelect,
                                               onRemove,
                                               onNameSave,
                                               onEnrich,
                                               onRunAnalysis,
                                               onGroupAdd,
                                               selectedGroupIds,
                                               onGroupSelect,
                                               onGroupRemove,
                                               onGroupNameSave,
                                               onGroupEnrich,
                                               onGroupRunAnalysis,
                                               onKeywordSave,
                                               onKeywordCopy,
                                               onKeywordEdit,
                                               selectedKeywordsByGroup,
                                               onKeywordSelect,
                                           }) => {
    return (
        <Collapsible
            title={category.name}
            initialOpen={initialOpen}
            onTitleSave={onNameSave}
            onRemove={onRemove}
            containerClassName={styles.categoryContainer}
            contentClassName={styles.categoryContent}
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
                    selected={selectedGroupIds.has(group.id)}
                    onSelect={(isSelected) => onGroupSelect(group.id, isSelected)}
                    onRemove={() => onGroupRemove(group.id)}
                    onNameSave={(newName) => onGroupNameSave(group.id, newName)}
                    onEnrich={() => onGroupEnrich(group.id)}
                    onRunAnalysis={() => onGroupRunAnalysis(group.id)}
                    selectedKeywords={selectedKeywordsByGroup.get(group.id) || new Set()}
                    onKeywordSelect={(keyword, isSelected) =>
                        onKeywordSelect(group.id, keyword, isSelected)
                    }
                    onKeywordSave={(newKeywords) => onKeywordSave(group.id, newKeywords)}
                    onKeywordCopy={(keywordsText) => onKeywordCopy(group.id, keywordsText)}
                    onKeywordEdit={() => onKeywordEdit?.(group.id)}
                />
            ))}

            <AddItemButton
                label="Add Group"
                onClick={() => onGroupAdd(category.id)}
                className="mt-2" // Add a little top margin for breathing room
            />
        </Collapsible>
    );
};

export default Category;