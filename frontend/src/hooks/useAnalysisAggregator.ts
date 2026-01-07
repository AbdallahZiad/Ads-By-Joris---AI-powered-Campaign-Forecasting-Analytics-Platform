import { useMemo } from 'react';
import { AnalyzedCategory, AnalyzedKeyword, AggregatedStats, TimeSeriesPoint } from '../types';
import { MONTH_MAP } from '../constants';

export const useAnalysisAggregator = (analyzedCategories: AnalyzedCategory[]) => {

    const aggregateKeywords = (keywords: AnalyzedKeyword[], id: string, name: string, type: 'CATEGORY' | 'GROUP', originalRef: any): AggregatedStats => {
        let totalVol = 0;
        let weightedCpc = 0;
        let weightedComp = 0;

        // ▼▼▼ FIX: Initialize as null to distinguish "No Data" from "0" ▼▼▼
        let sumForecastCurrent: number | null = null;

        let weightedYoY: number | null = null;
        let weighted1M: number | null = null;
        let weighted3M: number | null = null;
        let weighted6M: number | null = null;

        let totalForecastWeightVolume = 0;
        let validKeywordsCount = 0;
        let chartableKeywordsCount = 0;

        const historyMap = new Map<number, number>();
        const forecastMap = new Map<number, number>();

        keywords.forEach(kw => {
            const hasHistory = !!kw.history;
            const hasForecast = !!kw.forecast;

            if (hasHistory || hasForecast) {
                chartableKeywordsCount++;
            }

            const vol = kw.history?.avg_monthly_searches || 0;
            const cpc = kw.history?.average_cpc_micros || 0;
            const comp = kw.history?.competition_index || 0;

            // 1. Historical
            if (hasHistory) {
                totalVol += vol;
                weightedCpc += cpc * vol;
                weightedComp += comp * vol;
                validKeywordsCount++;

                kw.history?.monthly_search_volumes.forEach(pt => {
                    const ts = Date.UTC(pt.year, MONTH_MAP[pt.month], 1);
                    historyMap.set(ts, (historyMap.get(ts) || 0) + pt.monthly_searches);
                });
            }

            // 2. Forecast
            if (hasForecast && kw.forecast) {
                const curVol = kw.forecast.current_month_expected_volume || 0;

                // ▼▼▼ FIX: Correctly accumulate sum (init to 0 if null) ▼▼▼
                sumForecastCurrent = (sumForecastCurrent || 0) + curVol;

                const weight = curVol > 0 ? curVol : (vol > 0 ? vol : 1);
                totalForecastWeightVolume += weight;

                const addTo = (acc: number | null, val: number | null | undefined) => {
                    const v = val || 0;
                    return (acc === null ? 0 : acc) + (v * weight);
                };

                weightedYoY = addTo(weightedYoY, kw.forecast.annual_growth_rate);
                weighted1M = addTo(weighted1M, kw.forecast.expected_increase_1m);
                weighted3M = addTo(weighted3M, kw.forecast.expected_increase_3m);
                weighted6M = addTo(weighted6M, kw.forecast.expected_increase_6m);

                kw.forecast.forecast_series.forEach(pt => {
                    const ts = Date.UTC(pt.year, MONTH_MAP[pt.month], 1);
                    forecastMap.set(ts, (forecastMap.get(ts) || 0) + pt.search_volume_forecast);
                });
            }
        });

        // Averages
        const avgCpc = totalVol > 0 ? weightedCpc / totalVol : (validKeywordsCount > 0 ? weightedCpc : 0);
        const avgComp = totalVol > 0 ? weightedComp / totalVol : (validKeywordsCount > 0 ? weightedComp : 0);

        const safeForecastWeight = totalForecastWeightVolume > 0 ? totalForecastWeightVolume : 1;

        // Series
        const historySeries: TimeSeriesPoint[] = Array.from(historyMap.entries())
            .map(([date, value]) => ({ date, value }))
            .sort((a, b) => a.date - b.date);

        const forecastSeries: TimeSeriesPoint[] = Array.from(forecastMap.entries())
            .map(([date, value]) => ({ date, value }))
            .sort((a, b) => a.date - b.date);

        return {
            id,
            name,
            type,
            itemCount: keywords.length,
            validItemCount: chartableKeywordsCount,
            totalVolume: totalVol,
            avgCpc: avgCpc,
            avgCompetition: avgComp,

            // Cast to number|null is handled by renderStat downstream
            forecastCurrent: sumForecastCurrent as any,

            forecastYoY: weightedYoY !== null ? weightedYoY / safeForecastWeight : null as any,
            forecast1M: weighted1M !== null ? weighted1M / safeForecastWeight : null as any,
            forecast3M: weighted3M !== null ? weighted3M / safeForecastWeight : null as any,
            forecast6M: weighted6M !== null ? weighted6M / safeForecastWeight : null as any,

            historySeries,
            forecastSeries,

            labels: [],
            originalRef
        };
    };

    const rootStats = useMemo(() => {
        return analyzedCategories.map(cat => {
            const allKeywords = cat.groups.flatMap(g => g.keywords);
            return aggregateKeywords(allKeywords, cat.id, cat.name, 'CATEGORY', cat);
        });
    }, [analyzedCategories]);

    const getGroupStatsForCategory = (categoryId: string) => {
        const category = analyzedCategories.find(c => c.id === categoryId);
        if (!category) return [];

        return category.groups.map(grp => {
            return aggregateKeywords(grp.keywords, grp.id, grp.name, 'GROUP', grp);
        });
    };

    const projectTotals = useMemo(() => {
        return rootStats.reduce((acc, curr) => ({
            totalVolume: acc.totalVolume + curr.totalVolume,
            totalKeywords: acc.totalKeywords + curr.itemCount,
            avgGrowth: Math.max(acc.avgGrowth, curr.forecastYoY || 0)
        }), { totalVolume: 0, totalKeywords: 0, avgGrowth: 0 });
    }, [rootStats]);

    return {
        rootStats,
        getGroupStatsForCategory,
        projectTotals
    };
};