import { useState, useEffect } from 'react';
import { Category } from '../../../../types';

export const useCategorySelection = (categories: Category[], initialImportData?: Category[]) => {
    const [selectedCategoryIds, setSelectedCategoryIds] = useState<Set<string>>(new Set());
    const [selectedGroupIds, setSelectedGroupIds] = useState<Set<string>>(new Set());
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
                newSelectedKeywordsMap.set(g.id, new Set(g.keywords));
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
            newSelectedKeywordsMap.set(groupId, new Set(group.keywords));
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
            if (group.keywords.every(k => groupKeywords.has(k))) {
                newSelectedGroupIds.add(groupId);
                if (category.groups.every(g => newSelectedGroupIds.has(g.id))) {
                    newSelectedCatIds.add(categoryId);
                }
            }
        } else {
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
                newSelectedKeywordsMap.set(group.id, new Set(group.keywords));
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
        setSelectedCategoryIds, // Exposed for sync updates (e.g. deletion cleanup)
        setSelectedGroupIds,
        setSelectedKeywordsByGroup
    };
};