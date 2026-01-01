import { useState, useEffect } from 'react';
import { SelectOption } from '../../../../types';
import { COUNTRIES_OPTIONS, LANGUAGES_OPTIONS } from '../../../../constants';
import { cacheService } from '../../../../utils/cacheService';

export const useProjectDataSource = ({ projectId }: { projectId: string | null }) => {

    const resolveInitialState = () => {
        if (!projectId) return { country: null, language: null };

        // 1. Try Cache (This now includes Scanner imports which are pre-seeded into cache)
        const cached = cacheService.getProjectSettings(projectId);

        // 2. Defaults
        const defaultCountry = COUNTRIES_OPTIONS.find(c => c.id === '2840') || null;
        const defaultLanguage = LANGUAGES_OPTIONS.find(l => l.id === '1000') || null;

        return {
            country: cached?.country || defaultCountry,
            language: cached?.language || defaultLanguage
        };
    };

    const initialState = resolveInitialState();
    const [country, setCountry] = useState<SelectOption | null>(initialState.country);
    const [language, setLanguage] = useState<SelectOption | null>(initialState.language);
    const [loadedProjectId, setLoadedProjectId] = useState<string | null>(projectId);

    // --- 1. Re-Load Effect ---
    useEffect(() => {
        if (projectId !== loadedProjectId) {
            const newState = resolveInitialState();
            setCountry(newState.country);
            setLanguage(newState.language);
            setLoadedProjectId(projectId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [projectId]);

    // --- 2. Save Effect ---
    useEffect(() => {
        if (!projectId || projectId !== loadedProjectId) return;

        cacheService.saveProjectSettings(projectId, country?.id, language?.id);

    }, [country, language, projectId, loadedProjectId]);

    return {
        country,
        setCountry,
        language,
        setLanguage
    };
};