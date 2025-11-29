import { useMutation } from '@tanstack/react-query';
import { analysisService } from '../api/services/analysisService';
import { GoogleAdsKeywordResponse, ForecastResponse, UnifiedKeywordResult } from '../types';

interface HistoryParams {
    keywords: string[];
    languageId: string;
    countryId: string;
}

export const useAnalysis = () => {
    const historyMutation = useMutation<GoogleAdsKeywordResponse, Error, HistoryParams>({
        mutationFn: ({ keywords, languageId, countryId }) =>
            analysisService.fetchHistoricalMetrics(keywords, languageId, countryId),
        onError: (error) => console.error("History API failed:", error)
    });

    const forecastMutation = useMutation<ForecastResponse, Error, UnifiedKeywordResult[]>({
        mutationFn: (historyData) => analysisService.fetchForecast(historyData),
        onError: (error) => console.error("Forecast API failed:", error)
    });

    return {
        fetchHistory: historyMutation.mutateAsync,
        fetchForecast: forecastMutation.mutateAsync,
        isHistoryLoading: historyMutation.isPending,
        isForecastLoading: forecastMutation.isPending
    };
};