import React, { useMemo, useState, useRef, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiArrowLeft, HiChartBar, HiCollection, HiLightningBolt } from 'react-icons/hi';
import { useProject } from '../../../contexts/ProjectContext';
import { useKeywordAnalysis } from '../../../hooks/useKeywordAnalysis';
import AnalysisChart from './AnalysisChart/AnalysisChart';
import AnalysisSummaryRow from './AnalysisSummaryRow/AnalysisSummaryRow';
import AnalysisBreadcrumbs from './AnalysisBreadcrumbs';
import AnalyzedGroup from './AnalyzedGroup/AnalyzedGroup';
import LoadingOverlay from '../../common/LoadingOverlay/LoadingOverlay';
import { GEO_TARGET_REVERSE_MAP, LANGUAGE_REVERSE_MAP } from '../../../constants';
import PageLayout from '../../common/PageLayout/PageLayout';
import { useAnalysisAggregator } from '../../../hooks/useAnalysisAggregator';
import { ViewLevel } from '../../../types';
import { formatNumber, formatMultiplier } from '../../../utils/format';

const KeywordAnalysis: React.FC = () => {
    const navigate = useNavigate();
    const { analysisInputs } = useProject();

    // ▼▼▼ ANCHOR: The specific point we snap to. ▼▼▼
    const listTopRef = useRef<HTMLDivElement>(null);

    // --- 1. View State ---
    const [viewLevel, setViewLevel] = useState<ViewLevel>('ROOT');
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
    const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

    // --- 2. Data Fetching ---
    React.useEffect(() => {
        if (!analysisInputs) navigate('/planner');
    }, [analysisInputs, navigate]);

    if (!analysisInputs) return null;

    const { selection, countryId, languageId } = analysisInputs;
    const { analyzedCategories, isLoading } = useKeywordAnalysis(selection, countryId, languageId);

    // --- 3. Aggregation Logic ---
    const { rootStats, getGroupStatsForCategory, projectTotals } = useAnalysisAggregator(analyzedCategories);

    // --- 4. Chart Selection Logic ---
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

    // --- 5. ENTERPRISE SCROLLING LOGIC ---
    useLayoutEffect(() => {
        if (listTopRef.current) {

            // Checks if the user is already deeper in the page (don't snap if looking at footer)
            // But enforces the "Ceiling" logic if the content is pushed down.

            listTopRef.current.scrollIntoView({
                behavior: 'auto', // INSTANT SNAP. Compensates for Chart expansion immediately.
                block: 'start',   // Aligns top of element to top of viewport
                inline: 'nearest'
            });
        }
        // Snap when view changes OR when chart expands (adding keywords)
    }, [viewLevel, selectedCategoryId, selectedGroupId, chartSelection.size]);

    // --- 6. Handlers ---
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

    // --- 7. Derived Data ---
    const currentCategory = useMemo(() =>
            analyzedCategories.find(c => c.id === selectedCategoryId),
        [analyzedCategories, selectedCategoryId]);

    const currentGroup = useMemo(() =>
            currentCategory?.groups.find(g => g.id === selectedGroupId),
        [currentCategory, selectedGroupId]);

    const categoryGroupStats = useMemo(() =>
            selectedCategoryId ? getGroupStatsForCategory(selectedCategoryId) : [],
        [selectedCategoryId, analyzedCategories]);

    const countryName = countryId ? (GEO_TARGET_REVERSE_MAP[countryId] || 'Unknown Region') : 'N/A';
    const languageName = languageId ? (LANGUAGE_REVERSE_MAP[languageId] || 'Unknown Language') : 'N/A';

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
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all hover:pl-3"
                    >
                        <HiArrowLeft /> Back to Selection
                    </button>
                </div>

                {/* Elegant Data Bar */}
                <div className="flex items-center justify-between bg-white border border-gray-200 rounded-xl shadow-sm p-4 mb-8">

                    {/* Stat 1: Total Volume (Teal - Primary Brand Color) */}
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

                    {/* Stat 2: Keywords (Gray - Neutral Metadata) */}
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

                    {/* Stat 3: Growth Potential (Indigo - Matches Forecast/AI UI) */}
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

                    {/* Chart - Always Visible */}
                    <div className="mb-8">
                        <AnalysisChart selectedKeywords={selectedKeywordsForChart} />
                    </div>

                    {/* ▼▼▼ SCROLL ANCHOR ▼▼▼ */}
                    {/* scroll-mt-32 creates a significant buffer (8rem/128px) so the breadcrumbs aren't glued to the top edge */}
                    <div ref={listTopRef} className="scroll-mt-32" />

                    {/* Navigation Breadcrumbs */}
                    <AnalysisBreadcrumbs
                        viewLevel={viewLevel}
                        categoryName={currentCategory?.name}
                        groupName={currentGroup?.name}
                        onReset={handleReset}
                        onGoToCategory={handleGoToCategory}
                    />

                    {/* --- VIEW LEVEL 1: ROOT (Categories List) --- */}
                    {viewLevel === 'ROOT' && (
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                            {/* Header Row */}
                            <div className="grid grid-cols-[2rem_2fr_1fr_1fr_1fr_1fr_3rem] gap-4 px-6 py-3 bg-gray-50 border-y border-gray-200 text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 rounded-md">
                                <div></div>
                                <div>Category Name</div>
                                <div className="text-right">Total Vol</div>
                                <div className="text-right">Avg CPC</div>
                                <div className="text-right">Avg Comp</div>
                                <div className="text-right">Top Trend</div>
                                <div></div>
                            </div>

                            {rootStats.map(stat => (
                                <AnalysisSummaryRow
                                    key={stat.id}
                                    stats={stat}
                                    onClick={() => handleCategoryClick(stat.id)}
                                />
                            ))}

                            {rootStats.length === 0 && !isLoading.history && (
                                <div className="text-center py-12 text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
                                    No categories found in analysis.
                                </div>
                            )}
                        </div>
                    )}

                    {/* --- VIEW LEVEL 2: CATEGORY (Groups List) --- */}
                    {viewLevel === 'CATEGORY' && currentCategory && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="grid grid-cols-[2rem_2fr_1fr_1fr_1fr_1fr_3rem] gap-4 px-6 py-3 bg-gray-50 border-y border-gray-200 text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 rounded-md">
                                <div></div>
                                <div>Group Name</div>
                                <div className="text-right">Total Vol</div>
                                <div className="text-right">Avg CPC</div>
                                <div className="text-right">Avg Comp</div>
                                <div className="text-right">Top Trend</div>
                                <div></div>
                            </div>

                            {categoryGroupStats.map(stat => (
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
                            />
                        </div>
                    )}
                </div>
            </div>
        </PageLayout>
    );
};

export default KeywordAnalysis;