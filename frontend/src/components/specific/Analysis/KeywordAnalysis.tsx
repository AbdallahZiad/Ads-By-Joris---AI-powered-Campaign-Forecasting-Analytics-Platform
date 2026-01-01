import React, { useMemo, useState, useRef, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiArrowLeft, HiChartBar, HiCollection, HiLightningBolt } from 'react-icons/hi'; // ▼▼▼ FIX: Removed unused icons
import { useProject } from '../../../contexts/ProjectContext';
import { useKeywordAnalysis } from '../../../hooks/useKeywordAnalysis';
import AnalysisChart from './AnalysisChart/AnalysisChart';
import AnalysisSummaryRow from './AnalysisSummaryRow/AnalysisSummaryRow';
import AnalysisBreadcrumbs from './AnalysisBreadcrumbs';
import AnalyzedGroup from './AnalyzedGroup/AnalyzedGroup';
// ▼▼▼ FIX: Removed unused AnalyzedCategory import
import LoadingOverlay from '../../common/LoadingOverlay/LoadingOverlay';
import SearchableSelect from '../../common/SearchableSelect/SearchableSelect';
import { GEO_TARGET_REVERSE_MAP, LANGUAGE_REVERSE_MAP } from '../../../constants';
import PageLayout from '../../common/PageLayout/PageLayout';
import { useAnalysisAggregator } from '../../../hooks/useAnalysisAggregator';
import { ViewLevel, SortConfig, SortField, SortOrder, SelectOption } from '../../../types';
import { formatNumber, formatMultiplier } from '../../../utils/format';

