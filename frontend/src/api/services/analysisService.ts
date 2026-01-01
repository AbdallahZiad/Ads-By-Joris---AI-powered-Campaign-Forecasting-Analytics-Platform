import { apiClient } from '../apiClient';
import { AsyncTaskInitResponse, GoogleAdsKeywordResponse } from '../../types';

// The correct payload structure for the Forecast Task
interface ForecastTaskPayload {
    google_ads_data: GoogleAdsKeywordResponse;
    forecast_months: number;
}

// ▼▼▼ NEW: Interface matching backend GoogleAdsBaseKeywordsInput ▼▼▼
interface HistoricalMetricsPayload {
    keywords: string[];
    years_of_history: number;
    targeting: {
        language_constant_id: string;
        geo_target_id: string;
    };
}

export const analysisService = {
    // 1. Get History (Direct API Call)
    fetchHistoricalMetrics: async (keywords: string[], languageId: string, countryId: string): Promise<GoogleAdsKeywordResponse> => {

        // ▼▼▼ FIX: Construct correct nested payload for Pydantic model ▼▼▼
        const payload: HistoricalMetricsPayload = {
            keywords,
            years_of_history: 5,
            targeting: {
                language_constant_id: languageId,
                geo_target_id: countryId
            }
        };

        return apiClient.post<GoogleAdsKeywordResponse>('/api/v1/google-ads/keywords/historical-metrics', payload);
    },

    // 2. Start Forecast Task (Async - accepting the history data)
    startForecast: async (payload: ForecastTaskPayload): Promise<AsyncTaskInitResponse> => {
        return apiClient.post<AsyncTaskInitResponse>('/api/v1/analysis/forecast', payload);
    }
};