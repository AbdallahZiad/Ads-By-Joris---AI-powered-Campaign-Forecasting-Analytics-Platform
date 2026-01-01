import { useMemo } from 'react';
import { AnalyzedCategory, AnalyzedKeyword, AggregatedStats, TimeSeriesPoint } from '../types';
import { MONTH_MAP } from '../constants';

export const useAnalysisAggregator = (analyzedCategories: AnalyzedCategory[]) => {

    const aggregateKeywords = (keywords: AnalyzedKeyword[], id: string, name: string, type: 'CATEGORY' | 'GROUP', originalRef: any): AggregatedStats => {
        let totalVol = 0;
        let weightedCpc = 0;
        let weightedComp = 0;

        let sumForecastCurrent = 0;
        let weightedYoY = 0;
        let weighted1M = 0;
        let weighted3M = 0;
        let weighted6M = 0;

        let totalForecastWeightVolume = 0;
        let validKeywordsCount = 0; // For Historical Averages
        let chartableKeywordsCount = 0; // For Checkbox Disabling (Any valid data)

        // Series Aggregation Maps
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

            // --- 1. Historical Aggregation ---
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

            // --- 2. Forecast Aggregation ---
            if (hasForecast && kw.forecast) {
                const curVol = kw.forecast.current_month_expected_volume || 0;
                sumForecastCurrent += curVol;

                const weight = curVol > 0 ? curVol : (vol > 0 ? vol : 1);
                totalForecastWeightVolume += weight;

                weightedYoY += (kw.forecast.annual_growth_rate || 0) * weight;
                weighted1M += (kw.forecast.expected_increase_1m || 0) * weight;
                weighted3M += (kw.forecast.expected_increase_3m || 0) * weight;
                weighted6M += (kw.forecast.expected_increase_6m || 0) * weight;

                kw.forecast.forecast_series.forEach(pt => {
                    const ts = Date.UTC(pt.year, MONTH_MAP[pt.month], 1);
                    forecastMap.set(ts, (forecastMap.get(ts) || 0) + pt.search_volume_forecast);
                });
            }
        });

        // Calculate Weighted Averages
        const avgCpc = totalVol > 0 ? weightedCpc / totalVol : (validKeywordsCount > 0 ? weightedCpc : 0);
        const avgComp = totalVol > 0 ? weightedComp / totalVol : (validKeywordsCount > 0 ? weightedComp : 0);

        const safeForecastWeight = totalForecastWeightVolume > 0 ? totalForecastWeightVolume : 1;

        // Convert Maps to Arrays
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
            validItemCount: chartableKeywordsCount, // ▼▼▼ NEW ▼▼▼
            totalVolume: totalVol,
            avgCpc: avgCpc,
            avgCompetition: avgComp,

            forecastCurrent: sumForecastCurrent,
            forecastYoY: weightedYoY / safeForecastWeight,
            forecast1M: weighted1M / safeForecastWeight,
            forecast3M: weighted3M / safeForecastWeight,
            forecast6M: weighted6M / safeForecastWeight,

            historySeries,
            forecastSeries,

            labels: [],
            originalRef
        };
    };

    // 1. Root Level
    const rootStats = useMemo(() => {
        return analyzedCategories.map(cat => {
            const allKeywords = cat.groups.flatMap(g => g.keywords);
            return aggregateKeywords(allKeywords, cat.id, cat.name, 'CATEGORY', cat);
        });
    }, [analyzedCategories]);

    // 2. Category Level
    const getGroupStatsForCategory = (categoryId: string) => {
        const category = analyzedCategories.find(c => c.id === categoryId);
        if (!category) return [];

        return category.groups.map(grp => {
            return aggregateKeywords(grp.keywords, grp.id, grp.name, 'GROUP', grp);
        });
    };

    // 3. Project Totals
    const projectTotals = useMemo(() => {
        return rootStats.reduce((acc, curr) => ({
            totalVolume: acc.totalVolume + curr.totalVolume,
            totalKeywords: acc.totalKeywords + curr.itemCount,
            avgGrowth: Math.max(acc.avgGrowth, curr.forecastYoY)
        }), { totalVolume: 0, totalKeywords: 0, avgGrowth: 0 });
    }, [rootStats]);

    return {
        rootStats,
        getGroupStatsForCategory,
        projectTotals
    };
};