import { apiClient } from '../apiClient';
import { GoogleAdsKeywordResponse } from '../../types';

interface EnrichRequest {
    keywords: string[];
    years_of_history: number;
    targeting: {
        language_constant_id: string;
        geo_target_id: string;
    };
    maximum_number_of_new_keywords: number;
}

export const enrichmentService = {
    enrichKeywords: async (keywords: string[], languageId: string, countryId: string): Promise<GoogleAdsKeywordResponse> => {
        const body: EnrichRequest = {
            keywords,
            years_of_history: 5,
            targeting: {
                language_constant_id: languageId,
                geo_target_id: countryId
            },
            maximum_number_of_new_keywords: 10
        };

        // ▼▼▼ UPDATED ENDPOINT ▼▼▼
        return apiClient.post<GoogleAdsKeywordResponse>('/api/v1/google-ads/keywords/enrich', body);
    }
};