// ▼▼▼ DEFINITION: Sort Options ▼▼▼
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

    // --- 1. View & Sort State ---
    const [viewLevel, setViewLevel] = useState<ViewLevel>('ROOT');
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
    const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

    const [sortConfig, setSortConfig] = useState<SortConfig>({ field: 'VOLUME', order: 'DESC' });

    // --- 2. Data Fetching ---
    React.useEffect(() => {
        if (!analysisInputs) navigate('/planner');
    }, [analysisInputs, navigate]);

    if (!analysisInputs) return null;

    const { selection, countryId, languageId } = analysisInputs;
    const { analyzedCategories, isLoading } = useKeywordAnalysis(selection, countryId, languageId);

    // --- 3. Aggregation Logic ---
    const { rootStats, getGroupStatsForCategory, projectTotals } = useAnalysisAggregator(analyzedCategories);

    // --- 4. Sorting Helper ---
    const getSortedStats = (stats: any[]) => {
        return [...stats].sort((a, b) => {
            const m = sortConfig.order === 'ASC' ? 1 : -1;
            let valA = 0;
            let valB = 0;

            if (sortConfig.field === 'NAME') {
                return a.name.localeCompare(b.name) * m;
            } else if (sortConfig.field === 'VOLUME') {
                valA = a.totalVolume;
                valB = b.totalVolume;
            } else if (sortConfig.field === 'COMPETITION') {
                valA = a.avgCompetition;
                valB = b.avgCompetition;
            } else if (sortConfig.field === 'GROWTH') {
                valA = a.forecastYoY;
                valB = b.forecastYoY;
            }

            return (valA - valB) * m;
        });
    };

    // --- 5. Chart Selection Logic ---
    const [chartSelection, setChartSelection] = useState<Set<string>>(new Set());

    const selectedKeywordsForChart = useMemo(() => {
        const selected: any[] = [];
        analyzedCategories.forEach(cat => {
            cat.groups.forEach(grp => {
                grp.keywords.forEach(kw => {
                    if (chartSelection.has(kw.text)) {
                        selected.push(kw);
                    }
                });
            });
        });
        return selected;
    }, [analyzedCategories, chartSelection]);

    const handleChartSelectionChange = (keywords: string[], isSelected: boolean) => {
        setChartSelection(prev => {
            const newSelection = new Set(prev);
            keywords.forEach(k => {
                if (isSelected) newSelection.add(k);
                else newSelection.delete(k);
            });
            return newSelection;
        });
    };

    // --- 6. Effects ---
    useLayoutEffect(() => {
        if (listTopRef.current) {
            listTopRef.current.scrollIntoView({
                behavior: 'auto',
                block: 'start',
                inline: 'nearest'
            });
        }
    }, [viewLevel, selectedCategoryId, selectedGroupId, chartSelection.size, sortConfig]);

    // --- 7. Handlers ---
    const handleCategoryClick = (id: string) => {
        setSelectedCategoryId(id);
        setViewLevel('CATEGORY');
    };

    const handleGroupClick = (id: string) => {
        setSelectedGroupId(id);
        setViewLevel('GROUP');
    };

    const handleReset = () => {
        setViewLevel('ROOT');
        setSelectedCategoryId(null);
        setSelectedGroupId(null);
    };

    const handleGoToCategory = () => {
        setViewLevel('CATEGORY');
        setSelectedGroupId(null);
    };

    const handleSortChange = (option: SelectOption | null) => {
        if (!option) return;
        const [field, order] = option.id.split('_');
        setSortConfig({ field: field as SortField, order: order as SortOrder });
    };

    // --- 8. Derived Data for Views ---
    const currentCategory = useMemo(() =>
            analyzedCategories.find(c => c.id === selectedCategoryId),
        [analyzedCategories, selectedCategoryId]);

    const currentGroup = useMemo(() =>
            currentCategory?.groups.find(g => g.id === selectedGroupId),
        [currentCategory, selectedGroupId]);

    const sortedRootStats = useMemo(() => getSortedStats(rootStats), [rootStats, sortConfig]);
    const sortedCategoryGroupStats = useMemo(() =>
            selectedCategoryId ? getSortedStats(getGroupStatsForCategory(selectedCategoryId)) : [],
        [selectedCategoryId, analyzedCategories, sortConfig]);

    const countryName = countryId ? (GEO_TARGET_REVERSE_MAP[countryId] || 'Unknown Region') : 'N/A';
    const languageName = languageId ? (LANGUAGE_REVERSE_MAP[languageId] || 'Unknown Language') : 'N/A';

    const currentSortOption = useMemo(() =>
            SORT_OPTIONS.find(opt => opt.id === `${sortConfig.field}_${sortConfig.order}`) || SORT_OPTIONS[0],
        [sortConfig]);

    return (
        <PageLayout>
            <div className="max-w-7xl mx-auto p-6">

                {/* Header Section */}
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Keyword Analysis</h1>
                        <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                            <span className="font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded border border-gray-200">
                                {countryName}
                            </span>
                            <span className="text-gray-300">•</span>
                            <span className="font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded border border-gray-200">
                                {languageName}
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={() => navigate('/planner')}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-900 hover:border-gray-400 transition-all shadow-sm"
                    >
                        <HiArrowLeft /> Back to Selection
                    </button>
                </div>

                {/* Elegant Data Bar */}
                <div className="flex items-center justify-between bg-white border border-gray-200 rounded-xl shadow-sm p-4 mb-8">
                    {/* Stat 1 */}
                    <div className="flex items-center gap-4 px-4 flex-1 border-r border-gray-100">
                        <div className="p-3 bg-teal-50 text-teal-600 rounded-lg">
                            <HiChartBar size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Volume</p>
                            <p className="text-2xl font-bold text-gray-900 leading-none mt-1">
                                {formatNumber(projectTotals.totalVolume)}
                            </p>
                        </div>
                    </div>
                    {/* Stat 2 */}
                    <div className="flex items-center gap-4 px-4 flex-1 border-r border-gray-100">
                        <div className="p-3 bg-gray-50 text-gray-500 rounded-lg">
                            <HiCollection size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Keywords</p>
                            <p className="text-2xl font-bold text-gray-900 leading-none mt-1">
                                {formatNumber(projectTotals.totalKeywords)}
                            </p>
                        </div>
                    </div>
                    {/* Stat 3 */}
                    <div className="flex items-center gap-4 px-4 flex-1">
                        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
                            <HiLightningBolt size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Max Growth Potential</p>
                            <p className="text-2xl font-bold text-gray-900 leading-none mt-1">
                                {formatMultiplier(projectTotals.avgGrowth)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="relative min-h-[500px]">
                    <LoadingOverlay history={isLoading.history} forecast={isLoading.forecast} />

                    {/* Chart */}
                    <div className="mb-8">
                        <AnalysisChart selectedKeywords={selectedKeywordsForChart} />
                    </div>

                    <div ref={listTopRef} className="scroll-mt-32" />

                    {/* Controls Row: Breadcrumbs + Sort */}
                    <div className="flex justify-between items-center mb-4">
                        <AnalysisBreadcrumbs
                            viewLevel={viewLevel}
                            categoryName={currentCategory?.name}
                            groupName={currentGroup?.name}
                            onReset={handleReset}
                            onGoToCategory={handleGoToCategory}
                        />

                        {/* Sort Dropdown */}
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Sort by</span>
                            <div className="w-56">
                                <SearchableSelect
                                    value={currentSortOption}
                                    onChange={handleSortChange}
                                    options={SORT_OPTIONS}
                                    placeholder="Sort by..."
                                    instanceId="sort-dropdown"
                                />
                            </div>
                        </div>
                    </div>

                    {/* --- VIEW LEVEL 1: ROOT (Categories List) --- */}
                    {viewLevel === 'ROOT' && (
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">

                            {sortedRootStats.map(stat => (
                                <AnalysisSummaryRow
                                    key={stat.id}
                                    stats={stat}
                                    onClick={() => handleCategoryClick(stat.id)}
                                />
                            ))}

                            {sortedRootStats.length === 0 && !isLoading.history && (
                                <div className="text-center py-12 text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
                                    No categories found in analysis.
                                </div>
                            )}
                        </div>
                    )}

                    {/* --- VIEW LEVEL 2: CATEGORY (Groups List) --- */}
                    {viewLevel === 'CATEGORY' && currentCategory && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300">

                            {sortedCategoryGroupStats.map(stat => (
                                <AnalysisSummaryRow
                                    key={stat.id}
                                    stats={stat}
                                    onClick={() => handleGroupClick(stat.id)}
                                />
                            ))}
                        </div>
                    )}

                    {/* --- VIEW LEVEL 3: GROUP (Keywords List) --- */}
                    {viewLevel === 'GROUP' && currentGroup && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                            <AnalyzedGroup
                                group={currentGroup}
                                chartSelection={chartSelection}
                                onChartSelectionChange={handleChartSelectionChange}
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