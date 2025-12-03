import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Category } from '../types';
import { useAuth } from './AuthContext';

interface AnalysisInputs {
    selection: Category[];
    countryId?: string;
    languageId?: string;
}

interface ProjectContextType {
    currentProjectId: string | null;
    setCurrentProjectId: (id: string | null) => void;
    analysisInputs: AnalysisInputs | null;
    setAnalysisInputs: (inputs: AnalysisInputs | null) => void;
    hasAnalysisData: boolean;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // ▼▼▼ FIX: Grab isLoading to prevent premature wiping on reload ▼▼▼
    const { isAuthenticated, isLoading: isAuthLoading } = useAuth();

    const [currentProjectId, setCurrentProjectId] = useState<string | null>(() => {
        return localStorage.getItem('active_project_id');
    });

    const [analysisInputs, setAnalysisInputs] = useState<AnalysisInputs | null>(null);
    const hasAnalysisData = !!analysisInputs;

    useEffect(() => {
        if (currentProjectId) {
            localStorage.setItem('active_project_id', currentProjectId);
        } else {
            localStorage.removeItem('active_project_id');
        }
    }, [currentProjectId]);

    // ▼▼▼ SECURITY FIX: Only wipe if we are definitely logged out (not just loading) ▼▼▼
    useEffect(() => {
        if (!isAuthLoading && !isAuthenticated) {
            setCurrentProjectId(null);
            setAnalysisInputs(null);
            localStorage.removeItem('active_project_id');
        }
    }, [isAuthenticated, isAuthLoading]);

    return (
        <ProjectContext.Provider value={{
            currentProjectId,
            setCurrentProjectId,
            analysisInputs,
            setAnalysisInputs,
            hasAnalysisData
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