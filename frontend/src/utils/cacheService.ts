import { KeywordHistoricalMetrics, KeywordForecast } from '../types';

interface CachedItem {
    history: KeywordHistoricalMetrics | null;
    forecast: KeywordForecast | null;
    timestamp: number;
}

const CACHE_PREFIX = 'kwa_v1';

const getCurrentMonthKey = () => {
    const now = new Date();
    return `${now.getFullYear()}-${now.getMonth() + 1}`;
};

export const cacheService = {
    getKey: (keyword: string, countryId: string, languageId: string) => {
        const kwSafe = btoa(unescape(encodeURIComponent(keyword)));
        return `${CACHE_PREFIX}_${countryId}_${languageId}_${getCurrentMonthKey()}_${kwSafe}`;
    },

    getItem: (keyword: string, countryId: string, languageId: string): CachedItem | null => {
        const key = cacheService.getKey(keyword, countryId, languageId);
        const stored = localStorage.getItem(key);
        if (!stored) return null;
        try {
            return JSON.parse(stored) as CachedItem;
        } catch (e) {
            return null;
        }
    },

    getBatch: (keywords: string[], countryId: string, languageId: string) => {
        const found = new Map<string, CachedItem>();
        const missing: string[] = [];

        keywords.forEach(kw => {
            const item = cacheService.getItem(kw, countryId, languageId);
            if (item) {
                found.set(kw, item);
            } else {
                missing.push(kw);
            }
        });

        return { found, missing };
    },

    setItem: (
        keyword: string,
        countryId: string,
        languageId: string,
        history: KeywordHistoricalMetrics | null,
        forecast: KeywordForecast | null
    ) => {
        const key = cacheService.getKey(keyword, countryId, languageId);
        const data: CachedItem = { history, forecast, timestamp: Date.now() };
        localStorage.setItem(key, JSON.stringify(data));
    },

    // ▼▼▼ FIX: Partial Merge Strategy ▼▼▼
    saveBatch: (
        countryId: string,
        languageId: string,
        historyResults: any[], // UnifiedKeywordResult[]
        forecastResults: any[] // KeywordForecast[]
    ) => {
        const historyMap = new Map(historyResults.map(h => [h.text, h.keyword_metrics]));
        const forecastMap = new Map(forecastResults.map(f => [f.keyword, f]));

        const allKeywords = new Set([...historyMap.keys(), ...forecastMap.keys()]);

        allKeywords.forEach(kw => {
            // 1. Get existing to prevent overwriting known data with null
            const existing = cacheService.getItem(kw, countryId, languageId);

            // 2. Resolve final values (New > Existing > Null)
            // If historyMap has it (even if null?), use it. If not, fallback to existing.
            // Note: We assume if the key is present in the map, it's an update.

            const newHistory = historyMap.has(kw) ? historyMap.get(kw) : existing?.history;
            const newForecast = forecastMap.has(kw) ? forecastMap.get(kw) : existing?.forecast;

            cacheService.setItem(
                kw,
                countryId,
                languageId,
                newHistory || null,
                newForecast || null
            );
        });
    },

    clearAll: () => {
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith(CACHE_PREFIX)) {
                localStorage.removeItem(key);
            }
        });
    }
};