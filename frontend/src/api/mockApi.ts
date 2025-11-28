import {UnifiedKeywordResult, KeywordForecast, ScannerConfig, ScannerResponse} from '../types';
import {MOCK_HISTORY_DB, MOCK_FORECAST_DB, MOCK_SCANNER_RESPONSE} from './mockData';
import { normalize } from '../utils/text';

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
        await delay(500);
        return MOCK_SCANNER_RESPONSE;
    },

    // ▼▼▼ NEW ENRICH ENDPOINT ▼▼▼
    enrichKeywords: async (
        seedKeywords: string[],
        languageId: string,
        countryId: string
    ): Promise<UnifiedKeywordResult[]> => {
        console.log(`API [Enrich]: Enriching ${seedKeywords.length} seeds (Lang: ${languageId}, Geo: ${countryId})`);

        // Simulate network delay per group
        await delay(1500);

        const results: UnifiedKeywordResult[] = [];

        // 1. Echo back seed keywords with mock history data
        seedKeywords.forEach(seed => {
            const normalizedSeed = normalize(seed);
            const mockHistory = MOCK_HISTORY_DB.results.find(m => normalize(m.text) === normalizedSeed);
            results.push({
                text: seed, // Keep original casing from input
                keyword_metrics: mockHistory ? mockHistory.keyword_metrics : null
            });
        });

        // 2. Generate some "new" related keywords
        // In a real app, this comes from Google. Here we synthesize a few.
        const suffixes = ["pro", "reviews", "best", "cheap", "2024", "vs competitors"];
        const numNew = Math.floor(Math.random() * 3) + 2; // Add 2-5 new keywords

        for (let i = 0; i < numNew; i++) {
            if (seedKeywords.length > 0) {
                const base = seedKeywords[i % seedKeywords.length];
                const suffix = suffixes[i % suffixes.length];
                const newKw = `${base} ${suffix}`;

                // Add a dummy metric for the new keyword
                results.push({
                    text: newKw,
                    keyword_metrics: MOCK_HISTORY_DB.results[0].keyword_metrics // Reuse dummy metrics for visual pop
                });
            }
        }

        return results;
    }
};