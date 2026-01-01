import { useMemo } from 'react';
import { AnalyzedCategory, AnalyzedKeyword, AggregatedStats } from '../types';

/**
 * Calculates aggregated statistics for hierarchical data.
 * Updates: Now calculates Weighted Averages for Forecast Deltas.
 */
export const useAnalysisAggregator = (analyzedCategories: AnalyzedCategory[]) => {

    const aggregateKeywords = (keywords: AnalyzedKeyword[], id: string, name: string, type: 'CATEGORY' | 'GROUP', originalRef: any): AggregatedStats => {
        let totalVol = 0;
        let totalCpc = 0;
        let totalComp = 0;

        // Forecast Accumulators (Weighted)
        let sumForecastCurrent = 0;
        let weightedYoY = 0;
        let weighted1M = 0;
        let weighted3M = 0;
        let weighted6M = 0;

        // Denominator for weighting (Total Volume of keywords that have valid forecast data)
        let totalForecastWeightVolume = 0;

        let validKeywordsCount = 0;

        keywords.forEach(kw => {
            const vol = kw.history?.avg_monthly_searches || 0;
            const cpc = kw.history?.average_cpc_micros || 0;
            const comp = kw.history?.competition_index || 0;
            const hasHistory = !!kw.history;

            // Historical Aggregation
            if (hasHistory) {
                totalVol += vol;
                totalCpc += cpc; // Simple sum for now, usually avg requires division
                totalComp += comp;
                validKeywordsCount++;
            }

            // Forecast Aggregation (Weighted by Volume)
            if (kw.forecast) {
                const curVol = kw.forecast.current_month_expected_volume || 0;
                sumForecastCurrent += curVol;

                // We use current volume as weight. If 0, we use 1 to avoid data loss if all are 0.
                const weight = curVol > 0 ? curVol : (vol > 0 ? vol : 1);

                totalForecastWeightVolume += weight;

                weightedYoY += (kw.forecast.annual_growth_rate || 0) * weight;
                weighted1M += (kw.forecast.expected_increase_1m || 0) * weight;
                weighted3M += (kw.forecast.expected_increase_3m || 0) * weight;
                weighted6M += (kw.forecast.expected_increase_6m || 0) * weight;
            }
        });

        // Calculate Averages
        const avgCpc = validKeywordsCount > 0 ? totalCpc / validKeywordsCount : 0;
        const avgComp = validKeywordsCount > 0 ? totalComp / validKeywordsCount : 0;

        // Calculate Weighted Forecast Averages
        const safeWeight = totalForecastWeightVolume > 0 ? totalForecastWeightVolume : 1;

        return {
            id,
            name,
            type,
            itemCount: keywords.length,
            totalVolume: totalVol,
            avgCpc: avgCpc,
            avgCompetition: avgComp,

            // New Aggregated Forecasts
            forecastCurrent: sumForecastCurrent,
            forecastYoY: weightedYoY / safeWeight,
            forecast1M: weighted1M / safeWeight,
            forecast3M: weighted3M / safeWeight,
            forecast6M: weighted6M / safeWeight,

            labels: [],
            originalRef
        };
    };

    // 1. Root Level Aggregation (List of Categories)
    const rootStats = useMemo(() => {
        return analyzedCategories.map(cat => {
            const allKeywords = cat.groups.flatMap(g => g.keywords);
            return aggregateKeywords(allKeywords, cat.id, cat.name, 'CATEGORY', cat);
        });
    }, [analyzedCategories]);

    // 2. Category Level Aggregation (List of Groups)
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
            // Use weighted avg for project wide growth
            avgGrowth: Math.max(acc.avgGrowth, curr.forecastYoY)
        }), { totalVolume: 0, totalKeywords: 0, avgGrowth: 0 });
    }, [rootStats]);

    return {
        rootStats,
        getGroupStatsForCategory,
        projectTotals
    };
};