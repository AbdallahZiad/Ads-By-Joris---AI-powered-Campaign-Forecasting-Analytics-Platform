import React, { useMemo, useState, useRef, useLayoutEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiArrowLeft, HiChartBar, HiCollection, HiLightningBolt, HiX } from 'react-icons/hi';
import { useProject } from '../../../contexts/ProjectContext';
import { useKeywordAnalysis } from '../../../hooks/useKeywordAnalysis';
import AnalysisChart, { ChartDataItem } from './AnalysisChart/AnalysisChart';
import AnalysisSummaryRow from './AnalysisSummaryRow/AnalysisSummaryRow';
import AnalysisBreadcrumbs from './AnalysisBreadcrumbs';
import AnalyzedGroup from './AnalyzedGroup/AnalyzedGroup';
import LoadingOverlay from '../../common/LoadingOverlay/LoadingOverlay';
import SearchableSelect from '../../common/SearchableSelect/SearchableSelect';
import { GEO_TARGET_REVERSE_MAP, LANGUAGE_REVERSE_MAP, MONTH_MAP, COLORS } from '../../../constants';
import PageLayout from '../../common/PageLayout/PageLayout';
import { useAnalysisAggregator } from '../../../hooks/useAnalysisAggregator';
import { ViewLevel, SortConfig, SortField, SortOrder, SelectOption, ChartMode } from '../../../types';
import { formatNumber, formatMultiplier } from '../../../utils/format';

const SORT_OPTIONS: SelectOption[] = [
    { id: 'VOLUME_DESC', name: 'Highest Volume' },
    { id: 'VOLUME_ASC', name: 'Lowest Volume' },
    { id: 'GROWTH_DESC', name: 'Highest Growth' },
    { id: 'GROWTH_ASC', name: 'Lowest Growth' },
    { id: 'COMPETITION_DESC', name: 'Highest Competition' },
    { id: 'COMPETITION_ASC', name: 'Lowest Competition' },
    { id: 'NAME_ASC', name: 'Name (A-Z)' },
];

