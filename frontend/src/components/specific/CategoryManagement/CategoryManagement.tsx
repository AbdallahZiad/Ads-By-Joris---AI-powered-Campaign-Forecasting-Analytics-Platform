import React, { useState } from 'react';
import { Category as CategoryType, Group as GroupType } from '../../../types'; // Assuming types are in App.tsx
import Collapsible from '../../common/Collapsible/Collapsible';
import CategoryComponent from '../Category/Category';
import styles from './CategoryManagement.module.css';

// --- MOCK DATA (Internal for now) ---
// In the future, this would be passed as a prop or fetched
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

// --- COMPONENT PROPS ---
interface CategoryManagementProps {
    /**
     * The single callback for all analysis actions.
     * Returns a filtered list of categories containing only the groups to be analyzed.
     */
    onRunAnalysis: (selection: CategoryType[]) => void;
    // We can add an onEnrich prop later if needed
}

const CategoryManagement: React.FC<CategoryManagementProps> = ({
                                                                   onRunAnalysis,
                                                               }) => {
    const [categories, setCategories] = useState<CategoryType[]>(MOCK_DATA);
    const [selectedCategoryIds, setSelectedCategoryIds] = useState<Set<string>>(new Set());
    const [selectedGroupIds, setSelectedGroupIds] = useState<Set<string>>(new Set());

    // --- SELECTION LOGIC ---
    const handleCategorySelect = (categoryId: string, isSelected: boolean) => {
        const newSelectedCatIds = new Set(selectedCategoryIds);
        const newSelectedGroupIds = new Set(selectedGroupIds);
        const category = categories.find(c => c.id === categoryId);
        if (!category) return;

        if (isSelected) {
            newSelectedCatIds.add(categoryId);
            category.groups.forEach(g => newSelectedGroupIds.add(g.id));
        } else {
            newSelectedCatIds.delete(categoryId);
            category.groups.forEach(g => newSelectedGroupIds.delete(g.id));
        }
        setSelectedCategoryIds(newSelectedCatIds);
        setSelectedGroupIds(newSelectedGroupIds);
    };

    const handleGroupSelect = (categoryId: string, groupId: string, isSelected: boolean) => {
        const newSelectedGroupIds = new Set(selectedGroupIds);
        const newSelectedCatIds = new Set(selectedCategoryIds);
        if (isSelected) {
            newSelectedGroupIds.add(groupId);
            const category = categories.find(c => c.id === categoryId);
            if (category && category.groups.every(g => newSelectedGroupIds.has(g.id))) {
                newSelectedCatIds.add(categoryId);
            }
        } else {
            newSelectedGroupIds.delete(groupId);
            newSelectedCatIds.delete(categoryId);
        }
        setSelectedGroupIds(newSelectedGroupIds);
        setSelectedCategoryIds(newSelectedCatIds);
    };

    // --- DATA MUTATION LOGIC ---
    const handleCategoryNameSave = (categoryId: string, newName: string) => {
        setCategories(prev => prev.map(cat => cat.id === categoryId ? { ...cat, name: newName } : cat));
    };
    const handleCategoryRemove = (categoryId: string) => {
        if (window.confirm("Are you sure?")) {
            setCategories(prev => prev.filter(c => c.id !== categoryId));
            // Cleanup selection
            const newSelectedCatIds = new Set(selectedCategoryIds);
            newSelectedCatIds.delete(categoryId);
            setSelectedCategoryIds(newSelectedCatIds);
        }
    };
    const handleGroupNameSave = (categoryId: string, groupId: string, newName: string) => {
        setCategories(prev => prev.map(cat => cat.id === categoryId ? { ...cat, groups: cat.groups.map(grp => grp.id === groupId ? { ...grp, name: newName } : grp) } : cat));
    };
    const handleGroupRemove = (categoryId: string, groupId: string) => {
        if (window.confirm("Are you sure?")) {
            setCategories(prev => prev.map(cat =>
                cat.id === categoryId
                    ? { ...cat, groups: cat.groups.filter(g => g.id !== groupId) }
                    : cat
            ));
            const newSelectedGroupIds = new Set(selectedGroupIds);
            newSelectedGroupIds.delete(groupId);
            setSelectedGroupIds(newSelectedGroupIds);
        }
    };
    const handleKeywordSave = (categoryId: string, groupId: string, newKeywords: string[]) => {
        setCategories(prev => prev.map(cat => cat.id === categoryId ? { ...cat, groups: cat.groups.map(grp => grp.id === groupId ? { ...grp, keywords: newKeywords } : grp) } : cat));
    };

    // --- ANALYSIS/ACTION LOGIC ---
    const handleCategoryEnrich = (category: CategoryType) => {
        alert(`Enriching Category: ${category.name}`);
    };
    const handleGroupEnrich = (group: GroupType) => {
        alert(`Enriching Group: ${group.name}`);
    };

    const handleCategoryRunAnalysis = (category: CategoryType) => {
        // Run analysis on the specific category (all its groups)
        const selection = [{ ...category, groups: [...category.groups] }];
        onRunAnalysis(selection);
    };
    const handleGroupRunAnalysis = (category: CategoryType, group: GroupType) => {
        // Run analysis on a specific group
        const selection = [{ ...category, groups: [group] }];
        onRunAnalysis(selection);
    };

    // --- FOOTER ACTION LOGIC ---
    const handleFooterRunAnalysis = () => {
        // Build the selection list based on selectedGroupIds
        const selection: CategoryType[] = [];
        categories.forEach(cat => {
            const selectedGroups = cat.groups.filter(g => selectedGroupIds.has(g.id));
            if (selectedGroups.length > 0) {
                selection.push({ ...cat, groups: selectedGroups });
            }
        });

        if (selection.length === 0) {
            alert("Please select at least one group to run analysis on.");
            return;
        }
        onRunAnalysis(selection);
    };

    const handleFooterEnrich = () => {
        alert("Enrich on selected items... (not implemented)");
    };

    const handleFooterClear = () => {
        setSelectedCategoryIds(new Set());
        setSelectedGroupIds(new Set());
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
                        <button className={styles.clearButton} onClick={handleFooterClear}>
                            Clear Selections
                        </button>
                    </div>
                }
            >
                {categories.map((category) => (
                    <CategoryComponent
                        key={category.id}
                        category={category}
                        initialOpen={false}
                        selected={selectedCategoryIds.has(category.id)}
                        onSelect={(isSelected) => handleCategorySelect(category.id, isSelected)}
                        selectedGroupIds={selectedGroupIds}
                        onGroupSelect={(groupId, isSelected) => handleGroupSelect(category.id, groupId, isSelected)}
                        onRemove={() => handleCategoryRemove(category.id)}
                        onNameSave={(newName) => handleCategoryNameSave(category.id, newName)}
                        onEnrich={() => handleCategoryEnrich(category)}
                        onRunAnalysis={() => handleCategoryRunAnalysis(category)}
                        onGroupRemove={(groupId) => handleGroupRemove(category.id, groupId)}
                        onGroupNameSave={(groupId, newName) => handleGroupNameSave(category.id, groupId, newName)}
                        onGroupEnrich={(groupId) => handleGroupEnrich(category.groups.find(g => g.id === groupId)!)}
                        onGroupRunAnalysis={(groupId) => handleGroupRunAnalysis(category, category.groups.find(g => g.id === groupId)!)}
                        onKeywordSave={(groupId, newKw) => handleKeywordSave(category.id, groupId, newKw)}
                        onKeywordCopy={() => {}}
                    />
                ))}
            </Collapsible>
        </>
    );
};

export default CategoryManagement;