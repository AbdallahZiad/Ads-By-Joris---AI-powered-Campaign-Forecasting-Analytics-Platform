import { useState, useEffect } from 'react';
import { Category } from '../../../../types';

export const useCategorySelection = (categories: Category[], initialImportData?: Category[]) => {
    const [selectedCategoryIds, setSelectedCategoryIds] = useState<Set<string>>(new Set());
    const [selectedGroupIds, setSelectedGroupIds] = useState<Set<string>>(new Set());
    // Maps GroupID -> Set of Keyword TEXT strings
    const [selectedKeywordsByGroup, setSelectedKeywordsByGroup] = useState<Map<string, Set<string>>>(new Map());

    // Reset selection on new import
    useEffect(() => {
        if (initialImportData && initialImportData.length > 0) {
            clearSelection();
        }
    }, [initialImportData]);

    const clearSelection = () => {
        setSelectedCategoryIds(new Set());
        setSelectedGroupIds(new Set());
        setSelectedKeywordsByGroup(new Map());
    };

    const toggleCategory = (categoryId: string, isSelected: boolean) => {
        const newSelectedCatIds = new Set(selectedCategoryIds);
        const newSelectedGroupIds = new Set(selectedGroupIds);
        const newSelectedKeywordsMap = new Map(selectedKeywordsByGroup);
        const category = categories.find(c => c.id === categoryId);
        if (!category) return;

        if (isSelected) {
            newSelectedCatIds.add(categoryId);
            category.groups.forEach(g => {
                newSelectedGroupIds.add(g.id);
                // ▼▼▼ FIX: Map keyword objects to text strings ▼▼▼
                newSelectedKeywordsMap.set(g.id, new Set(g.keywords.map(k => k.text)));
            });
        } else {
            newSelectedCatIds.delete(categoryId);
            category.groups.forEach(g => {
                newSelectedGroupIds.delete(g.id);
                newSelectedKeywordsMap.delete(g.id);
            });
        }
        setSelectedCategoryIds(newSelectedCatIds);
        setSelectedGroupIds(newSelectedGroupIds);
        setSelectedKeywordsByGroup(newSelectedKeywordsMap);
    };

    const toggleGroup = (categoryId: string, groupId: string, isSelected: boolean) => {
        const newSelectedGroupIds = new Set(selectedGroupIds);
        const newSelectedCatIds = new Set(selectedCategoryIds);
        const newSelectedKeywordsMap = new Map(selectedKeywordsByGroup);
        const category = categories.find(c => c.id === categoryId);
        const group = category?.groups.find(g => g.id === groupId);
        if (!category || !group) return;

        if (isSelected) {
            newSelectedGroupIds.add(groupId);
            // ▼▼▼ FIX: Map keyword objects to text strings ▼▼▼
            newSelectedKeywordsMap.set(groupId, new Set(group.keywords.map(k => k.text)));

            if (category.groups.every(g => newSelectedGroupIds.has(g.id))) {
                newSelectedCatIds.add(categoryId);
            }
        } else {
            newSelectedGroupIds.delete(groupId);
            newSelectedKeywordsMap.delete(groupId);
            newSelectedCatIds.delete(categoryId);
        }
        setSelectedGroupIds(newSelectedGroupIds);
        setSelectedCategoryIds(newSelectedCatIds);
        setSelectedKeywordsByGroup(newSelectedKeywordsMap);
    };

    const toggleKeyword = (categoryId: string, groupId: string, keyword: string, isSelected: boolean) => {
        const newSelectedKeywordsMap = new Map(selectedKeywordsByGroup);
        const newSelectedGroupIds = new Set(selectedGroupIds);
        const newSelectedCatIds = new Set(selectedCategoryIds);

        const groupKeywords = new Set(newSelectedKeywordsMap.get(groupId) || []);
        if (isSelected) {
            groupKeywords.add(keyword);
        } else {
            groupKeywords.delete(keyword);
        }
        newSelectedKeywordsMap.set(groupId, groupKeywords);

        const category = categories.find(c => c.id === categoryId);
        const group = category?.groups.find(g => g.id === groupId);
        if (!category || !group) return;

        if (isSelected) {
            // Check if ALL keywords in the group are now selected
            if (group.keywords.every(k => groupKeywords.has(k.text))) {
                newSelectedGroupIds.add(groupId);
                // Check if ALL groups in the category are now selected
                if (category.groups.every(g => newSelectedGroupIds.has(g.id))) {
                    newSelectedCatIds.add(categoryId);
                }
            }
        } else {
            // If we deselected a keyword, the group (and category) are no longer fully selected
            newSelectedGroupIds.delete(groupId);
            newSelectedCatIds.delete(categoryId);
        }

        setSelectedKeywordsByGroup(newSelectedKeywordsMap);
        setSelectedGroupIds(newSelectedGroupIds);
        setSelectedCategoryIds(newSelectedCatIds);
    };

    const selectAll = () => {
        const newSelectedCatIds = new Set<string>();
        const newSelectedGroupIds = new Set<string>();
        const newSelectedKeywordsMap = new Map<string, Set<string>>();
        categories.forEach(cat => {
            newSelectedCatIds.add(cat.id);
            cat.groups.forEach(group => {
                newSelectedGroupIds.add(group.id);
                // ▼▼▼ FIX: Map keyword objects to text strings ▼▼▼
                newSelectedKeywordsMap.set(group.id, new Set(group.keywords.map(k => k.text)));
            });
        });
        setSelectedCategoryIds(newSelectedCatIds);
        setSelectedGroupIds(newSelectedGroupIds);
        setSelectedKeywordsByGroup(newSelectedKeywordsMap);
    };

    return {
        selectedCategoryIds,
        selectedGroupIds,
        selectedKeywordsByGroup,
        toggleCategory,
        toggleGroup,
        toggleKeyword,
        selectAll,
        clearSelection,
        setSelectedCategoryIds,
        setSelectedGroupIds,
        setSelectedKeywordsByGroup
    };
};