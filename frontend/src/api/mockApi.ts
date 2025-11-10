import { UnifiedKeywordResult, KeywordForecast } from '../types';
import { MOCK_HISTORY_DB, MOCK_FORECAST_DB } from './mockData';
import { normalize } from '../utils/text'; // Imported shared normalizer

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApi = {
    fetchHistory: async (keywords: string[]): Promise<UnifiedKeywordResult[]> => {
        console.log("API [History]: Fetching for", keywords.length, "keywords...");
        await delay(800);

        const requestedSet = new Set(keywords.map(k => normalize(k)));
        return MOCK_HISTORY_DB.results.filter(item =>
            requestedSet.has(normalize(item.text))
        );
    },

    fetchForecast: async (keywords: string[]): Promise<KeywordForecast[]> => {
        console.log("API [Forecast]: Running models for", keywords.length, "keywords...");
        await delay(2500);

        const requestedSet = new Set(keywords.map(k => normalize(k)));
        return MOCK_FORECAST_DB.forecasts.filter(item =>
            requestedSet.has(normalize(item.keyword))
        );
    }
};