import React from 'react';
import { Category as CategoryType, Group as GroupType } from '../../../../types';
import CategoryComponent from '../../Category/Category';

interface Props {
    categories: CategoryType[];
    // Selection State
    selectedCategoryIds: Set<string>;
    selectedGroupIds: Set<string>;
    selectedKeywordsByGroup: Map<string, Set<string>>;
    // Enrichment State
    enrichingGroupIds: Set<string>;
    newKeywordsByGroup: Map<string, Set<string>>;
    // Handlers
    onCategorySelect: (id: string, selected: boolean) => void;
    onGroupSelect: (catId: string, grpId: string, selected: boolean) => void;
    onKeywordSelect: (catId: string, grpId: string, kw: string, selected: boolean) => void;
    onCategoryRemove: (id: string) => void;
    onCategoryNameSave: (id: string, name: string) => void;
    onGroupAdd: (catId: string) => void;
    onGroupRemove: (catId: string, grpId: string) => void;
    onGroupNameSave: (catId: string, grpId: string, name: string) => void;
    onKeywordSave: (catId: string, grpId: string, kws: string[]) => void;
    // Actions
    onEnrichGroup: (group: GroupType) => void;
    onRunAnalysisCategory: (cat: CategoryType) => void;
    onRunAnalysisGroup: (cat: CategoryType, grp: GroupType) => void;
}

const CategoryList: React.FC<Props> = ({
                                           categories,
                                           selectedCategoryIds,
                                           selectedGroupIds,
                                           selectedKeywordsByGroup,
                                           enrichingGroupIds,
                                           newKeywordsByGroup,
                                           onCategorySelect,
                                           onGroupSelect,
                                           onKeywordSelect,
                                           onCategoryRemove,
                                           onCategoryNameSave,
                                           onGroupAdd,
                                           onGroupRemove,
                                           onGroupNameSave,
                                           onKeywordSave,
                                           onEnrichGroup,
                                           onRunAnalysisCategory,
                                           onRunAnalysisGroup
                                       }) => {
    if (categories.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
                <p>No categories yet. Use the Website Scanner or add one manually.</p>
            </div>
        );
    }

    return (
        <>
            {categories.map((category) => (
                <CategoryComponent
                    key={category.id}
                    category={category}
                    initialOpen={categories.length === 1}
                    selected={selectedCategoryIds.has(category.id)}
                    onSelect={(isSelected) => onCategorySelect(category.id, isSelected)}
                    selectedGroupIds={selectedGroupIds}
                    onGroupSelect={(groupId, isSelected) => onGroupSelect(category.id, groupId, isSelected)}
                    onRemove={() => onCategoryRemove(category.id)}
                    onNameSave={(newName) => onCategoryNameSave(category.id, newName)}
                    // Batch enrich logic remains here for convenience or moved up if needed
                    onEnrich={() => {
                        const groups = category.groups;
                        (async () => { for (const g of groups) await onEnrichGroup(g); })();
                    }}
                    onRunAnalysis={() => onRunAnalysisCategory(category)}
                    onGroupAdd={onGroupAdd}
                    onGroupRemove={(groupId) => onGroupRemove(category.id, groupId)}
                    onGroupNameSave={(groupId, newName) => onGroupNameSave(category.id, groupId, newName)}
                    onGroupEnrich={(groupId) => {
                        const grp = category.groups.find(g => g.id === groupId);
                        if (grp) onEnrichGroup(grp);
                    }}
                    onGroupRunAnalysis={(groupId) => onRunAnalysisGroup(category, category.groups.find(g => g.id === groupId)!)}
                    selectedKeywordsByGroup={selectedKeywordsByGroup}
                    onKeywordSelect={(groupId, keyword, isSelected) =>
                        onKeywordSelect(category.id, groupId, keyword, isSelected)
                    }
                    onKeywordSave={(groupId, newKw) => onKeywordSave(category.id, groupId, newKw)}
                    onKeywordCopy={() => {}}
                    enrichingGroupIds={enrichingGroupIds}
                    newKeywordsByGroup={newKeywordsByGroup}
                />
            ))}
        </>
    );
};

export default CategoryList;