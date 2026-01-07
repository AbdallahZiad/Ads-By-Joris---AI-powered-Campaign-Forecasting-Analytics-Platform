import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
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
    // ▼▼▼ NEW: Helper to clean up analysis when deleting a project ▼▼▼
    clearProjectAnalysis: (projectId: string) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

const STORAGE_KEY_ACTIVE_ID = 'active_project_id';
const STORAGE_KEY_ANALYSES = 'project_analyses_map';

export const ProjectProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { isAuthenticated, isLoading: isAuthLoading } = useAuth();

    // 1. Current Project ID
    const [currentProjectId, setCurrentProjectId] = useState<string | null>(() => {
        return localStorage.getItem(STORAGE_KEY_ACTIVE_ID);
    });

    // 2. Project Analyses Map (Persisted Dictionary: ProjectID -> AnalysisData)
    const [projectAnalyses, setProjectAnalyses] = useState<Record<string, AnalysisInputs>>(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY_ANALYSES);
            return stored ? JSON.parse(stored) : {};
        } catch (e) {
            console.error("Failed to load project analyses", e);
            return {};
        }
    });

    // --- Persistence Effects ---

    // Sync Active ID
    useEffect(() => {
        if (currentProjectId) {
            localStorage.setItem(STORAGE_KEY_ACTIVE_ID, currentProjectId);
        } else {
            localStorage.removeItem(STORAGE_KEY_ACTIVE_ID);
        }
    }, [currentProjectId]);

    // Sync Analyses Map
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY_ANALYSES, JSON.stringify(projectAnalyses));
        } catch (e) {
            // Handle quota exceeded gracefully (e.g., if projects are massive)
            console.error("Failed to save project analyses to local storage (Quota Exceeded?)", e);
        }
    }, [projectAnalyses]);

    // --- Derived State ---

    // ▼▼▼ CORE LOGIC: Automatically derive the analysis inputs for the CURRENT project ▼▼▼
    const analysisInputs = useMemo(() => {
        if (!currentProjectId) return null;
        return projectAnalyses[currentProjectId] || null;
    }, [currentProjectId, projectAnalyses]);

    const hasAnalysisData = !!analysisInputs;

    // --- Actions ---

    const setAnalysisInputs = (inputs: AnalysisInputs | null) => {
        if (!currentProjectId) return;

        setProjectAnalyses(prev => {
            const next = { ...prev };
            if (inputs === null) {
                delete next[currentProjectId];
            } else {
                next[currentProjectId] = inputs;
            }
            return next;
        });
    };

    const clearProjectAnalysis = (projectId: string) => {
        setProjectAnalyses(prev => {
            const next = { ...prev };
            delete next[projectId];
            return next;
        });
    };

    // --- Security / Cleanup ---

    useEffect(() => {
        if (!isAuthLoading && !isAuthenticated) {
            setCurrentProjectId(null);
            setProjectAnalyses({});
            localStorage.removeItem(STORAGE_KEY_ACTIVE_ID);
            localStorage.removeItem(STORAGE_KEY_ANALYSES);
        }
    }, [isAuthenticated, isAuthLoading]);

    return (
        <ProjectContext.Provider value={{
            currentProjectId,
            setCurrentProjectId,
            analysisInputs,
            setAnalysisInputs,
            hasAnalysisData,
            clearProjectAnalysis
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