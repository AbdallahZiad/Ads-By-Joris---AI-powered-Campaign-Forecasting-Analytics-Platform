import { KeywordHistoricalMetrics, KeywordForecast, SelectOption } from '../types';
import { COUNTRIES_OPTIONS, LANGUAGES_OPTIONS } from '../constants';

interface CachedItem {
    history: KeywordHistoricalMetrics | null;
    forecast: KeywordForecast | null;
    timestamp: number;
}

const CACHE_PREFIX = 'kwa_v1';
const PROJECT_CONFIG_PREFIX = 'pds_config_';

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

    saveBatch: (
        countryId: string,
        languageId: string,
        historyResults: any[],
        forecastResults: any[]
    ) => {
        const historyMap = new Map(historyResults.map(h => [h.text, h.keyword_metrics]));
        const forecastMap = new Map(forecastResults.map(f => [f.keyword, f]));

        const allKeywords = new Set([...historyMap.keys(), ...forecastMap.keys()]);

        allKeywords.forEach(kw => {
            const existing = cacheService.getItem(kw, countryId, languageId);
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
    },

    // ▼▼▼ NEW: Project Settings Cache Helpers ▼▼▼
    saveProjectSettings: (projectId: string, countryId?: string, languageId?: string) => {
        const payload = { countryId, languageId };
        localStorage.setItem(`${PROJECT_CONFIG_PREFIX}${projectId}`, JSON.stringify(payload));
    },

    getProjectSettings: (projectId: string): { country: SelectOption | null, language: SelectOption | null } | null => {
        try {
            const raw = localStorage.getItem(`${PROJECT_CONFIG_PREFIX}${projectId}`);
            if (!raw) return null;
            const parsed = JSON.parse(raw);

            const country = parsed.countryId ? COUNTRIES_OPTIONS.find(c => c.id === parsed.countryId) || null : null;
            const language = parsed.languageId ? LANGUAGES_OPTIONS.find(l => l.id === parsed.languageId) || null : null;

            return { country, language };
        } catch (e) {
            return null;
        }
    }
};