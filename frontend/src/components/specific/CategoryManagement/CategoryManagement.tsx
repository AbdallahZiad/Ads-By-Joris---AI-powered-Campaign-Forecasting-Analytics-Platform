import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Category as CategoryType, Group as GroupType, SelectOption } from '../../../types';
import { COUNTRIES_OPTIONS, LANGUAGES_OPTIONS } from '../../../constants';
import DataSourceSettings from './DataSourceSettings';
import styles from './CategoryManagement.module.css';
import { useProject } from '../../../contexts/ProjectContext';

import { useCategoryData } from './hooks/useCategoryData';
import { useCategorySelection } from './hooks/useCategorySelection';
import { useCategoryEnrichment } from './hooks/useCategoryEnrichment';

import CategoryHeader from './components/CategoryHeader';
import CategoryList from './components/CategoryList';
import ContextualFooter from './components/ContextualFooter';
import PageLayout from '../../common/PageLayout/PageLayout'; // ▼▼▼ Import

const CategoryManagement: React.FC = () => {
    const navigate = useNavigate();
    const mainContentRef = useRef<HTMLDivElement>(null);
    const { importedCategories, setAnalysisInputs } = useProject();

    const [country, setCountry] = useState<SelectOption | null>(
        COUNTRIES_OPTIONS.find(c => c.id === '2840') || null
    );
    const [language, setLanguage] = useState<SelectOption | null>(
        LANGUAGES_OPTIONS.find(l => l.id === '1000') || null
    );

    const {
        categories,
        setCategories,
        addCategory,
        addGroup,
        updateCategoryName,
        removeCategory,
        updateGroupName,
        removeGroup,
        updateGroupKeywords
    } = useCategoryData(importedCategories, mainContentRef);

    const {
        selectedCategoryIds,
        selectedGroupIds,
        selectedKeywordsByGroup,
        toggleCategory,
        toggleGroup,
        toggleKeyword,
        selectAll,
        clearSelection,
        setSelectedCategoryIds,
        setSelectedGroupIds,
        setSelectedKeywordsByGroup
    } = useCategorySelection(categories, importedCategories);

    const {
        enrichingGroupIds,
        newKeywordsByGroup,
        enrichGroup,
        clearNewKeywords
    } = useCategoryEnrichment({
        countryId: country?.id,
        languageId: language?.id,
        setCategories,
        setSelectedKeywordsByGroup
    });

    const handleCategoryRemoveWithSelection = (id: string) => {
        const cat = categories.find(c => c.id === id);
        if (!cat) return;
        removeCategory(id);
        const newCatSel = new Set(selectedCategoryIds);
        newCatSel.delete(id);
        setSelectedCategoryIds(newCatSel);
        const newGrpSel = new Set(selectedGroupIds);
        const newKwMap = new Map(selectedKeywordsByGroup);
        cat.groups.forEach(g => {
            newGrpSel.delete(g.id);
            newKwMap.delete(g.id);
        });
        setSelectedGroupIds(newGrpSel);
        setSelectedKeywordsByGroup(newKwMap);
    };

    const handleGroupRemoveWithSelection = (catId: string, grpId: string) => {
        removeGroup(catId, grpId);
        const newGrpSel = new Set(selectedGroupIds);
        newGrpSel.delete(grpId);
        setSelectedGroupIds(newGrpSel);
        const newKwMap = new Map(selectedKeywordsByGroup);
        newKwMap.delete(grpId);
        setSelectedKeywordsByGroup(newKwMap);
    };

    const handleKeywordSaveWithSelection = (catId: string, grpId: string, kws: string[]) => {
        updateGroupKeywords(catId, grpId, kws);
        const newKwMap = new Map(selectedKeywordsByGroup);
        newKwMap.delete(grpId);
        setSelectedKeywordsByGroup(newKwMap);
    };

    const runAnalysisWithContext = (selection: CategoryType[]) => {
        clearNewKeywords();
        setAnalysisInputs({
            selection,
            countryId: country?.id,
            languageId: language?.id
        });
        navigate('/analysis');
    };

    const handleCategoryRunAnalysis = (category: CategoryType) => {
        if (category.groups.length === 0) return;
        runAnalysisWithContext([{ ...category, groups: [...category.groups] }]);
    };

    const handleGroupRunAnalysis = (category: CategoryType, group: GroupType) => {
        if (group.keywords.length === 0) return;
        runAnalysisWithContext([{ ...category, groups: [group] }]);
    };

    const handleFooterRunAnalysis = () => {
        const selection: CategoryType[] = [];
        categories.forEach(cat => {
            const selectedGroupsForCategory: GroupType[] = [];
            cat.groups.forEach(group => {
                const groupKeywordSelections = selectedKeywordsByGroup.get(group.id);
                if (groupKeywordSelections && groupKeywordSelections.size > 0) {
                    const filteredKeywords = group.keywords.filter(k => groupKeywordSelections.has(k));
                    selectedGroupsForCategory.push({ ...group, keywords: filteredKeywords });
                }
            });
            if (selectedGroupsForCategory.length > 0) {
                selection.push({ ...cat, groups: selectedGroupsForCategory });
            }
        });

        if (selection.length === 0) {
            alert("Please select at least one keyword to run analysis on.");
            return;
        }
        runAnalysisWithContext(selection);
    };

    const handleFooterEnrich = async () => {
        const groupsToEnrich: GroupType[] = [];
        categories.forEach(cat => {
            cat.groups.forEach(grp => {
                if (selectedGroupIds.has(grp.id)) {
                    groupsToEnrich.push(grp);
                }
            });
        });

        if (groupsToEnrich.length === 0) {
            alert("No groups selected for enrichment.");
            return;
        }

        for (const group of groupsToEnrich) {
            await enrichGroup(group);
        }
    };

    const totalSelections = selectedCategoryIds.size + selectedGroupIds.size + selectedKeywordsByGroup.size;

    return (
        // ▼▼▼ WRAPPER: Matches Auth Feel ▼▼▼
        <PageLayout className="h-full">
            <div ref={mainContentRef} className={`${styles.pageContainer} h-full overflow-y-auto`}>
                <div className={styles.content}>
                    <CategoryHeader onAddCategory={addCategory} />

                    <DataSourceSettings
                        country={country}
                        language={language}
                        onCountryChange={setCountry}
                        onLanguageChange={setLanguage}
                    />

                    <CategoryList
                        categories={categories}
                        selectedCategoryIds={selectedCategoryIds}
                        selectedGroupIds={selectedGroupIds}
                        selectedKeywordsByGroup={selectedKeywordsByGroup}
                        enrichingGroupIds={enrichingGroupIds}
                        newKeywordsByGroup={newKeywordsByGroup}
                        onCategorySelect={toggleCategory}
                        onGroupSelect={toggleGroup}
                        onKeywordSelect={toggleKeyword}
                        onCategoryRemove={handleCategoryRemoveWithSelection}
                        onCategoryNameSave={updateCategoryName}
                        onGroupAdd={addGroup}
                        onGroupRemove={handleGroupRemoveWithSelection}
                        onGroupNameSave={updateGroupName}
                        onKeywordSave={handleKeywordSaveWithSelection}
                        onEnrichGroup={enrichGroup}
                        onRunAnalysisCategory={handleCategoryRunAnalysis}
                        onRunAnalysisGroup={handleGroupRunAnalysis}
                    />

                    <div className={styles.contentSpacer} />
                </div>

                <ContextualFooter
                    totalSelections={totalSelections}
                    onEnrich={handleFooterEnrich}
                    onRunAnalysis={handleFooterRunAnalysis}
                    onSelectAll={selectAll}
                    onClear={clearSelection}
                />
            </div>
        </PageLayout>
    );
};

export default CategoryManagement;