import { useMutation } from '@tanstack/react-query';
import { enrichmentService } from '../api/services/enrichmentService';
import { GoogleAdsKeywordResponse } from '../types';
import { useToast } from './useToast'; // ▼▼▼ Import

interface EnrichParams {
    keywords: string[];
    languageId: string;
    countryId: string;
}

export const useEnrichment = () => {
    const toast = useToast(); // ▼▼▼ Initialize

    return useMutation<GoogleAdsKeywordResponse, Error, EnrichParams>({
        mutationFn: ({ keywords, languageId, countryId }) =>
            enrichmentService.enrichKeywords(keywords, languageId, countryId),
        onError: (error) => {
            console.error("Enrichment API failed:", error);
            // ▼▼▼ FIX: Notify user of failure ▼▼▼
            toast.error("Enrichment service is currently unavailable. Please try again later.", "Enrichment Failed");
        }
    });
};