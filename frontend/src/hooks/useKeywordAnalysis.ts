import { useState, useEffect, useRef, useMemo } from 'react';
import { AnalyzedCategory, Category, GoogleAdsKeywordResponse, ForecastResponse, UnifiedKeywordResult } from '../types';
import { analysisService } from '../api/services/analysisService';
import { useTaskPoller } from './useTaskPoller';
import { cacheService } from '../utils/cacheService';

interface FreshDataContext {
    history: GoogleAdsKeywordResponse | null;
    forecast: ForecastResponse | null;
    countryId: string;
    languageId: string;
}

export const useKeywordAnalysis = (selection: Category[], countryId?: string, languageId?: string) => {

    const [freshData, setFreshData] = useState<FreshDataContext | null>(null);
    const [isFetchingHistory, setIsFetchingHistory] = useState(true);
    const [isForecasting, setIsForecasting] = useState(false);

    const lastConfigRef = useRef<string>("");

    // Track keywords currently being forecasted to handle missing results (Negative Caching)
    const pendingForecastKeywords = useRef<string[]>([]);

    // --- Poller for Forecast Task ---
    const poller = useTaskPoller<ForecastResponse>({
        onSuccess: (result) => {
            if (countryId && languageId) {
                // 1. Save to Cache
                cacheService.saveBatch(
                    countryId,
                    languageId,
                    [],
                    result.forecasts,
                    pendingForecastKeywords.current
                );

                // 2. Update State to Trigger Re-render
                setFreshData(prev => {
                    // Valid context check
                    const currentCid = prev?.countryId || countryId;
                    const currentLid = prev?.languageId || languageId;

                    if (currentCid === countryId && currentLid === languageId) {
                        return {
                            history: prev?.history || null, // Keep existing history or null
                            forecast: result,               // Inject new forecast
                            countryId,
                            languageId
                        };
                    }
                    return prev;
                });
            }
            pendingForecastKeywords.current = [];
            setIsForecasting(false);
        },
        onError: (err) => {
            console.error("Forecast task failed", err);
            pendingForecastKeywords.current = [];
            setIsForecasting(false);
            alert("Forecast Analysis failed. Please try again.");
        }
    });

    // --- Data Merging Logic ---
    const analyzedCategories = useMemo<AnalyzedCategory[]>(() => {
        if (!selection || !countryId || !languageId) return [];

        const allKeywords = selection.flatMap(c => c.groups.flatMap(g => g.keywords.map(k => k.text)));

        // Always read fresh from cache on every render
        const { found: cachedMap } = cacheService.getBatch(allKeywords, countryId, languageId);

        const isValidFresh = freshData && freshData.countryId === countryId && freshData.languageId === languageId;
        const validFreshHistory = isValidFresh ? freshData.history : null;
        const validFreshForecast = isValidFresh ? freshData.forecast : null;

        const getData = (text: string) => {
            const freshHistItem = validFreshHistory?.results.find(h => h.text === text)?.keyword_metrics;
            const freshFcItem = validFreshForecast?.forecasts.find(f => f.keyword === text);
            const cachedItem = cachedMap.get(text);

            return {
                // Priority: Fresh Data > Cache Data
                history: freshHistItem !== undefined ? freshHistItem : cachedItem?.history,
                forecast: freshFcItem !== undefined ? freshFcItem : cachedItem?.forecast
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
    }, [selection, countryId, languageId, freshData]); // freshData dependency ensures re-render on poll success

    // --- Main Orchestrator ---
    useEffect(() => {
        const executeAnalysisChain = async () => {
            if (!selection || selection.length === 0 || !countryId || !languageId) return;

            // ▼▼▼ FIX: Robust Config Signature (IDs based) instead of just length ▼▼▼
            // This ensures switching from "Group A" to "Group B" (same length) triggers a refresh.
            const selectionIdStr = JSON.stringify(
                selection.map(c => ({
                    id: c.id,
                    groups: c.groups.map(g => ({ id: g.id, kws: g.keywords.length }))
                }))
            );
            const configSignature = `${countryId}-${languageId}-${selectionIdStr}`;

            if (lastConfigRef.current === configSignature) return;

            lastConfigRef.current = configSignature;

            // Reset for new selection
            setFreshData(null);
            setIsFetchingHistory(true);
            setIsForecasting(false);
            pendingForecastKeywords.current = [];

            try {
                const allKeywords = Array.from(new Set(
                    selection.flatMap(c => c.groups.flatMap(g => g.keywords.map(k => k.text)))
                ));

                const { found: cachedMap } = cacheService.getBatch(allKeywords, countryId, languageId);

                const missingHistory = allKeywords.filter(k => !cachedMap.has(k));
                // Only forecast if strictly undefined (not fetched yet). If null, we tried and failed previously.
                const missingForecast = allKeywords.filter(k => cachedMap.get(k)?.forecast === undefined);

                // --- PHASE 1: HISTORY ---
                let currentHistoryData: GoogleAdsKeywordResponse | null = null;

                if (missingHistory.length > 0) {
                    const historyResponse = await analysisService.fetchHistoricalMetrics(
                        missingHistory,
                        languageId,
                        countryId
                    );

                    // Update State (Partial)
                    setFreshData({
                        history: historyResponse,
                        forecast: null,
                        countryId,
                        languageId
                    });

                    cacheService.saveBatch(countryId, languageId, historyResponse.results, [], missingHistory);
                    currentHistoryData = historyResponse;
                }

                setIsFetchingHistory(false);

                // --- PHASE 2: FORECAST ---
                if (missingForecast.length > 0) {
                    setIsForecasting(true);

                    const payloadResults: UnifiedKeywordResult[] = missingForecast.map(kw => {
                        // Use fresh history if available, otherwise fall back to cache
                        let metric = currentHistoryData?.results.find(r => r.text === kw)?.keyword_metrics;
                        if (!metric) {
                            metric = cachedMap.get(kw)?.history || null;
                        }
                        return { text: kw, keyword_metrics: metric };
                    })
                        .filter(item => item.keyword_metrics !== null);

                    if (payloadResults.length > 0) {
                        pendingForecastKeywords.current = payloadResults.map(p => p.text);

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