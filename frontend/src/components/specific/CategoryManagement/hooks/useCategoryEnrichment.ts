import { useState } from 'react';
import { Category, Group } from '../../../../types';
import { mockApi } from '../../../../api/mockApi';
import { MetricsCache } from '../../../../utils/metricsCache';

interface Props {
    countryId?: string;
    languageId?: string;
    setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
    setSelectedKeywordsByGroup: React.Dispatch<React.SetStateAction<Map<string, Set<string>>>>;
}

export const useCategoryEnrichment = ({ countryId, languageId, setCategories, setSelectedKeywordsByGroup }: Props) => {
    const [enrichingGroupIds, setEnrichingGroupIds] = useState<Set<string>>(new Set());
    const [newKeywordsByGroup, setNewKeywordsByGroup] = useState<Map<string, Set<string>>>(new Map());

    const clearNewKeywords = () => {
        setNewKeywordsByGroup(new Map());
    };

    const enrichGroup = async (group: Group) => {
        if (!countryId || !languageId) {
            alert("Please select a Country and Language.");
            return;
        }

        setEnrichingGroupIds(prev => new Set(prev).add(group.id));

        try {
            // Use group name as seed if empty
            const seedKeywords = group.keywords.length > 0 ? group.keywords : [group.name];
            const result = await mockApi.enrichKeywords(seedKeywords, languageId, countryId);

            MetricsCache.cacheResults(result);

            const oldKeywordsSet = new Set(group.keywords);
            const allResultKeywords = result.map(r => r.text);
            const newlyAddedSet = new Set<string>();

            allResultKeywords.forEach(k => {
                if (!oldKeywordsSet.has(k)) newlyAddedSet.add(k);
            });

            // 1. Update Data
            setCategories(prev => prev.map(cat => ({
                ...cat,
                groups: cat.groups.map(g => {
                    if (g.id === group.id) {
                        return { ...g, keywords: allResultKeywords };
                    }
                    return g;
                })
            })));

            // 2. Highlight "New"
            setNewKeywordsByGroup(prev => {
                const next = new Map(prev);
                next.set(group.id, newlyAddedSet);
                return next;
            });

            // 3. Auto-Select New Keywords
            setSelectedKeywordsByGroup(prev => {
                const next = new Map(prev);
                const currentGroupSelection = next.get(group.id) || new Set();
                newlyAddedSet.forEach(newKw => currentGroupSelection.add(newKw));
                next.set(group.id, currentGroupSelection);
                return next;
            });

        } catch (err) {
            console.error(`Failed to enrich group ${group.name}`, err);
        } finally {
            setEnrichingGroupIds(prev => {
                const next = new Set(prev);
                next.delete(group.id);
                return next;
            });
        }
    };

    return {
        enrichingGroupIds,
        newKeywordsByGroup,
        enrichGroup,
        clearNewKeywords
    };
};