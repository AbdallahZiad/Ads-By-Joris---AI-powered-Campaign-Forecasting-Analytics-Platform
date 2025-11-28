import { KeywordHistoricalMetrics, UnifiedKeywordResult } from '../types';
import { normalize } from './text';

// A simple in-memory cache to store metrics globally.
// Key: Normalized keyword text
// Value: The metrics object
const METRICS_CACHE = new Map<string, KeywordHistoricalMetrics>();

export const MetricsCache = {
    /**
     * Stores metrics from an API response into the global cache.
     */
    cacheResults: (results: UnifiedKeywordResult[]) => {
        results.forEach(result => {
            if (result.keyword_metrics) {
                METRICS_CACHE.set(normalize(result.text), result.keyword_metrics);
            }
        });
    },

    /**
     * Retrieves metrics for a keyword if they exist.
     */
    get: (keyword: string): KeywordHistoricalMetrics | undefined => {
        return METRICS_CACHE.get(normalize(keyword));
    },

    /**
     * Checks if we have metrics for a specific keyword.
     */
    has: (keyword: string): boolean => {
        return METRICS_CACHE.has(normalize(keyword));
    },

    /**
     * Returns a list of keywords from the input array that are NOT in the cache
     * and therefore need to be fetched from the API.
     */
    getMissingKeywords: (keywords: string[]): string[] => {
        return keywords.filter(k => !METRICS_CACHE.has(normalize(k)));
    }
};