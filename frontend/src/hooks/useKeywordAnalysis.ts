import { useState, useEffect, useMemo } from 'react';
import { Category, AnalyzedCategory, UnifiedKeywordResult, KeywordForecast, AnalyzedKeyword } from '../types';
import { normalize } from '../utils/text';
import { HistoryCache, ForecastCache, cacheHistoryBatch } from '../utils/cacheService';
import { useAnalysis } from './useAnalysis';

export const useKeywordAnalysis = (
    selection: Category[],
    countryId?: string,
    languageId?: string
) => {
    const [historyData, setHistoryData] = useState<Map<string, UnifiedKeywordResult>>(new Map());
    const [forecastData, setForecastData] = useState<Map<string, KeywordForecast>>(new Map());

    const { fetchHistory, fetchForecast } = useAnalysis();
    const [loadingState, setLoadingState] = useState({ history: false, forecast: false });

    useEffect(() => {
        const allKeywords = new Set<string>();

        // ▼▼▼ FIX: Handle Keyword Objects vs Strings ▼▼▼
        selection.forEach(cat =>
            cat.groups.forEach(grp =>
                grp.keywords.forEach(k => {
                    // Check if it's an object (new structure) or string (legacy/scan)
                    const text = typeof k === 'string' ? k : k.text;
                    allKeywords.add(text);
                })
            )
        );
        const keywordList = Array.from(allKeywords);

        if (keywordList.length === 0 || !countryId || !languageId) return;

        const runAnalysisPipeline = async () => {
            console.log("HOOK: Starting Analysis Pipeline...", { count: keywordList.length, countryId, languageId });

            // --- STEP 1: HISTORY ---
            setLoadingState(prev => ({ ...prev, history: true }));

            const currentSessionHistoryMap = new Map<string, UnifiedKeywordResult>();
            const validHistoryForNextStep: UnifiedKeywordResult[] = [];

            try {
                // A. Retrieve Cached
                keywordList.forEach(k => {
                    const cachedMetrics = HistoryCache.get(k, countryId, languageId);
                    if (cachedMetrics) {
                        const result = { text: k, keyword_metrics: cachedMetrics };
                        currentSessionHistoryMap.set(normalize(k), result);
                        validHistoryForNextStep.push(result);
                    }
                });

                // B. Fetch Missing
                const missingForHistory = HistoryCache.getMissing(keywordList, countryId, languageId);

                if (missingForHistory.length > 0) {
                    const response = await fetchHistory({
                        keywords: missingForHistory,
                        languageId,
                        countryId
                    });

                    cacheHistoryBatch(response.results, countryId, languageId);

                    response.results.forEach(r => {
                        currentSessionHistoryMap.set(normalize(r.text), r);
                        validHistoryForNextStep.push(r);
                    });
                }

                setHistoryData(currentSessionHistoryMap);
                setLoadingState(prev => ({ ...prev, history: false }));

            } catch (err) {
                console.error("History pipeline failed", err);
                setLoadingState(prev => ({ ...prev, history: false }));
                return;
            }

            // --- STEP 2: FORECAST ---
            setLoadingState(prev => ({ ...prev, forecast: true }));

            try {
                const currentSessionForecastMap = new Map<string, KeywordForecast>();
                const keywordsNeedingForecast: UnifiedKeywordResult[] = [];

                validHistoryForNextStep.forEach(historyItem => {
                    const cachedForecast = ForecastCache.get(historyItem.text, countryId, languageId);

                    if (cachedForecast) {
                        currentSessionForecastMap.set(normalize(historyItem.text), cachedForecast);
                    } else if (historyItem.keyword_metrics !== null) {
                        keywordsNeedingForecast.push(historyItem);
                    }
                });

                if (keywordsNeedingForecast.length > 0) {
                    const forecastResponse = await fetchForecast(keywordsNeedingForecast);

                    forecastResponse.forecasts.forEach(fc => {
                        ForecastCache.set(fc.keyword, countryId, languageId, fc);
                        currentSessionForecastMap.set(normalize(fc.keyword), fc);
                    });
                }

                setForecastData(currentSessionForecastMap);

            } catch (err) {
                console.error("Forecast pipeline failed", err);
            } finally {
                setLoadingState(prev => ({ ...prev, forecast: false }));
            }
        };

        runAnalysisPipeline();

    }, [selection, countryId, languageId, fetchHistory, fetchForecast]);

    // The "Inflator"
    const analyzedCategories: AnalyzedCategory[] = useMemo(() => {
        return selection.map(cat => ({
            id: cat.id,
            name: cat.name,
            groups: cat.groups.map(grp => ({
                id: grp.id,
                name: grp.name,
                keywords: grp.keywords.map(k => {
                    // ▼▼▼ FIX: Handle Object Property Access ▼▼▼
                    const text = typeof k === 'string' ? k : k.text;
                    const kNorm = normalize(text);

                    const historyResult = historyData.get(kNorm);
                    const historyEntry = loadingState.history
                        ? undefined
                        : (historyResult ? historyResult.keyword_metrics : null);

                    const forecastEntry = loadingState.forecast
                        ? undefined
                        : (forecastData.get(kNorm) || null);

                    return {
                        text: text,
                        history: historyEntry,
                        forecast: forecastEntry
                    } as AnalyzedKeyword;
                })
            }))
        }));
    }, [selection, historyData, forecastData, loadingState]);

    return {
        analyzedCategories,
        isLoading: loadingState
    };
};