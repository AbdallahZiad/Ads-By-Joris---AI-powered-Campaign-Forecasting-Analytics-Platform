import React from 'react';
import { HiHome, HiChevronRight } from 'react-icons/hi';
import { ViewLevel } from '../../../types';

interface Props {
    viewLevel: ViewLevel;
    categoryName?: string;
    groupName?: string;
    onReset: () => void;
    onGoToCategory: () => void;
}

const AnalysisBreadcrumbs: React.FC<Props> = ({
                                                  viewLevel,
                                                  categoryName,
                                                  groupName,
                                                  onReset,
                                                  onGoToCategory
                                              }) => {
    return (
        <nav className="flex items-center text-sm font-medium text-gray-500 mb-6 bg-white px-4 py-3 rounded-lg border border-gray-200 shadow-sm w-fit">

            {/* Root: All Categories */}
            <button
                onClick={onReset}
                className={`flex items-center gap-1 hover:text-teal-600 transition-colors ${viewLevel === 'ROOT' ? 'text-gray-900 font-bold cursor-default pointer-events-none' : ''}`}
            >
                <HiHome size={16} className="mb-0.5" />
                <span>All Categories</span>
            </button>

            {/* Separator 1 */}
            {viewLevel !== 'ROOT' && (
                <>
                    <HiChevronRight size={16} className="mx-2 text-gray-400" />
                    <button
                        onClick={onGoToCategory}
                        className={`hover:text-teal-600 transition-colors ${viewLevel === 'CATEGORY' ? 'text-gray-900 font-bold cursor-default pointer-events-none' : ''}`}
                    >
                        {categoryName}
                    </button>
                </>
            )}

            {/* Separator 2 */}
            {viewLevel === 'GROUP' && (
                <>
                    <HiChevronRight size={16} className="mx-2 text-gray-400" />
                    <span className="text-gray-900 font-bold">
                        {groupName}
                    </span>
                </>
            )}
        </nav>
    );
};

export default AnalysisBreadcrumbs;