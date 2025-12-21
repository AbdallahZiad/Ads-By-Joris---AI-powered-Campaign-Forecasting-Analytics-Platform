import { useState, useEffect, useRef, useMemo } from 'react';
import { AnalyzedCategory, Category, GoogleAdsKeywordResponse, ForecastResponse, UnifiedKeywordResult } from '../types';
import { analysisService } from '../api/services/analysisService';
import { useTaskPoller } from './useTaskPoller';
import { cacheService } from '../utils/cacheService';

export const useKeywordAnalysis = (selection: Category[], countryId?: string, languageId?: string) => {

    // API State
    const [freshHistory, setFreshHistory] = useState<GoogleAdsKeywordResponse | null>(null);
    const [freshForecast, setFreshForecast] = useState<ForecastResponse | null>(null);

    // Precise Loading States
    const [isFetchingHistory, setIsFetchingHistory] = useState(true);
    const [isForecasting, setIsForecasting] = useState(false); // Covers submitting + polling

    const hasStartedRef = useRef(false);

    // --- Poller for Forecast Task ---
    const poller = useTaskPoller<ForecastResponse>({
        onSuccess: (result) => {
            // Save to cache (Merge happens in service)
            if (countryId && languageId) {
                // We pass empty history array because we are only updating forecasts here
                cacheService.saveBatch(countryId, languageId, [], result.forecasts);
            }
            setFreshForecast(result);
            setIsForecasting(false);
        },
        onError: (err) => {
            console.error("Forecast task failed", err);
            setIsForecasting(false);
            alert("Forecast Analysis failed. Please try again.");
        }
    });

    // --- Data Merging Logic (Reactive) ---
    // Builds the final tree from Cache + Fresh Data
    const analyzedCategories = useMemo<AnalyzedCategory[]>(() => {
        if (!selection || !countryId || !languageId) return [];

        const allKeywords = selection.flatMap(c => c.groups.flatMap(g => g.keywords.map(k => k.text)));
        const { found: cachedMap } = cacheService.getBatch(allKeywords, countryId, languageId);

        const getData = (text: string) => {
            const freshHistItem = freshHistory?.results.find(h => h.text === text)?.keyword_metrics;
            const freshFcItem = freshForecast?.forecasts.find(f => f.keyword === text);
            const cachedItem = cachedMap.get(text);

            return {
                history: freshHistItem || cachedItem?.history || null,
                forecast: freshFcItem || cachedItem?.forecast || null
            };
        };

        return selection.map(cat => ({
            id: cat.id,
            name: cat.name,
            groups: cat.groups.map(grp => ({
                id: grp.id,
                name: grp.name,
                keywords: grp.keywords.map(k => {
                    const data = getData(k.text);
                    return {
                        text: k.text,
                        history: data.history,
                        forecast: data.forecast
                    };
                })
            }))
        }));
    }, [selection, countryId, languageId, freshHistory, freshForecast]);

    // --- Main Orchestrator ---
    useEffect(() => {
        const executeAnalysisChain = async () => {
            if (!selection || selection.length === 0 || !countryId || !languageId || hasStartedRef.current) return;

            hasStartedRef.current = true;
            setIsFetchingHistory(true);

            try {
                const allKeywords = Array.from(new Set(
                    selection.flatMap(c => c.groups.flatMap(g => g.keywords.map(k => k.text)))
                ));

                // 1. Check Cache
                const { found: cachedMap } = cacheService.getBatch(allKeywords, countryId, languageId);

                // 2. Identify Missing Data
                const missingHistory = allKeywords.filter(k => !cachedMap.get(k)?.history);
                const missingForecast = allKeywords.filter(k => !cachedMap.get(k)?.forecast);

                // --- PHASE 1: HISTORY ---
                let currentHistoryData: GoogleAdsKeywordResponse | null = null;

                if (missingHistory.length > 0) {
                    const historyResponse = await analysisService.fetchHistoricalMetrics(
                        missingHistory,
                        languageId,
                        countryId
                    );
                    setFreshHistory(historyResponse);

                    // Save history immediately so we don't lose it if forecast fails
                    cacheService.saveBatch(countryId, languageId, historyResponse.results, []);

                    currentHistoryData = historyResponse;
                }

                // Done with History Phase
                setIsFetchingHistory(false);

                // --- PHASE 2: FORECAST ---
                if (missingForecast.length > 0) {
                    setIsForecasting(true);

                    // We need to build a full payload for the Forecast AI.
                    // This includes History for the keywords we want to forecast.
                    // Source can be: Newly fetched history OR Cached history.

                    const payloadResults: UnifiedKeywordResult[] = missingForecast.map(kw => {
                        // Try fresh first
                        const freshMetric = currentHistoryData?.results.find(r => r.text === kw)?.keyword_metrics;
                        // Fallback to cache
                        const cachedMetric = cachedMap.get(kw)?.history;

                        return {
                            text: kw,
                            keyword_metrics: freshMetric || cachedMetric || null
                        };
                    }).filter(item => item.keyword_metrics !== null); // Ensure we only send valid data

                    if (payloadResults.length > 0) {
                        const taskResponse = await analysisService.startForecast({
                            google_ads_data: { results: payloadResults },
                            forecast_months: 12
                        });
                        // Hand off to poller
                        poller.startPolling(taskResponse.task_id);
                    } else {
                        // Should not happen if logic is correct, but safe exit
                        setIsForecasting(false);
                    }
                }

            } catch (err) {
                console.error("Analysis chain failed", err);
                setIsFetchingHistory(false);
                setIsForecasting(false);
                alert("Failed to retrieve data.");
            }
        };

        executeAnalysisChain();

        return () => {
            poller.stopPolling();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return {
        analyzedCategories,
        isLoading: {
            history: isFetchingHistory,
            forecast: isForecasting || poller.isLoading
        }
    };
};