const KeywordAnalysis: React.FC = () => {
    const navigate = useNavigate();
    const { analysisInputs } = useProject();
    const listTopRef = useRef<HTMLDivElement>(null);

    // --- View State ---
    const [viewLevel, setViewLevel] = useState<ViewLevel>('ROOT');
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
    const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
    const [sortConfig, setSortConfig] = useState<SortConfig>({ field: 'VOLUME', order: 'DESC' });

    // --- Chart Mode State ---
    const [chartMode, setChartMode] = useState<ChartMode>(null);
    const [selectedChartIds, setSelectedChartIds] = useState<Set<string>>(new Set());

    // ▼▼▼ PERSISTENT COLOR ASSIGNMENT ▼▼▼
    const colorAssignments = useRef(new Map<string, string>());
    const nextColorIndex = useRef(0);

    const getPersistentColor = (id: string) => {
        if (!colorAssignments.current.has(id)) {
            const color = COLORS[nextColorIndex.current % COLORS.length];
            colorAssignments.current.set(id, color);
            nextColorIndex.current++;
        }
        return colorAssignments.current.get(id)!;
    };

    // --- Data Fetching ---
    React.useEffect(() => {
        if (!analysisInputs) navigate('/planner');
    }, [analysisInputs, navigate]);

    if (!analysisInputs) return null;

    const { selection, countryId, languageId } = analysisInputs;
    const { analyzedCategories, isLoading } = useKeywordAnalysis(selection, countryId, languageId);

    const { rootStats, getGroupStatsForCategory, projectTotals } = useAnalysisAggregator(analyzedCategories);

    // --- Smart Sorting ---
    const getSortedStats = (stats: any[]) => {
        return [...stats].sort((a, b) => {
            const m = sortConfig.order === 'ASC' ? 1 : -1;
            let valA = 0; let valB = 0;
            if (sortConfig.field === 'NAME') return a.name.localeCompare(b.name) * m;
            else if (sortConfig.field === 'VOLUME') { valA = a.totalVolume; valB = b.totalVolume; }
            else if (sortConfig.field === 'COMPETITION') { valA = a.avgCompetition; valB = b.avgCompetition; }
            else if (sortConfig.field === 'GROWTH') { valA = a.forecastYoY; valB = b.forecastYoY; }
            return (valA - valB) * m;
        });
    };

    // --- Chart Data Preparation ---
    const chartDataItems = useMemo<ChartDataItem[]>(() => {
        const items: ChartDataItem[] = [];

        if (chartMode === 'CATEGORY') {
            rootStats.forEach(stat => {
                if (selectedChartIds.has(stat.id)) {
                    items.push({
                        id: stat.id,
                        label: stat.name,
                        color: getPersistentColor(stat.id),
                        historyPoints: stat.historySeries,
                        forecastPoints: stat.forecastSeries
                    });
                }
            });
        } else if (chartMode === 'GROUP') {
            analyzedCategories.forEach(cat => {
                const groupStats = getGroupStatsForCategory(cat.id);
                groupStats.forEach(stat => {
                    if (selectedChartIds.has(stat.id)) {
                        items.push({
                            id: stat.id,
                            label: `${stat.name} (${cat.name})`,
                            color: getPersistentColor(stat.id),
                            historyPoints: stat.historySeries,
                            forecastPoints: stat.forecastSeries
                        });
                    }
                });
            });
        } else if (chartMode === 'KEYWORD') {
            analyzedCategories.forEach(cat => {
                cat.groups.forEach(grp => {
                    grp.keywords.forEach(kw => {
                        if (selectedChartIds.has(kw.text)) {
                            const historyPoints: any[] = [];
                            kw.history?.monthly_search_volumes.forEach(pt => {
                                historyPoints.push({
                                    date: Date.UTC(pt.year, MONTH_MAP[pt.month], 1),
                                    value: pt.monthly_searches
                                });
                            });
                            const forecastPoints: any[] = [];
                            kw.forecast?.forecast_series.forEach(pt => {
                                forecastPoints.push({
                                    date: Date.UTC(pt.year, MONTH_MAP[pt.month], 1),
                                    value: pt.search_volume_forecast
                                });
                            });
                            items.push({
                                id: kw.text,
                                label: kw.text,
                                color: getPersistentColor(kw.text),
                                historyPoints,
                                forecastPoints
                            });
                        }
                    });
                });
            });
        }
        return items;
    }, [chartMode, selectedChartIds, rootStats, analyzedCategories, getGroupStatsForCategory]);


    // --- Chart Selection Logic ---
    const handleToggleChartItem = useCallback((id: string, type: ChartMode, isSelected: boolean) => {
        if (!type) return;

        if (chartMode !== type && isSelected) {
            setChartMode(type);
            setSelectedChartIds(new Set([id]));
            return;
        }

        if (chartMode === type || chartMode === null) {
            if (chartMode === null && isSelected) setChartMode(type);
            setSelectedChartIds(prev => {
                const next = new Set(prev);
                if (isSelected) next.add(id);
                else next.delete(id);
                if (next.size === 0) setChartMode(null);
                return next;
            });
        }
    }, [chartMode]);

    const handleKeywordSelectionChange = useCallback((keywords: string[], isSelected: boolean) => {
        if (chartMode !== 'KEYWORD' && isSelected) {
            setChartMode('KEYWORD');
            setSelectedChartIds(new Set(keywords));
            return;
        }
        setSelectedChartIds(prev => {
            const next = new Set(prev);
            keywords.forEach(k => {
                if (isSelected) next.add(k);
                else next.delete(k);
            });
            if (next.size === 0) setChartMode(null);
            return next;
        });
    }, [chartMode]);

    const handleClearChart = () => {
        setSelectedChartIds(new Set());
        setChartMode(null);
    };

    // --- Effects ---
    useLayoutEffect(() => {
        if (listTopRef.current) {
            listTopRef.current.scrollIntoView({ behavior: 'auto', block: 'start', inline: 'nearest' });
        }
    }, [viewLevel, selectedCategoryId, selectedGroupId, sortConfig]);

    // --- Derived State ---
    const currentCategory = useMemo(() => analyzedCategories.find(c => c.id === selectedCategoryId), [analyzedCategories, selectedCategoryId]);
    const currentGroup = useMemo(() => currentCategory?.groups.find(g => g.id === selectedGroupId), [currentCategory, selectedGroupId]);

    const sortedRootStats = useMemo(() => getSortedStats(rootStats), [rootStats, sortConfig]);
    const sortedCategoryGroupStats = useMemo(() =>
            selectedCategoryId ? getSortedStats(getGroupStatsForCategory(selectedCategoryId)) : [],
        [selectedCategoryId, analyzedCategories, sortConfig, getGroupStatsForCategory]);

    const countryName = countryId ? (GEO_TARGET_REVERSE_MAP[countryId] || 'Unknown Region') : 'N/A';
    const languageName = languageId ? (LANGUAGE_REVERSE_MAP[languageId] || 'Unknown Language') : 'N/A';
    const currentSortOption = useMemo(() => SORT_OPTIONS.find(opt => opt.id === `${sortConfig.field}_${sortConfig.order}`) || SORT_OPTIONS[0], [sortConfig]);

    // --- Handlers ---
    const handleCategoryClick = useCallback((id: string) => { setSelectedCategoryId(id); setViewLevel('CATEGORY'); }, []);
    const handleGroupClick = useCallback((id: string) => { setSelectedGroupId(id); setViewLevel('GROUP'); }, []);
    const handleReset = () => { setViewLevel('ROOT'); setSelectedCategoryId(null); setSelectedGroupId(null); };
    const handleGoToCategory = () => { setViewLevel('CATEGORY'); setSelectedGroupId(null); };

    // ▼▼▼ FIX: Explicit type casting ▼▼▼
    const handleSortChange = (opt: SelectOption | null) => {
        if(opt) {
            const [f, o] = opt.id.split('_');
            setSortConfig({ field: f as SortField, order: o as SortOrder });
        }
    };

    const getChartModeLabel = () => {
        if (!chartMode) return '';
        const count = selectedChartIds.size;
        const singular = chartMode.toLowerCase();
        if (count === 1) return singular;
        if (singular === 'category') return 'categories';
        return `${singular}s`;
    };

    return (
        <PageLayout>
            <div className="max-w-7xl mx-auto p-6">

                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Keyword Analysis</h1>
                        <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                            <span className="font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded border border-gray-200">{countryName}</span>
                            <span className="text-gray-300">•</span>
                            <span className="font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded border border-gray-200">{languageName}</span>
                        </div>
                    </div>
                    <button onClick={() => navigate('/planner')} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all shadow-sm">
                        <HiArrowLeft /> Back to Selection
                    </button>
                </div>

                <div className="flex items-center justify-between bg-white border border-gray-200 rounded-xl shadow-sm p-4 mb-8">
                    <div className="flex items-center gap-4 px-4 flex-1 border-r border-gray-100">
                        <div className="p-3 bg-teal-50 text-teal-600 rounded-lg"><HiChartBar size={20} /></div>
                        <div><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Volume</p><p className="text-2xl font-bold text-gray-900 leading-none mt-1">{formatNumber(projectTotals.totalVolume)}</p></div>
                    </div>
                    <div className="flex items-center gap-4 px-4 flex-1 border-r border-gray-100">
                        <div className="p-3 bg-gray-50 text-gray-500 rounded-lg"><HiCollection size={20} /></div>
                        <div><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Keywords</p><p className="text-2xl font-bold text-gray-900 leading-none mt-1">{formatNumber(projectTotals.totalKeywords)}</p></div>
                    </div>
                    <div className="flex items-center gap-4 px-4 flex-1">
                        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg"><HiLightningBolt size={20} /></div>
                        <div><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Max Growth Potential</p><p className="text-2xl font-bold text-gray-900 leading-none mt-1">{formatMultiplier(projectTotals.avgGrowth)}</p></div>
                    </div>
                </div>

                <div className="relative min-h-[500px]">
                    <LoadingOverlay history={isLoading.history} forecast={isLoading.forecast} />

                    <div className="mb-8">
                        <div className="flex justify-between items-center mb-3 bg-white border border-gray-200 px-4 py-2 rounded-lg shadow-sm">
                            <div className="flex items-center gap-2 text-sm">
                                <span className="text-gray-500 font-medium">Active View:</span>
                                {chartMode ? (
                                    <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded capitalize">
                                        {selectedChartIds.size} {getChartModeLabel()}
                                    </span>
                                ) : (
                                    <span className="text-gray-400 italic">No selection</span>
                                )}
                            </div>
                            {chartMode && (
                                <button onClick={handleClearChart} className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors">
                                    <HiX size={14} /> Clear Selection
                                </button>
                            )}
                        </div>

                        <AnalysisChart items={chartDataItems} />
                    </div>

                    <div ref={listTopRef} className="scroll-mt-32" />

                    <div className="flex justify-between items-center mb-4">
                        <AnalysisBreadcrumbs viewLevel={viewLevel} categoryName={currentCategory?.name} groupName={currentGroup?.name} onReset={handleReset} onGoToCategory={handleGoToCategory} />
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Sort by</span>
                            <div className="w-56">
                                <SearchableSelect value={currentSortOption} onChange={handleSortChange} options={SORT_OPTIONS} placeholder="Sort by..." instanceId="sort-dropdown" />
                            </div>
                        </div>
                    </div>

                    {viewLevel === 'ROOT' && (
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                            {sortedRootStats.map(stat => (
                                <AnalysisSummaryRow
                                    key={stat.id}
                                    stats={stat}
                                    onRowClick={handleCategoryClick}
                                    isSelected={chartMode === 'CATEGORY' && selectedChartIds.has(stat.id)}
                                    selectionColor={selectedChartIds.has(stat.id) ? getPersistentColor(stat.id) : undefined}
                                    onToggleSelection={handleToggleChartItem}
                                />
                            ))}
                            {sortedRootStats.length === 0 && !isLoading.history && <div className="text-center py-12 text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">No categories found in analysis.</div>}
                        </div>
                    )}

                    {viewLevel === 'CATEGORY' && currentCategory && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                            {sortedCategoryGroupStats.map(stat => (
                                <AnalysisSummaryRow
                                    key={stat.id}
                                    stats={stat}
                                    onRowClick={handleGroupClick}
                                    isSelected={chartMode === 'GROUP' && selectedChartIds.has(stat.id)}
                                    selectionColor={selectedChartIds.has(stat.id) ? getPersistentColor(stat.id) : undefined}
                                    onToggleSelection={handleToggleChartItem}
                                />
                            ))}
                        </div>
                    )}

                    {viewLevel === 'GROUP' && currentGroup && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                            <AnalyzedGroup
                                group={currentGroup}
                                chartSelection={chartMode === 'KEYWORD' ? selectedChartIds : new Set()}
                                onChartSelectionChange={handleKeywordSelectionChange}
                                sortConfig={sortConfig}
                            />
                        </div>
                    )}
                </div>
            </div>
        </PageLayout>
    );
};

export default KeywordAnalysis;