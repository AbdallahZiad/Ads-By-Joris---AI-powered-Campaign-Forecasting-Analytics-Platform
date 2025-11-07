import { useState } from 'react';
import {Category} from './types'

import CategoryComponent from './components/specific/Category/Category';

const MOCK_DATA: Category[] = [
    {
        id: 'c1',
        name: 'Apple Products',
        groups: [
            {
                id: 'g1',
                name: 'Mac Computers',
                keywords: ['macbook pro', 'macbook air', 'imac', 'mac mini', 'mac studio'],
            },
            {
                id: 'g2',
                name: 'Mobile Devices',
                keywords: ['iphone 15 pro', 'ipad air', 'apple watch ultra'],
            },
        ],
    },
    {
        id: 'c2',
        name: 'Software',
        groups: [
            {
                id: 'g3',
                name: 'Operating Systems',
                keywords: ['macOS Sonoma', 'iOS 17', 'watchOS'],
            },
        ],
    },
];

function App() {
    const [categories, setCategories] = useState<Category[]>(MOCK_DATA);
    const [selectedCategoryIds, setSelectedCategoryIds] = useState<Set<string>>(new Set());
    const [selectedGroupIds, setSelectedGroupIds] = useState<Set<string>>(new Set());

    // === SELECTION HANDLERS (Unchanged) ===
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

    // === REMOVAL HANDLERS (NEW) ===

    const handleCategoryRemove = (categoryId: string) => {
        if (window.confirm("Are you sure you want to delete this category?")) {
            setCategories(prev => prev.filter(c => c.id !== categoryId));
            // Cleanup selection state
            const newSelectedCatIds = new Set(selectedCategoryIds);
            newSelectedCatIds.delete(categoryId);
            setSelectedCategoryIds(newSelectedCatIds);
        }
    };

    const handleGroupRemove = (categoryId: string, groupId: string) => {
        if (window.confirm("Are you sure you want to delete this group?")) {
            setCategories(prev => prev.map(cat =>
                cat.id === categoryId
                    ? { ...cat, groups: cat.groups.filter(g => g.id !== groupId) }
                    : cat
            ));
            // Cleanup selection state
            const newSelectedGroupIds = new Set(selectedGroupIds);
            newSelectedGroupIds.delete(groupId);
            setSelectedGroupIds(newSelectedGroupIds);
        }
    };

    // === DATA HANDLERS (Unchanged) ===
    const handleCategoryNameSave = (categoryId: string, newName: string) => {
        setCategories(prev => prev.map(cat => cat.id === categoryId ? { ...cat, name: newName } : cat));
    };
    const handleGroupNameSave = (categoryId: string, groupId: string, newName: string) => {
        setCategories(prev => prev.map(cat => cat.id === categoryId ? { ...cat, groups: cat.groups.map(grp => grp.id === groupId ? { ...grp, name: newName } : grp) } : cat));
    };
    const handleKeywordSave = (categoryId: string, groupId: string, newKeywords: string[]) => {
        setCategories(prev => prev.map(cat => cat.id === categoryId ? { ...cat, groups: cat.groups.map(grp => grp.id === groupId ? { ...grp, keywords: newKeywords } : grp) } : cat));
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '800px', margin: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: '600', margin: 0 }}>
                    Category Management Demo
                </h1>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    Selected: {selectedCategoryIds.size} Cats, {selectedGroupIds.size} Groups
                </div>
            </div>

            {categories.map((category) => (
                <CategoryComponent
                    key={category.id}
                    category={category}
                    initialOpen={category.id === 'c1'}
                    selected={selectedCategoryIds.has(category.id)}
                    onSelect={(isSelected) => handleCategorySelect(category.id, isSelected)}
                    selectedGroupIds={selectedGroupIds}
                    onGroupSelect={(groupId, isSelected) => handleGroupSelect(category.id, groupId, isSelected)}

                    // ▼▼▼ New Removal Handlers ▼▼▼
                    onRemove={() => handleCategoryRemove(category.id)}
                    onGroupRemove={(groupId) => handleGroupRemove(category.id, groupId)}
                    // ▲▲▲ New Removal Handlers ▲▲▲

                    onNameSave={(newName) => handleCategoryNameSave(category.id, newName)}
                    onEnrich={() => alert(`Enrich Cat ${category.name}`)}
                    onRunAnalysis={() => alert(`Run Analysis Cat ${category.name}`)}
                    onGroupNameSave={(groupId, newName) => handleGroupNameSave(category.id, groupId, newName)}
                    onGroupEnrich={(groupId) => alert(`Enrich Group ${groupId}`)}
                    onGroupRunAnalysis={(groupId) => alert(`Run Analysis Group ${groupId}`)}
                    onKeywordSave={(groupId, newKw) => handleKeywordSave(category.id, groupId, newKw)}
                    onKeywordCopy={(groupId, txt) => navigator.clipboard.writeText(txt)}
                    onKeywordEdit={() => {}}
                />
            ))}
        </div>
    );
}

export default App;