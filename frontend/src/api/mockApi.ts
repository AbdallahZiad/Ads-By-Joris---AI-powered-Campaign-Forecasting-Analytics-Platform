import {UnifiedKeywordResult, KeywordForecast, ScannerConfig, ScannerResponse} from '../types';
import {MOCK_HISTORY_DB, MOCK_FORECAST_DB, MOCK_SCANNER_RESPONSE} from './mockData';
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
    },

    scanWebsite: async (config: ScannerConfig): Promise<ScannerResponse> => {
        console.log("API [Scanner]: Starting scan with config:", config);
        // Simulate long processing time (e.g., 4 seconds) for effect
        await delay(4000);
        return MOCK_SCANNER_RESPONSE;
    }
};