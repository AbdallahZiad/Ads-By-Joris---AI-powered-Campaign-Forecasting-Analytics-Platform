import { useState, useEffect, useMemo } from 'react';
import { Category, AnalyzedCategory, UnifiedKeywordResult, KeywordForecast, AnalyzedKeyword } from '../types';
import { mockApi } from '../api/mockApi';
import { normalize } from '../utils/text';
import { MetricsCache } from '../utils/metricsCache';

export const useKeywordAnalysis = (
    selection: Category[],
    countryId?: string,
    languageId?: string
) => {
    const [historyData, setHistoryData] = useState<Map<string, UnifiedKeywordResult>>(new Map());
    const [forecastData, setForecastData] = useState<Map<string, KeywordForecast>>(new Map());
    const [isLoading, setIsLoading] = useState({ history: false, forecast: false });

    useEffect(() => {
        const allKeywords = new Set<string>();
        selection.forEach(cat =>
            cat.groups.forEach(grp =>
                grp.keywords.forEach(k => allKeywords.add(k))
            )
        );
        const keywordList = Array.from(allKeywords);

        if (keywordList.length === 0) return;

        console.log("HOOK: Checking cache and fetching data...", { countryId, languageId });

        // --- 1. HISTORY (Check Cache First) ---
        setIsLoading(prev => ({ ...prev, history: true }));

        // Identify what we already have vs what we need to fetch
        const missingForHistory = MetricsCache.getMissingKeywords(keywordList);

        // Initialize map with cached data immediately
        const initialHistoryMap = new Map<string, UnifiedKeywordResult>();
        keywordList.forEach(k => {
            const cached = MetricsCache.get(k);
            if (cached) {
                initialHistoryMap.set(normalize(k), { text: k, keyword_metrics: cached });
            }
        });

        if (missingForHistory.length > 0) {
            // Fetch only missing
            mockApi.fetchHistory(missingForHistory).then(results => {
                // Cache the new results
                MetricsCache.cacheResults(results);

                // Combine cached + new results
                const finalMap = new Map(initialHistoryMap);
                results.forEach(r => finalMap.set(normalize(r.text), r));

                setHistoryData(finalMap);
                setIsLoading(prev => ({ ...prev, history: false }));
            });
        } else {
            // Everything was cached!
            setHistoryData(initialHistoryMap);
            setIsLoading(prev => ({ ...prev, history: false }));
        }

        // --- 2. FORECAST (Always fetch for now, or implement similar cache if needed) ---
        setIsLoading(prev => ({ ...prev, forecast: true }));
        mockApi.fetchForecast(keywordList).then(results => {
            const newMap = new Map<string, KeywordForecast>();
            results.forEach(r => newMap.set(normalize(r.keyword), r));
            setForecastData(newMap);
            setIsLoading(prev => ({ ...prev, forecast: false }));
        });

    }, [selection, countryId, languageId]);

    // The "Inflator"
    const analyzedCategories: AnalyzedCategory[] = useMemo(() => {
        return selection.map(cat => ({
            id: cat.id,
            name: cat.name,
            groups: cat.groups.map(grp => ({
                id: grp.id,
                name: grp.name,
                keywords: grp.keywords.map(k => {
                    const kNorm = normalize(k);

                    const historyResult = historyData.get(kNorm);
                    const historyEntry = isLoading.history
                        ? undefined
                        : (historyResult ? historyResult.keyword_metrics : null);

                    const forecastEntry = isLoading.forecast ? undefined : (forecastData.get(kNorm) || null);

                    return {
                        text: k,
                        history: historyEntry,
                        forecast: forecastEntry
                    } as AnalyzedKeyword;
                })
            }))
        }));
    }, [selection, historyData, forecastData, isLoading]);

    return {
        analyzedCategories,
        isLoading
    };
};