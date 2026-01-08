import { useState } from 'react';
import { Group } from '../../../../types';
import { cacheService } from '../../../../utils/cacheService';
import { useEnrichment } from '../../../../hooks/useEnrichment';
import { useToast } from '../../../../hooks/useToast';

interface Props {
    countryId?: string;
    languageId?: string;
    onBulkAdd: (vars: { groupId: string, keywords: string[] }) => Promise<any>;
    setSelectedKeywordsByGroup: React.Dispatch<React.SetStateAction<Map<string, Set<string>>>>;
    setCategories?: any;
}

export const useCategoryEnrichment = ({ countryId, languageId, onBulkAdd, setSelectedKeywordsByGroup }: Props) => {
    const [enrichingGroupIds, setEnrichingGroupIds] = useState<Set<string>>(new Set());
    const [newKeywordsByGroup, setNewKeywordsByGroup] = useState<Map<string, Set<string>>>(new Map());

    const { mutateAsync: enrichKeywordsApi } = useEnrichment();
    const toast = useToast();

    const clearNewKeywords = () => {
        setNewKeywordsByGroup(new Map());
    };

    const enrichGroup = async (group: Group) => {
        if (!countryId || !languageId) {
            toast.warning("Please select a Country and Language before enriching.", "Missing Configuration");
            return;
        }

        setEnrichingGroupIds(prev => new Set(prev).add(group.id));

        try {
            // Map objects to strings for the API call
            const seedKeywords = group.keywords.length > 0
                ? group.keywords.map(k => k.text)
                : [group.name];

            const response = await enrichKeywordsApi({
                keywords: seedKeywords,
                languageId,
                countryId
            });

            cacheService.saveBatch(countryId, languageId, response.results, []);

            // Create a set of existing keyword TEXTs
            const oldKeywordsSet = new Set(group.keywords.map(k => k.text));
            const allResultKeywords = response.results.map(r => r.text);

            const newlyAddedSet = new Set<string>();
            const keywordsToAdd: string[] = [];

            allResultKeywords.forEach(k => {
                if (!oldKeywordsSet.has(k)) {
                    newlyAddedSet.add(k);
                    keywordsToAdd.push(k);
                }
            });

            if (keywordsToAdd.length > 0) {
                // Optimistically add to project
                await onBulkAdd({ groupId: group.id, keywords: keywordsToAdd });
            } else {
                // ▼▼▼ FIX: Inform user if no NEW keywords were found ▼▼▼
                toast.warning(
                    `No new related keywords were found for "${group.name}".`,
                    "Enrichment Result"
                );
            }

            setNewKeywordsByGroup(prev => {
                const next = new Map(prev);
                const existing = next.get(group.id) || new Set();
                newlyAddedSet.forEach(k => existing.add(k));
                next.set(group.id, existing);
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
            toast.error(
                `Could not enrich "${group.name}". Check your internet connection or try again later.`,
                "Enrichment Failed"
            );
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