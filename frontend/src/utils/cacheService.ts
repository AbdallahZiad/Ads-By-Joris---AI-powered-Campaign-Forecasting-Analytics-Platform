import { KeywordHistoricalMetrics, KeywordForecast, UnifiedKeywordResult } from '../types';
import { normalize } from './text';

interface CacheEntry<T> {
    data: T;
    timestamp: number; // Epoch time
}

// Composite key separator
const SEP = '||';

class KeywordDataCache<T> {
    private cache = new Map<string, CacheEntry<T>>();

    /**
     * Generates a unique key based on Keyword + Geo + Lang
     */
    private makeKey(keyword: string, countryId: string, languageId: string): string {
        return `${normalize(keyword)}${SEP}${countryId}${SEP}${languageId}`;
    }

    /**
     * Checks if the cached data is still valid (Same Month & Year)
     */
    private isFresh(timestamp: number): boolean {
        const cachedDate = new Date(timestamp);
        const now = new Date();

        return (
            cachedDate.getMonth() === now.getMonth() &&
            cachedDate.getFullYear() === now.getFullYear()
        );
    }

    set(keyword: string, countryId: string, languageId: string, data: T) {
        const key = this.makeKey(keyword, countryId, languageId);
        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });
    }

    get(keyword: string, countryId: string, languageId: string): T | undefined {
        const key = this.makeKey(keyword, countryId, languageId);
        const entry = this.cache.get(key);

        if (!entry) return undefined;

        // "Freshness" check: If month changed, treat as missing (return undefined)
        if (!this.isFresh(entry.timestamp)) {
            this.cache.delete(key);
            return undefined;
        }

        return entry.data;
    }

    has(keyword: string, countryId: string, languageId: string): boolean {
        return this.get(keyword, countryId, languageId) !== undefined;
    }

    /**
     * Filters a list of keywords, returning only those NOT in the cache for this specific context.
     */
    getMissing(keywords: string[], countryId: string, languageId: string): string[] {
        return keywords.filter(k => !this.has(k, countryId, languageId));
    }
}

// Export singleton instances
export const HistoryCache = new KeywordDataCache<KeywordHistoricalMetrics>();
export const ForecastCache = new KeywordDataCache<KeywordForecast>();

// Helper to bulk cache History results (used by Enrichment and Analysis)
export const cacheHistoryBatch = (results: UnifiedKeywordResult[], countryId: string, languageId: string) => {
    results.forEach(res => {
        if (res.keyword_metrics) {
            HistoryCache.set(res.text, countryId, languageId, res.keyword_metrics);
        }
    });
};