import { useState, useEffect, useMemo } from 'react';
import { Category, AnalyzedCategory, UnifiedKeywordResult, KeywordForecast, AnalyzedKeyword } from '../types';
import { mockApi } from '../api/mockApi';
import { normalize } from '../utils/text';

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

        // Log to show the settings have arrived (we will use these in API calls later)
        console.log("HOOK: Fetching data with settings:", { countryId, languageId });

        setIsLoading(prev => ({ ...prev, history: true }));
        mockApi.fetchHistory(keywordList).then(results => {
            const newMap = new Map<string, UnifiedKeywordResult>();
            results.forEach(r => newMap.set(normalize(r.text), r));
            setHistoryData(newMap);
            setIsLoading(prev => ({ ...prev, history: false }));
        });

        setIsLoading(prev => ({ ...prev, forecast: true }));
        mockApi.fetchForecast(keywordList).then(results => {
            const newMap = new Map<string, KeywordForecast>();
            results.forEach(r => newMap.set(normalize(r.keyword), r));
            setForecastData(newMap);
            setIsLoading(prev => ({ ...prev, forecast: false }));
        });
        // Add countryId and languageId to dependency array
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
                    const historyEntry = isLoading.history ? undefined : (historyData.get(kNorm)?.keyword_metrics || null);
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