import React, { useState } from 'react';
import { Category as CategoryType, Group as GroupType } from '../../../types';
import Collapsible from '../../common/Collapsible/Collapsible';
import AddItemButton from '../../common/AddItemButton/AddItemButton';
import CategoryComponent from '../Category/Category';
import styles from './CategoryManagement.module.css';

// --- MOCK DATA ---
const MOCK_DATA: CategoryType[] = [
    {
        id: 'c1',
        name: '🍏 Apple Ecosystem',
        groups: [
            { id: 'g1', name: '💻 Mac Computers', keywords: ['MacBook Pro 16', 'MacBook Air M2', 'iMac 24-inch', 'Mac Mini M2 Pro', 'Mac Studio'] },
            { id: 'g2', name: '📱 Mobile Devices', keywords: ['iPhone 15 Pro Max', 'iPad Air 5th Gen', 'iPad Pro M4', 'iPhone SE (3rd Gen)', 'Apple Watch Series 9'] },
            { id: 'g3', name: '🎧 Accessories & Audio', keywords: ['AirPods Pro (2nd Gen)', 'AirPods Max', 'Apple Pencil (2nd Gen)', 'Magic Keyboard', 'AirTag'] },
        ],
    },
    {
        id: 'c2',
        name: '💾 Software & Services',
        groups: [
            { id: 'g4', name: '🖥️ Operating Systems', keywords: ['macOS Sonoma', 'iOS 17', 'iPadOS 17', 'watchOS 10', 'tvOS 17'] },
            { id: 'g5', name: '☁️ Cloud & Productivity', keywords: ['iCloud+', 'Final Cut Pro', 'Logic Pro', 'Pages', 'Numbers', 'Keynote'] },
            { id: 'g6', name: '🎬 Entertainment', keywords: ['Apple Music', 'Apple TV+', 'Apple Arcade', 'Apple Fitness+'] },
        ],
    },
    {
        id: 'c3',
        name: '⚡ General Electronics',
        groups: [
            { id: 'g7', name: '🎮 Gaming Consoles', keywords: ['PlayStation 5 (PS5)', 'Xbox Series X', 'Nintendo Switch OLED'] },
            { id: 'g8', name: '📷 Cameras & Optics', keywords: ['Sony Alpha a7 IV', 'Canon EOS R6 Mark II', 'GoPro HERO12 Black', 'Nikon Z8'] },
            { id: 'g9', name: '🏠 Smart Home Tech', keywords: ['Amazon Echo Dot', 'Google Nest Hub', 'Philips Hue Starter Kit', 'Ring Video Doorbell Pro'] },
        ],
    },
];

interface CategoryManagementProps {
    onRunAnalysis: (selection: CategoryType[]) => void;
}

const CategoryManagement: React.FC<CategoryManagementProps> = ({
                                                                   onRunAnalysis,
                                                               }) => {
    const [categories, setCategories] = useState<CategoryType[]>(MOCK_DATA);
    const [selectedCategoryIds, setSelectedCategoryIds] = useState<Set<string>>(new Set());
    const [selectedGroupIds, setSelectedGroupIds] = useState<Set<string>>(new Set());
    const [selectedKeywordsByGroup, setSelectedKeywordsByGroup] = useState<Map<string, Set<string>>>(new Map());

    // Simple ID generator for new items
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

    // --- DATA MUTATION LOGIC ---

    const handleAddCategory = () => {
        const newCategory: CategoryType = {
            id: generateId('c'),
            name: 'New Category',
            groups: [],
        };
        setCategories(prev => [...prev, newCategory]);
    };

    const handleAddGroup = (categoryId: string) => {
        setCategories(prev => prev.map(cat => {
            if (cat.id === categoryId) {
                return {
                    ...cat,
                    groups: [...cat.groups, {
                        id: generateId('g'),
                        name: 'New Group',
                        keywords: []
                    }]
                };
            }
            return cat;
        }));
    };

    const handleCategoryNameSave = (categoryId: string, newName: string) => {
        setCategories(prev => prev.map(cat => cat.id === categoryId ? { ...cat, name: newName } : cat));
    };
    const handleCategoryRemove = (categoryId: string) => {
        if (!window.confirm("Are you sure you want to delete this category?")) return;
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
        if (!window.confirm("Are you sure you want to delete this group?")) return;
        setCategories(prev => prev.map(cat =>
            cat.id === categoryId ? { ...cat, groups: cat.groups.filter(g => g.id !== groupId) } : cat
        ));
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

    // --- ANALYSIS/ACTION LOGIC ---
    const handleCategoryEnrich = (category: CategoryType) => { alert(`Enriching Category: ${category.name}`); };
    const handleGroupEnrich = (group: GroupType) => { alert(`Enriching Group: ${group.name}`); };
    const handleCategoryRunAnalysis = (category: CategoryType) => { onRunAnalysis([{ ...category, groups: [...category.groups] }]); };
    const handleGroupRunAnalysis = (category: CategoryType, group: GroupType) => { onRunAnalysis([{ ...category, groups: [group] }]); };

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
        onRunAnalysis(selection);
    };

    const handleFooterEnrich = () => { alert("Enrich on selected items... (not implemented)"); };

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

    return (
        <>
            <Collapsible
                title="Category Management"
                initialOpen={true}
                containerClassName={styles.managementContainer}
                contentClassName={styles.managementContent}
                footer={
                    <div className={styles.footer}>
                        <button className={styles.actionButton} onClick={handleFooterEnrich}>
                            Enrich
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
                    </div>
                }
            >
                {categories.map((category) => (
                    <CategoryComponent
                        key={category.id}
                        category={category}
                        initialOpen={category.id === 'c1'}
                        selected={selectedCategoryIds.has(category.id)}
                        onSelect={(isSelected) => handleCategorySelect(category.id, isSelected)}
                        selectedGroupIds={selectedGroupIds}
                        onGroupSelect={(groupId, isSelected) => handleGroupSelect(category.id, groupId, isSelected)}
                        onRemove={() => handleCategoryRemove(category.id)}
                        onNameSave={(newName) => handleCategoryNameSave(category.id, newName)}
                        onEnrich={() => handleCategoryEnrich(category)}
                        onRunAnalysis={() => handleCategoryRunAnalysis(category)}

                        onGroupAdd={handleAddGroup}

                        onGroupRemove={(groupId) => handleGroupRemove(category.id, groupId)}
                        onGroupNameSave={(groupId, newName) => handleGroupNameSave(category.id, groupId, newName)}
                        onGroupEnrich={(groupId) => handleGroupEnrich(category.groups.find(g => g.id === groupId)!)}
                        onGroupRunAnalysis={(groupId) => handleGroupRunAnalysis(category, category.groups.find(g => g.id === groupId)!)}
                        selectedKeywordsByGroup={selectedKeywordsByGroup}
                        onKeywordSelect={(groupId, keyword, isSelected) =>
                            handleKeywordSelect(category.id, groupId, keyword, isSelected)
                        }
                        onKeywordSave={(groupId, newKw) => handleKeywordSave(category.id, groupId, newKw)}
                        onKeywordCopy={() => {}}
                    />
                ))}

                <AddItemButton
                    label="Add Category"
                    onClick={handleAddCategory}
                    className="mt-2"
                />
            </Collapsible>
        </>
    );
};

export default CategoryManagement;