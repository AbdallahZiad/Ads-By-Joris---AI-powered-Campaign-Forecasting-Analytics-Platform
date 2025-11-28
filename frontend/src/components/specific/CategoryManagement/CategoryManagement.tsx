import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Category as CategoryType, Group as GroupType, SelectOption } from '../../../types';
import { COUNTRIES_OPTIONS, LANGUAGES_OPTIONS } from '../../../constants';
import CategoryComponent from '../Category/Category';
import DataSourceSettings from './DataSourceSettings';
import styles from './CategoryManagement.module.css';
import { HiPlus } from 'react-icons/hi';
import { mockApi } from '../../../api/mockApi';
import { MetricsCache } from '../../../utils/metricsCache';

interface CategoryManagementProps {
    onRunAnalysis: (
        selection: CategoryType[],
        countryId: string | undefined,
        languageId: string | undefined
    ) => void;
    mainContentRef: React.RefObject<HTMLElement | null>;
    initialImportedCategories?: CategoryType[];
}

const CategoryManagement: React.FC<CategoryManagementProps> = ({
                                                                   onRunAnalysis,
                                                                   mainContentRef,
                                                                   initialImportedCategories
                                                               }) => {
    const [categories, setCategories] = useState<CategoryType[]>([]);

    // Selection State
    const [selectedCategoryIds, setSelectedCategoryIds] = useState<Set<string>>(new Set());
    const [selectedGroupIds, setSelectedGroupIds] = useState<Set<string>>(new Set());
    const [selectedKeywordsByGroup, setSelectedKeywordsByGroup] = useState<Map<string, Set<string>>>(new Map());

    // Enrichment State
    const [enrichingGroupIds, setEnrichingGroupIds] = useState<Set<string>>(new Set());
    const [newKeywordsByGroup, setNewKeywordsByGroup] = useState<Map<string, Set<string>>>(new Map());

    // Settings State
    const [country, setCountry] = useState<SelectOption | null>(
        COUNTRIES_OPTIONS.find(c => c.id === '2840') || null
    );
    const [language, setLanguage] = useState<SelectOption | null>(
        LANGUAGES_OPTIONS.find(l => l.id === '1000') || null
    );

    // --- FUNNEL LOGIC ---
    useEffect(() => {
        if (initialImportedCategories && initialImportedCategories.length > 0) {
            setCategories(initialImportedCategories);
            setSelectedCategoryIds(new Set());
            setSelectedGroupIds(new Set());
            setSelectedKeywordsByGroup(new Map());
            setNewKeywordsByGroup(new Map());

            if (mainContentRef.current) {
                mainContentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }
    }, [initialImportedCategories, mainContentRef]);

    const generateId = (prefix: string) => `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;

    const findGroup = (groupId: string): [CategoryType, GroupType] | [null, null] => {
        for (const cat of categories) {
            const group = cat.groups.find(g => g.id === groupId);
            if (group) return [cat, group];
        }
        return [null, null];
    }

    // --- SELECTION LOGIC ---
    const handleCategorySelect = (categoryId: string, isSelected: boolean) => {
        const newSelectedCatIds = new Set(selectedCategoryIds);
        const newSelectedGroupIds = new Set(selectedGroupIds);
        const newSelectedKeywordsMap = new Map(selectedKeywordsByGroup);
        const category = categories.find(c => c.id === categoryId);
        if (!category) return;

        if (isSelected) {
            newSelectedCatIds.add(categoryId);
            category.groups.forEach(g => {
                newSelectedGroupIds.add(g.id);
                newSelectedKeywordsMap.set(g.id, new Set(g.keywords));
            });
        } else {
            newSelectedCatIds.delete(categoryId);
            category.groups.forEach(g => {
                newSelectedGroupIds.delete(g.id);
                newSelectedKeywordsMap.delete(g.id);
            });
        }
        setSelectedCategoryIds(newSelectedCatIds);
        setSelectedGroupIds(newSelectedGroupIds);
        setSelectedKeywordsByGroup(newSelectedKeywordsMap);
    };

    const handleGroupSelect = (categoryId: string, groupId: string, isSelected: boolean) => {
        const newSelectedGroupIds = new Set(selectedGroupIds);
        const newSelectedCatIds = new Set(selectedCategoryIds);
        const newSelectedKeywordsMap = new Map(selectedKeywordsByGroup);
        const category = categories.find(c => c.id === categoryId);
        const group = category?.groups.find(g => g.id === groupId);
        if (!category || !group) return;

        if (isSelected) {
            newSelectedGroupIds.add(groupId);
            newSelectedKeywordsMap.set(groupId, new Set(group.keywords));
            if (category.groups.every(g => newSelectedGroupIds.has(g.id))) {
                newSelectedCatIds.add(categoryId);
            }
        } else {
            newSelectedGroupIds.delete(groupId);
            newSelectedKeywordsMap.delete(groupId);
            newSelectedCatIds.delete(categoryId);
        }
        setSelectedGroupIds(newSelectedGroupIds);
        setSelectedCategoryIds(newSelectedCatIds);
        setSelectedKeywordsByGroup(newSelectedKeywordsMap);
    };

    const handleKeywordSelect = (categoryId: string, groupId: string, keyword: string, isSelected: boolean) => {
        const newSelectedKeywordsMap = new Map(selectedKeywordsByGroup);
        const newSelectedGroupIds = new Set(selectedGroupIds);
        const newSelectedCatIds = new Set(selectedCategoryIds);

        const groupKeywords = new Set(newSelectedKeywordsMap.get(groupId) || []);
        if (isSelected) {
            groupKeywords.add(keyword);
        } else {
            groupKeywords.delete(keyword);
        }
        newSelectedKeywordsMap.set(groupId, groupKeywords);

        const [category, group] = findGroup(groupId);
        if (!category || !group) return;

        if (isSelected) {
            if (group.keywords.every(k => groupKeywords.has(k))) {
                newSelectedGroupIds.add(groupId);
                if (category.groups.every(g => newSelectedGroupIds.has(g.id))) {
                    newSelectedCatIds.add(categoryId);
                }
            }
        } else {
            newSelectedGroupIds.delete(groupId);
            newSelectedCatIds.delete(categoryId);
        }

        setSelectedKeywordsByGroup(newSelectedKeywordsMap);
        setSelectedGroupIds(newSelectedGroupIds);
        setSelectedCategoryIds(newSelectedCatIds);
    };

    // --- DATA MUTATION ---
    const handleAddCategory = () => {
        const newCategory: CategoryType = {
            id: generateId('c'),
            name: 'New Category',
            groups: [],
        };
        setCategories(prev => [...prev, newCategory]);
        setTimeout(() => mainContentRef.current?.scrollTo({ top: mainContentRef.current.scrollHeight, behavior: 'smooth' }), 100);
    };

    const handleAddGroup = (categoryId: string) => {
        setCategories(prev => prev.map(cat => {
            if (cat.id === categoryId) {
                return {
                    ...cat,
                    groups: [...cat.groups, { id: generateId('g'), name: 'New Group', keywords: [] }]
                };
            }
            return cat;
        }));
    };

    const handleCategoryNameSave = (categoryId: string, newName: string) => {
        setCategories(prev => prev.map(cat => cat.id === categoryId ? { ...cat, name: newName } : cat));
    };

    const handleCategoryRemove = (categoryId: string) => {
        if (!window.confirm("Delete this category?")) return;
        const category = categories.find(c => c.id === categoryId);
        if (!category) return;
        setCategories(prev => prev.filter(c => c.id !== categoryId));

        const newSelectedCatIds = new Set(selectedCategoryIds);
        newSelectedCatIds.delete(categoryId);
        setSelectedCategoryIds(newSelectedCatIds);
        const newSelectedGroupIds = new Set(selectedGroupIds);
        const newSelectedKeywordsMap = new Map(selectedKeywordsByGroup);
        category.groups.forEach(g => {
            newSelectedGroupIds.delete(g.id);
            newSelectedKeywordsMap.delete(g.id);
        });
        setSelectedGroupIds(newSelectedGroupIds);
        setSelectedKeywordsByGroup(newSelectedKeywordsMap);
    };

    const handleGroupNameSave = (categoryId: string, groupId: string, newName: string) => {
        setCategories(prev => prev.map(cat => cat.id === categoryId ? { ...cat, groups: cat.groups.map(grp => grp.id === groupId ? { ...grp, name: newName } : grp) } : cat));
    };

    const handleGroupRemove = (categoryId: string, groupId: string) => {
        if (!window.confirm("Delete this group?")) return;
        setCategories(prev => prev.map(cat => cat.id === categoryId ? { ...cat, groups: cat.groups.filter(g => g.id !== groupId) } : cat));

        const newSelectedGroupIds = new Set(selectedGroupIds);
        newSelectedGroupIds.delete(groupId);
        setSelectedGroupIds(newSelectedGroupIds);
        const newSelectedKeywordsMap = new Map(selectedKeywordsByGroup);
        newSelectedKeywordsMap.delete(groupId);
        setSelectedKeywordsByGroup(newSelectedKeywordsMap);
    };

    const handleKeywordSave = (categoryId: string, groupId: string, newKeywords: string[]) => {
        setCategories(prev => prev.map(cat => cat.id === categoryId ? { ...cat, groups: cat.groups.map(grp => grp.id === groupId ? { ...grp, keywords: newKeywords } : grp) } : cat));
        const newSelectedKeywordsMap = new Map(selectedKeywordsByGroup);
        newSelectedKeywordsMap.delete(groupId);
        setSelectedKeywordsByGroup(newSelectedKeywordsMap);
    };

    // --- ENRICHMENT LOGIC ---
    const enrichSingleGroup = async (group: GroupType) => {
        if (!country || !language) {
            alert("Please select a Country and Language.");
            return;
        }

        setEnrichingGroupIds(prev => new Set(prev).add(group.id));

        try {
            // ▼▼▼ ROBUSTNESS: Use Group Name if keywords are empty ▼▼▼
            const seedKeywords = group.keywords.length > 0 ? group.keywords : [group.name];

            const result = await mockApi.enrichKeywords(seedKeywords, language.id, country.id);

            MetricsCache.cacheResults(result);

            const oldKeywordsSet = new Set(group.keywords);
            const allResultKeywords = result.map(r => r.text);
            const newlyAddedSet = new Set<string>();

            allResultKeywords.forEach(k => {
                if (!oldKeywordsSet.has(k)) newlyAddedSet.add(k);
            });

            // 1. Update Data
            setCategories(prev => prev.map(cat => ({
                ...cat,
                groups: cat.groups.map(g => {
                    if (g.id === group.id) {
                        return { ...g, keywords: allResultKeywords };
                    }
                    return g;
                })
            })));

            // 2. Highlight "New"
            setNewKeywordsByGroup(prev => {
                const next = new Map(prev);
                next.set(group.id, newlyAddedSet);
                return next;
            });

            // 3. Auto-Select New Keywords
            setSelectedKeywordsByGroup(prev => {
                const next = new Map(prev);
                const currentGroupSelection = next.get(group.id) || new Set();

                newlyAddedSet.forEach(newKw => currentGroupSelection.add(newKw));

                next.set(group.id, currentGroupSelection);
                return next;
            });

        } catch (err) {
            console.error(`Failed to enrich group ${group.name}`, err);
        } finally {
            setEnrichingGroupIds(prev => {
                const next = new Set(prev);
                next.delete(group.id);
                return next;
            });
        }
    };

    const handleGroupEnrich = (group: GroupType) => {
        enrichSingleGroup(group);
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
            await enrichSingleGroup(group);
        }
    };

    // --- ANALYSIS LOGIC ---
    const clearNewKeywords = () => {
        setNewKeywordsByGroup(new Map());
    };

    const handleCategoryRunAnalysis = (category: CategoryType) => {
        if (category.groups.length === 0) return; // Guard
        clearNewKeywords();
        onRunAnalysis([{ ...category, groups: [...category.groups] }], country?.id, language?.id);
    };

    const handleGroupRunAnalysis = (category: CategoryType, group: GroupType) => {
        if (group.keywords.length === 0) return; // Guard
        clearNewKeywords();
        onRunAnalysis([{ ...category, groups: [group] }], country?.id, language?.id);
    };

    const handleFooterRunAnalysis = () => {
        clearNewKeywords();
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
        onRunAnalysis(selection, country?.id, language?.id);
    };

    const handleFooterClear = () => {
        setSelectedCategoryIds(new Set());
        setSelectedGroupIds(new Set());
        setSelectedKeywordsByGroup(new Map());
    };

    const handleFooterSelectAll = () => {
        const newSelectedCatIds = new Set<string>();
        const newSelectedGroupIds = new Set<string>();
        const newSelectedKeywordsMap = new Map<string, Set<string>>();
        categories.forEach(cat => {
            newSelectedCatIds.add(cat.id);
            cat.groups.forEach(group => {
                newSelectedGroupIds.add(group.id);
                newSelectedKeywordsMap.set(group.id, new Set(group.keywords));
            });
        });
        setSelectedCategoryIds(newSelectedCatIds);
        setSelectedGroupIds(newSelectedGroupIds);
        setSelectedKeywordsByGroup(newSelectedKeywordsMap);
    };

    const totalSelections = selectedCategoryIds.size + selectedGroupIds.size + selectedKeywordsByGroup.size;

    return (
        <div className={styles.pageContainer}>
            <div className={styles.content}>
                <div className={styles.pageHeader}>
                    <h1 className="text-2xl font-bold text-gray-800">Category Planner</h1>
                    <button className={styles.primaryButton} onClick={handleAddCategory}>
                        <HiPlus size={16} className="mr-1" />
                        Add Category
                    </button>
                </div>

                <DataSourceSettings
                    country={country}
                    language={language}
                    onCountryChange={setCountry}
                    onLanguageChange={setLanguage}
                />

                {categories.map((category) => (
                    <CategoryComponent
                        key={category.id}
                        category={category}
                        initialOpen={categories.length === 1}
                        selected={selectedCategoryIds.has(category.id)}
                        onSelect={(isSelected) => handleCategorySelect(category.id, isSelected)}
                        selectedGroupIds={selectedGroupIds}
                        onGroupSelect={(groupId, isSelected) => handleGroupSelect(category.id, groupId, isSelected)}
                        onRemove={() => handleCategoryRemove(category.id)}
                        onNameSave={(newName) => handleCategoryNameSave(category.id, newName)}
                        onEnrich={() => {
                            const groups = category.groups;
                            (async () => { for (const g of groups) await enrichSingleGroup(g); })();
                        }}
                        onRunAnalysis={() => handleCategoryRunAnalysis(category)}
                        onGroupAdd={handleAddGroup}
                        onGroupRemove={(groupId) => handleGroupRemove(category.id, groupId)}
                        onGroupNameSave={(groupId, newName) => handleGroupNameSave(category.id, groupId, newName)}
                        onGroupEnrich={(groupId) => {
                            const grp = category.groups.find(g => g.id === groupId);
                            if (grp) handleGroupEnrich(grp);
                        }}
                        onGroupRunAnalysis={(groupId) => handleGroupRunAnalysis(category, category.groups.find(g => g.id === groupId)!)}
                        selectedKeywordsByGroup={selectedKeywordsByGroup}
                        onKeywordSelect={(groupId, keyword, isSelected) =>
                            handleKeywordSelect(category.id, groupId, keyword, isSelected)
                        }
                        onKeywordSave={(groupId, newKw) => handleKeywordSave(category.id, groupId, newKw)}
                        onKeywordCopy={() => {}}
                        enrichingGroupIds={enrichingGroupIds}
                        newKeywordsByGroup={newKeywordsByGroup}
                    />
                ))}

                {categories.length === 0 && (
                    <div className="flex flex-col items-center justify-center p-12 text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
                        <p>No categories yet. Use the Website Scanner or add one manually.</p>
                    </div>
                )}

                <div className={styles.contentSpacer} />
            </div>

            <AnimatePresence>
                {totalSelections > 0 && (
                    <motion.div
                        className={styles.contextualFooter}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    >
                        <button className={styles.actionButton} onClick={handleFooterEnrich}>
                            Enrich Selected
                        </button>
                        <button className={styles.actionButton} onClick={handleFooterRunAnalysis}>
                            Run Analysis
                        </button>
                        <button className={styles.secondaryButton} onClick={handleFooterSelectAll}>
                            Select All
                        </button>
                        <button className={styles.secondaryButton} onClick={handleFooterClear}>
                            Clear Selections
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CategoryManagement;