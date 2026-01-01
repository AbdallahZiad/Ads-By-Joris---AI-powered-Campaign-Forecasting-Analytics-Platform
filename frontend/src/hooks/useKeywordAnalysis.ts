import { useState, useEffect, useRef, useMemo } from 'react';
import { AnalyzedCategory, Category, GoogleAdsKeywordResponse, ForecastResponse, UnifiedKeywordResult } from '../types';
import { analysisService } from '../api/services/analysisService';
import { useTaskPoller } from './useTaskPoller';
import { cacheService } from '../utils/cacheService';

// Wrapper to strictly couple data with its source configuration
interface FreshDataContext {
    history: GoogleAdsKeywordResponse | null;
    forecast: ForecastResponse | null;
    countryId: string;
    languageId: string;
}

export const useKeywordAnalysis = (selection: Category[], countryId?: string, languageId?: string) => {

    // API State: Now strict-typed with context
    const [freshData, setFreshData] = useState<FreshDataContext | null>(null);

    // Precise Loading States
    const [isFetchingHistory, setIsFetchingHistory] = useState(true);
    const [isForecasting, setIsForecasting] = useState(false);

    // Config Signature Tracking to prevent loop but allow re-runs
    const lastConfigRef = useRef<string>("");

    // --- Poller for Forecast Task ---
    const poller = useTaskPoller<ForecastResponse>({
        onSuccess: (result) => {
            // Save to cache (only if context matches current)
            if (countryId && languageId) {
                cacheService.saveBatch(countryId, languageId, [], result.forecasts);

                // Update state, but only if we are still on the same config
                setFreshData(prev => {
                    if (prev && prev.countryId === countryId && prev.languageId === languageId) {
                        return { ...prev, forecast: result };
                    }
                    return prev;
                });
            }
            setIsForecasting(false);
        },
        onError: (err) => {
            console.error("Forecast task failed", err);
            setIsForecasting(false);
            alert("Forecast Analysis failed. Please try again.");
        }
    });

    // --- Data Merging Logic (Reactive & Strict) ---
    const analyzedCategories = useMemo<AnalyzedCategory[]>(() => {
        if (!selection || !countryId || !languageId) return [];

        // 1. Get Keywords
        const allKeywords = selection.flatMap(c => c.groups.flatMap(g => g.keywords.map(k => k.text)));

        // 2. Get Cache (Strictly scoped to current Country/Lang)
        const { found: cachedMap } = cacheService.getBatch(allKeywords, countryId, languageId);

        // 3. Extract Fresh Data (Strictly validated against current Country/Lang)
        // If the fresh data belongs to a previous config (e.g. US), ignore it immediately.
        const isValidFresh = freshData && freshData.countryId === countryId && freshData.languageId === languageId;
        const validFreshHistory = isValidFresh ? freshData.history : null;
        const validFreshForecast = isValidFresh ? freshData.forecast : null;

        const getData = (text: string) => {
            const freshHistItem = validFreshHistory?.results.find(h => h.text === text)?.keyword_metrics;
            const freshFcItem = validFreshForecast?.forecasts.find(f => f.keyword === text);
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
    }, [selection, countryId, languageId, freshData]);

    // --- Main Orchestrator ---
    useEffect(() => {
        const executeAnalysisChain = async () => {
            // 1. Basic Validation
            if (!selection || selection.length === 0 || !countryId || !languageId) return;

            // 2. Change Detection
            const configSignature = `${countryId}-${languageId}-${selection.length}`;
            if (lastConfigRef.current === configSignature) return;

            lastConfigRef.current = configSignature;

            // 3. Reset State & Loading (Start Fresh)
            setFreshData(null);
            setIsFetchingHistory(true);
            setIsForecasting(false);

            try {
                const allKeywords = Array.from(new Set(
                    selection.flatMap(c => c.groups.flatMap(g => g.keywords.map(k => k.text)))
                ));

                // 4. Check Cache
                const { found: cachedMap } = cacheService.getBatch(allKeywords, countryId, languageId);

                // 5. Identify Missing Data
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

                    // Save to State (Stamped with Context)
                    setFreshData({
                        history: historyResponse,
                        forecast: null,
                        countryId,
                        languageId
                    });

                    // Save to Cache
                    cacheService.saveBatch(countryId, languageId, historyResponse.results, []);
                    currentHistoryData = historyResponse;
                }

                setIsFetchingHistory(false);

                // --- PHASE 2: FORECAST ---
                if (missingForecast.length > 0) {
                    setIsForecasting(true);

                    const payloadResults: UnifiedKeywordResult[] = missingForecast.map(kw => {
                        const freshMetric = currentHistoryData?.results.find(r => r.text === kw)?.keyword_metrics;
                        const cachedMetric = cachedMap.get(kw)?.history;

                        return {
                            text: kw,
                            keyword_metrics: freshMetric || cachedMetric || null
                        };
                    }).filter(item => item.keyword_metrics !== null);

                    if (payloadResults.length > 0) {
                        const taskResponse = await analysisService.startForecast({
                            google_ads_data: { results: payloadResults },
                            forecast_months: 12
                        });
                        poller.startPolling(taskResponse.task_id);
                    } else {
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
    }, [countryId, languageId, selection]);

    return {
        analyzedCategories,
        isLoading: {
            history: isFetchingHistory,
            forecast: isForecasting || poller.isLoading
        }
    };
};