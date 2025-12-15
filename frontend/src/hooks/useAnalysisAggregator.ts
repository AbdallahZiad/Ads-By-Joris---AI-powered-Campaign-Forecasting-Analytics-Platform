import { useMemo } from 'react';
import { AnalyzedCategory, AnalyzedKeyword, AggregatedStats } from '../types';

/**
 * Calculates aggregated statistics for hierarchical data (Categories -> Groups -> Keywords).
 * This powers the Level 1 and Level 2 views of the Analysis Dashboard.
 */
export const useAnalysisAggregator = (analyzedCategories: AnalyzedCategory[]) => {

    // Helper: Calculate stats for a single keyword
    const getKeywordStats = (kw: AnalyzedKeyword) => ({
        vol: kw.history?.avg_monthly_searches || 0,
        cpc: kw.history?.average_cpc_micros || 0, // In micros
        comp: kw.history?.competition_index || 0,
        growth: kw.forecast?.annual_growth_rate || 0,
        hasData: !!kw.history
    });

    // Helper: Aggregate a list of keywords into one stats object
    const aggregateKeywords = (keywords: AnalyzedKeyword[], id: string, name: string, type: 'CATEGORY' | 'GROUP', originalRef: any): AggregatedStats => {
        let totalVol = 0;
        let totalCpc = 0;
        let totalComp = 0;
        let maxGrowth = -Infinity;
        let validKeywordsCount = 0;

        keywords.forEach(kw => {
            const stats = getKeywordStats(kw);
            if (stats.hasData) {
                totalVol += stats.vol;
                totalCpc += stats.cpc;
                totalComp += stats.comp;
                maxGrowth = Math.max(maxGrowth, stats.growth);
                validKeywordsCount++;
            }
        });

        return {
            id,
            name,
            type,
            itemCount: keywords.length,
            totalVolume: totalVol,
            avgCpc: validKeywordsCount > 0 ? totalCpc / validKeywordsCount : 0,
            avgCompetition: validKeywordsCount > 0 ? totalComp / validKeywordsCount : 0,
            maxGrowth: maxGrowth === -Infinity ? 0 : maxGrowth,
            labels: [],
            originalRef
        };
    };

    // 1. Root Level Aggregation (List of Categories)
    const rootStats = useMemo(() => {
        return analyzedCategories.map(cat => {
            // Flatten all keywords in this category
            const allKeywords = cat.groups.flatMap(g => g.keywords);
            return aggregateKeywords(allKeywords, cat.id, cat.name, 'CATEGORY', cat);
        });
    }, [analyzedCategories]);

    // 2. Category Level Aggregation (List of Groups for a specific Category)
    const getGroupStatsForCategory = (categoryId: string) => {
        const category = analyzedCategories.find(c => c.id === categoryId);
        if (!category) return [];

        return category.groups.map(grp => {
            return aggregateKeywords(grp.keywords, grp.id, grp.name, 'GROUP', grp);
        });
    };

    // 3. Project Totals (For the "Cockpit" Header)
    const projectTotals = useMemo(() => {
        return rootStats.reduce((acc, curr) => ({
            totalVolume: acc.totalVolume + curr.totalVolume,
            totalKeywords: acc.totalKeywords + curr.itemCount,
            avgGrowth: Math.max(acc.avgGrowth, curr.maxGrowth) // Showing max growth potential
        }), { totalVolume: 0, totalKeywords: 0, avgGrowth: 0 });
    }, [rootStats]);

    return {
        rootStats,
        getGroupStatsForCategory,
        projectTotals
    };
};