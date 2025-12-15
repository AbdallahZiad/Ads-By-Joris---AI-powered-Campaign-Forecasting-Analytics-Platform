import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Category as CategoryType, Group as GroupType, SelectOption } from '../../../types';
import { COUNTRIES_OPTIONS, LANGUAGES_OPTIONS } from '../../../constants';
import DataSourceSettings from './DataSourceSettings';
import styles from './CategoryManagement.module.css';
import { useProject } from '../../../contexts/ProjectContext';

// Hooks
import { useProjectSync } from './hooks/useProjectSync';
import { useCategoryEnrichment } from './hooks/useCategoryEnrichment';
import { useCategorySelection } from './hooks/useCategorySelection';

// Components
import CategoryList from './components/CategoryList';
import ContextualFooter from './components/ContextualFooter';
import ProjectSelector from './components/ProjectSelector';
import PageLayout from '../../common/PageLayout/PageLayout';
import { HiPlus, HiOutlineTemplate } from 'react-icons/hi';

const CategoryManagement: React.FC = () => {
    const navigate = useNavigate();
    const { currentProjectId, setCurrentProjectId, setAnalysisInputs } = useProject();

    const [country, setCountry] = useState<SelectOption | null>(
        COUNTRIES_OPTIONS.find(c => c.id === '2840') || null
    );
    const [language, setLanguage] = useState<SelectOption | null>(
        LANGUAGES_OPTIONS.find(l => l.id === '1000') || null
    );

    const {
        projects,
        activeProject,
        isLoadingActive,
        createProject,
        updateProject,
        deleteProject,
        createCategory,
        updateCategory,
        deleteCategory,
        createGroup,
        updateGroup,
        deleteGroup,
        bulkAddKeywords,
        deleteKeyword
    } = useProjectSync(currentProjectId);

    const categories = activeProject?.categories || [];

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
    } = useCategorySelection(categories, undefined);

    const {
        enrichingGroupIds,
        newKeywordsByGroup,
        enrichGroup,
        clearNewKeywords
    } = useCategoryEnrichment({
        countryId: country?.id,
        languageId: language?.id,
        onBulkAdd: bulkAddKeywords,
        setSelectedKeywordsByGroup
    });

    const handleCreateProject = async (title: string) => {
        try {
            const newProj = await createProject({ title });
            setCurrentProjectId(newProj.id);
        } catch (e) {
            console.error("Failed to create project");
        }
    };

    const handleRenameProject = async (id: string, title: string) => {
        try {
            await updateProject({ id, title });
        } catch (e) {
            console.error("Failed to rename project");
        }
    };

    const handleDeleteProject = async (id: string) => {
        try {
            await deleteProject(id);
            if (id === currentProjectId) {
                setCurrentProjectId(null);
            }
        } catch (e) {
            console.error("Failed to delete project");
            alert("Failed to delete project.");
        }
    };

    const handleAddCategory = () => {
        if (!currentProjectId) return;
        createCategory({ projectId: currentProjectId, name: "New Category" });
    };

    const handleAddGroup = (catId: string) => {
        createGroup({ categoryId: catId, name: "New Group" });
    };

    const handleKeywordSave = async (catId: string, grpId: string, newKeywordsList: string[]) => {
        const category = categories.find(c => c.id === catId);
        const group = category?.groups.find(g => g.id === grpId);
        if (!group) return;

        const oldKeywords = group.keywords;
        const newSet = new Set(newKeywordsList);
        const oldSet = new Set(oldKeywords.map(k => k.text));

        const toAdd = newKeywordsList.filter(txt => !oldSet.has(txt));

        const toDeleteIds = oldKeywords
            .filter(k => !newSet.has(k.text))
            .map(k => k.id);

        try {
            const promises = [];
            toDeleteIds.forEach(id => promises.push(deleteKeyword(id)));
            if (toAdd.length > 0) {
                promises.push(bulkAddKeywords({ groupId: grpId, keywords: toAdd }));
            }
            await Promise.all(promises);
        } catch (e) {
            console.error("Failed to sync keywords", e);
            alert("Failed to save keywords.");
        }
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

                // This check now works correctly because `groupKeywordSelections` contains strings,
                // and `k.text` is a string.
                if (groupKeywordSelections && groupKeywordSelections.size > 0) {
                    const filteredKeywords = group.keywords.filter(k => groupKeywordSelections.has(k.text));
                    if (filteredKeywords.length > 0) {
                        selectedGroupsForCategory.push({ ...group, keywords: filteredKeywords });
                    }
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

    const handleCategoryRemoveWithSelection = (id: string) => {
        deleteCategory(id);
        const newCatSel = new Set(selectedCategoryIds);
        newCatSel.delete(id);
        setSelectedCategoryIds(newCatSel);
    };

    const handleGroupRemoveWithSelection = (_catId: string, grpId: string) => {
        deleteGroup(grpId);
        const newGrpSel = new Set(selectedGroupIds);
        newGrpSel.delete(grpId);
        setSelectedGroupIds(newGrpSel);

        const newKwMap = new Map(selectedKeywordsByGroup);
        newKwMap.delete(grpId);
        setSelectedKeywordsByGroup(newKwMap);
    };

    const totalSelections = selectedCategoryIds.size + selectedGroupIds.size + selectedKeywordsByGroup.size;

    return (
        <PageLayout className="h-full flex flex-col bg-gray-50">
            <div className="flex-1 overflow-y-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

                    <div className="flex justify-between items-start mb-8">
                        <div className="flex items-center gap-6">
                            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Category Planner</h1>
                            <div className="h-10 w-px bg-gray-300" />
                            <ProjectSelector
                                projects={projects}
                                currentProjectId={currentProjectId}
                                onSelect={setCurrentProjectId}
                                onCreate={handleCreateProject}
                                onRename={handleRenameProject}
                                onDelete={handleDeleteProject}
                            />
                        </div>

                        {currentProjectId && (
                            <button
                                onClick={handleAddCategory}
                                className={styles.primaryButton}
                            >
                                <HiPlus size={16} className="mr-1" />
                                Add Category
                            </button>
                        )}
                    </div>

                    <DataSourceSettings
                        country={country}
                        language={language}
                        onCountryChange={setCountry}
                        onLanguageChange={setLanguage}
                    />

                    {isLoadingActive ? (
                        <div className="flex items-center justify-center h-64 text-gray-400">
                            Loading Project Data...
                        </div>
                    ) : !currentProjectId ? (
                        <div className="flex flex-col items-center justify-center h-96 border-2 border-dashed border-gray-200 rounded-2xl bg-white text-gray-400">
                            <HiOutlineTemplate size={48} className="mb-4 opacity-50" />
                            <p className="text-lg font-medium">No Project Selected</p>
                            <p className="text-sm">Select a project above or create a new one to get started.</p>
                        </div>
                    ) : categories.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-96 border-2 border-dashed border-gray-200 rounded-2xl bg-white text-gray-400">
                            <p className="mb-4">This project is empty.</p>
                            <div className="flex gap-4">
                                <button onClick={handleAddCategory} className="text-teal-600 hover:underline">Add Manually</button>
                                <span>or</span>
                                <button onClick={() => navigate('/scanner')} className="text-teal-600 hover:underline">Import via Scanner</button>
                            </div>
                        </div>
                    ) : (
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
                            onCategoryNameSave={(id, name) => updateCategory({id, name})}
                            onGroupAdd={handleAddGroup}
                            onGroupRemove={handleGroupRemoveWithSelection}
                            onGroupNameSave={(_catId, grpId, name) => updateGroup({id: grpId, name})}
                            onKeywordSave={handleKeywordSave}
                            onEnrichGroup={enrichGroup}
                            onRunAnalysisCategory={handleCategoryRunAnalysis}
                            onRunAnalysisGroup={handleGroupRunAnalysis}
                        />
                    )}

                    <div className={styles.contentSpacer} />
                </div>
            </div>

            <ContextualFooter
                totalSelections={totalSelections}
                onEnrich={handleFooterEnrich}
                onRunAnalysis={handleFooterRunAnalysis}
                onSelectAll={selectAll}
                onClear={clearSelection}
            />
        </PageLayout>
    );
};

export default CategoryManagement;