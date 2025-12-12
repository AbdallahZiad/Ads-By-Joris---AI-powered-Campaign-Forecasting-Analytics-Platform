import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProject } from '../../../contexts/ProjectContext';
import { useKeywordAnalysis } from '../../../hooks/useKeywordAnalysis';
import AnalyzedCategoryComponent from './AnalyzedCategory/AnalyzedCategory';
import AnalysisChart from './AnalysisChart/AnalysisChart';
import LoadingOverlay from '../../common/LoadingOverlay/LoadingOverlay';
import { GEO_TARGET_REVERSE_MAP, LANGUAGE_REVERSE_MAP } from '../../../constants';
import PageLayout from '../../common/PageLayout/PageLayout';

const KeywordAnalysis: React.FC = () => {
    const navigate = useNavigate();
    const { analysisInputs } = useProject();

    React.useEffect(() => {
        if (!analysisInputs) {
            navigate('/planner');
        }
    }, [analysisInputs, navigate]);

    if (!analysisInputs) return null;

    const { selection, countryId, languageId } = analysisInputs;

    const { analyzedCategories, isLoading } = useKeywordAnalysis(selection, countryId, languageId);

    // ▼▼▼ FIX: Start with empty selection, do not auto-select first group ▼▼▼
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

    const countryName = countryId ? (GEO_TARGET_REVERSE_MAP[countryId] || 'Unknown Region') : 'N/A';
    const languageName = languageId ? (LANGUAGE_REVERSE_MAP[languageId] || 'Unknown Language') : 'N/A';
    const totalSelectedCount = chartSelection.size;

    return (
        <PageLayout>
            <div className="max-w-6xl mx-auto p-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Keyword Analysis</h1>

                        {/* ▼▼▼ FIX: Conditional Header Text ▼▼▼ */}
                        <p className="text-sm text-gray-500 mt-1">
                            {totalSelectedCount > 0 ? (
                                <>
                                    Showing <span className="font-semibold text-gray-900">{totalSelectedCount}</span> keywords for:
                                </>
                            ) : (
                                <span>Analysis Target: </span>
                            )}
                            <span className="font-medium text-gray-600 ml-1"> {countryName}</span>
                            <span className="mx-1">•</span>
                            Language: <span className="font-medium text-gray-600">{languageName}</span>
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/planner')}
                        className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                        ← Back to Selection
                    </button>
                </div>

                <div className="mb-8 relative">
                    <LoadingOverlay history={isLoading.history} forecast={isLoading.forecast} />
                    <AnalysisChart selectedKeywords={selectedKeywordsForChart} />
                </div>

                <div className="mt-4">
                    {analyzedCategories.map(cat => (
                        <AnalyzedCategoryComponent
                            key={cat.id}
                            category={cat}
                            chartSelection={chartSelection}
                            onChartSelectionChange={handleChartSelectionChange}
                        />
                    ))}
                </div>
            </div>
        </PageLayout>
    );
};

export default KeywordAnalysis;