import { apiClient } from '../apiClient';
import { AsyncTaskInitResponse, GoogleAdsKeywordResponse } from '../../types';

// The correct payload structure for the Forecast Task
interface ForecastTaskPayload {
    google_ads_data: GoogleAdsKeywordResponse;
    forecast_months: number;
}

export const analysisService = {
    // 1. Get History (Direct API Call)
    fetchHistoricalMetrics: async (keywords: string[], languageId: string, countryId: string): Promise<GoogleAdsKeywordResponse> => {
        return apiClient.post<GoogleAdsKeywordResponse>('/api/v1/google-ads/keywords/historical-metrics', {
            keywords,
            language_id: languageId,
            country_id: countryId
        });
    },

    // 2. Start Forecast Task (Async - accepting the history data)
    startForecast: async (payload: ForecastTaskPayload): Promise<AsyncTaskInitResponse> => {
        return apiClient.post<AsyncTaskInitResponse>('/api/v1/analysis/forecast', payload);
    }
};