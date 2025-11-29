import { useMutation } from '@tanstack/react-query';
import { enrichmentService } from '../api/services/enrichmentService';
import { GoogleAdsKeywordResponse } from '../types';

interface EnrichParams {
    keywords: string[];
    languageId: string;
    countryId: string;
}

export const useEnrichment = () => {
    return useMutation<GoogleAdsKeywordResponse, Error, EnrichParams>({
        mutationFn: ({ keywords, languageId, countryId }) =>
            enrichmentService.enrichKeywords(keywords, languageId, countryId),
        onError: (error) => {
            console.error("Enrichment API failed:", error);
        }
    });
};