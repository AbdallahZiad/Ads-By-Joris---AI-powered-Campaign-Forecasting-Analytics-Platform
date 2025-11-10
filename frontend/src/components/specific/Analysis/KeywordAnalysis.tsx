import React, { useState, useEffect, useMemo } from 'react';
import { Category, AnalyzedKeyword } from '../../../types';
import { useKeywordAnalysis } from '../../../hooks/useKeywordAnalysis';
import AnalyzedCategoryComponent from './AnalyzedCategory/AnalyzedCategory';
import AnalysisChart from './AnalysisChart/AnalysisChart';
import LoadingOverlay from '../../common/LoadingOverlay/LoadingOverlay';

interface Props {
    selection: Category[];
    onBack?: () => void;
}

const KeywordAnalysis: React.FC<Props> = ({ selection, onBack }) => {
    // --- 1. Use Custom Hook for Data & Loading State ---
    // This replaces historyData, forecastData, isLoading state,
    // the large useEffect for fetching, and the 'inflator' useMemo.
    const { analyzedCategories, isLoading } = useKeywordAnalysis(selection);

    // --- 2. UI State (Local to this view) ---
    const [chartSelection, setChartSelection] = useState<Set<string>>(new Set());

    // --- 3. Auto-selection Effect ---
    // Runs once when the input selection changes to set initial chart state.
    useEffect(() => {
        if (selection.length > 0 && selection[0].groups.length > 0) {
            const firstGroupKeywords = selection[0].groups[0].keywords;
            setChartSelection(new Set(firstGroupKeywords));
        } else {
            setChartSelection(new Set());
        }
    }, [selection]);

    // --- 4. Prepare Data for Chart ---
    // Flattens the hierarchical analyzed data based on user's chart selection.
    const selectedKeywordsForChart = useMemo(() => {
        const selected: AnalyzedKeyword[] = [];
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

    // --- 5. Handlers ---
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

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Keyword Analysis</h1>
                </div>
                {onBack && (
                    <button onClick={onBack} className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                        ← Back to Selection
                    </button>
                )}
            </div>

            {/* --- CHART AREA --- */}
            <div className="mb-8 relative">
                {/* Uses the shared LoadingOverlay component */}
                <LoadingOverlay history={isLoading.history} forecast={isLoading.forecast} />
                <AnalysisChart selectedKeywords={selectedKeywordsForChart} />
            </div>

            {/* --- DATA HIERARCHY --- */}
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
    );
};

export default KeywordAnalysis;