import { useState } from 'react';
import { Category, Group } from '../../../../types';
import { cacheHistoryBatch } from '../../../../utils/cacheService'; // Updated Import
import { useEnrichment } from '../../../../hooks/useEnrichment';

interface Props {
    countryId?: string;
    languageId?: string;
    setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
    setSelectedKeywordsByGroup: React.Dispatch<React.SetStateAction<Map<string, Set<string>>>>;
}

export const useCategoryEnrichment = ({ countryId, languageId, setCategories, setSelectedKeywordsByGroup }: Props) => {
    const [enrichingGroupIds, setEnrichingGroupIds] = useState<Set<string>>(new Set());
    const [newKeywordsByGroup, setNewKeywordsByGroup] = useState<Map<string, Set<string>>>(new Map());

    const { mutateAsync: enrichKeywordsApi } = useEnrichment();

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
            const seedKeywords = group.keywords.length > 0 ? group.keywords : [group.name];

            const response = await enrichKeywordsApi({
                keywords: seedKeywords,
                languageId,
                countryId
            });

            // ▼▼▼ UPDATED: Use context-aware batch caching ▼▼▼
            cacheHistoryBatch(response.results, countryId, languageId);

            const oldKeywordsSet = new Set(group.keywords);
            const allResultKeywords = response.results.map(r => r.text);
            const newlyAddedSet = new Set<string>();

            allResultKeywords.forEach(k => {
                if (!oldKeywordsSet.has(k)) newlyAddedSet.add(k);
            });

            setCategories(prev => prev.map(cat => ({
                ...cat,
                groups: cat.groups.map(g => {
                    if (g.id === group.id) {
                        return { ...g, keywords: allResultKeywords };
                    }
                    return g;
                })
            })));

            setNewKeywordsByGroup(prev => {
                const next = new Map(prev);
                next.set(group.id, newlyAddedSet);
                return next;
            });

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