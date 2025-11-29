import { apiClient } from '../apiClient';
import { GoogleAdsKeywordResponse, ForecastResponse, UnifiedKeywordResult } from '../../types';

interface HistoryRequest {
    keywords: string[];
    years_of_history: number;
    targeting: {
        language_constant_id: string;
        geo_target_id: string;
    };
}

interface ForecastRequest {
    google_ads_data: {
        results: UnifiedKeywordResult[];
    };
    forecast_months: number;
}

export const analysisService = {
    fetchHistoricalMetrics: async (keywords: string[], languageId: string, countryId: string): Promise<GoogleAdsKeywordResponse> => {
        const body: HistoryRequest = {
            keywords,
            years_of_history: 5,
            targeting: {
                language_constant_id: languageId,
                geo_target_id: countryId
            }
        };
        return apiClient.post<GoogleAdsKeywordResponse>('/api/v1/google-ads/keywords/historical-metrics', body);
    },

    fetchForecast: async (historyData: UnifiedKeywordResult[]): Promise<ForecastResponse> => {
        const body: ForecastRequest = {
            google_ads_data: {
                results: historyData
            },
            forecast_months: 12
        };
        return apiClient.post<ForecastResponse>('/api/v1/analysis/forecast', body);
    }
};