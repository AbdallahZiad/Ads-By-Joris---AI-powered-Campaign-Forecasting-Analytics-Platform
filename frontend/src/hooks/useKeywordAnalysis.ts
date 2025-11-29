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
        selection.forEach(cat =>
            cat.groups.forEach(grp =>
                grp.keywords.forEach(k => allKeywords.add(k))
            )
        );
        const keywordList = Array.from(allKeywords);

        if (keywordList.length === 0 || !countryId || !languageId) return;

        const runAnalysisPipeline = async () => {
            console.log("HOOK: Starting Analysis Pipeline...", { count: keywordList.length, countryId, languageId });

            // --- STEP 1: HISTORY (Context-Aware Cache + API) ---
            setLoadingState(prev => ({ ...prev, history: true }));

            // Map to hold the final set of history (Cached + Fetched)
            // Key: Normalized keyword string (used for UI lookups)
            const currentSessionHistoryMap = new Map<string, UnifiedKeywordResult>();
            const validHistoryForNextStep: UnifiedKeywordResult[] = [];

            try {
                // A. Retrieve Valid Cached Items
                keywordList.forEach(k => {
                    const cachedMetrics = HistoryCache.get(k, countryId, languageId);
                    if (cachedMetrics) {
                        const result = { text: k, keyword_metrics: cachedMetrics };
                        currentSessionHistoryMap.set(normalize(k), result);
                        validHistoryForNextStep.push(result);
                    }
                });

                // B. Identify Missing (Context Specific)
                const missingForHistory = HistoryCache.getMissing(keywordList, countryId, languageId);

                // C. Fetch Missing
                if (missingForHistory.length > 0) {
                    const response = await fetchHistory({
                        keywords: missingForHistory,
                        languageId,
                        countryId
                    });

                    // Cache the new results using the helper
                    cacheHistoryBatch(response.results, countryId, languageId);

                    // Add to current session map
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

            // --- STEP 2: FORECAST (Context-Aware Cache + API) ---
            setLoadingState(prev => ({ ...prev, forecast: true }));

            try {
                const currentSessionForecastMap = new Map<string, KeywordForecast>();

                // A. Retrieve Cached Forecasts
                const keywordsNeedingForecast: UnifiedKeywordResult[] = [];

                validHistoryForNextStep.forEach(historyItem => {
                    // Check if we already have a forecast for this specific context
                    const cachedForecast = ForecastCache.get(historyItem.text, countryId, languageId);

                    if (cachedForecast) {
                        currentSessionForecastMap.set(normalize(historyItem.text), cachedForecast);
                    } else if (historyItem.keyword_metrics !== null) {
                        // Only fetch if history exists AND forecast is missing
                        keywordsNeedingForecast.push(historyItem);
                    }
                });

                // B. Fetch Missing Forecasts
                if (keywordsNeedingForecast.length > 0) {
                    const forecastResponse = await fetchForecast(keywordsNeedingForecast);

                    forecastResponse.forecasts.forEach(fc => {
                        // Cache the new forecast
                        ForecastCache.set(fc.keyword, countryId, languageId, fc);
                        // Add to current UI state
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

    // The "Inflator" - Maps data back to the UI structure
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
                    const historyEntry = loadingState.history
                        ? undefined
                        : (historyResult ? historyResult.keyword_metrics : null);

                    const forecastEntry = loadingState.forecast
                        ? undefined
                        : (forecastData.get(kNorm) || null);

                    return {
                        text: k,
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