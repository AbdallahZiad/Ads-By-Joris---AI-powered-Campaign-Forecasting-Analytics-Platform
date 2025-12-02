import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Category } from '../types';

interface AnalysisInputs {
    selection: Category[];
    countryId?: string;
    languageId?: string;
}

interface ProjectContextType {
    // Data State
    importedCategories: Category[];
    setImportedCategories: (cats: Category[]) => void;
    analysisInputs: AnalysisInputs | null;
    setAnalysisInputs: (inputs: AnalysisInputs | null) => void;

    // Flow Control Flags
    hasScannedData: boolean;
    hasAnalysisData: boolean;

    // Actions
    resetProject: () => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [importedCategories, setImportedCategoriesState] = useState<Category[]>([]);
    const [analysisInputs, setAnalysisInputs] = useState<AnalysisInputs | null>(null);

    // Derived states
    const hasScannedData = importedCategories.length > 0;
    const hasAnalysisData = !!analysisInputs;

    const setImportedCategories = (cats: Category[]) => {
        setImportedCategoriesState(cats);
        // When new data comes in, strictly reset analysis to enforce the funnel
        setAnalysisInputs(null);
    };

    const resetProject = () => {
        setImportedCategoriesState([]);
        setAnalysisInputs(null);
    };

    return (
        <ProjectContext.Provider value={{
            importedCategories,
            setImportedCategories,
            analysisInputs,
            setAnalysisInputs,
            hasScannedData,
            hasAnalysisData,
            resetProject
        }}>
            {children}
        </ProjectContext.Provider>
    );
};

export const useProject = () => {
    const context = useContext(ProjectContext);
    if (context === undefined) {
        throw new Error('useProject must be used within a ProjectProvider');
    }
    return context;
};