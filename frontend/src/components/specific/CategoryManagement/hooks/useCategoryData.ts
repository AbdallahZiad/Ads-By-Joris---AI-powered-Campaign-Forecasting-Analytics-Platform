import { useState, useEffect } from 'react';
import { Category } from '../../../../types';

export const useCategoryData = (initialData?: Category[], scrollRef?: React.RefObject<HTMLElement | null>) => {
    const [categories, setCategories] = useState<Category[]>([]);

    const generateId = (prefix: string) => `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;

    // Funnel Logic: Overwrite when new import arrives
    useEffect(() => {
        if (initialData && initialData.length > 0) {
            setCategories(initialData);
            if (scrollRef?.current) {
                scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }
    }, [initialData, scrollRef]);

    const addCategory = () => {
        const newCategory: Category = {
            id: generateId('c'),
            name: 'New Category',
            groups: [],
        };
        setCategories(prev => [...prev, newCategory]);
        setTimeout(() => scrollRef?.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' }), 100);
    };

    const addGroup = (categoryId: string) => {
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

    const updateCategoryName = (categoryId: string, newName: string) => {
        setCategories(prev => prev.map(cat => cat.id === categoryId ? { ...cat, name: newName } : cat));
    };

    const removeCategory = (categoryId: string) => {
        if (!window.confirm("Delete this category?")) return;
        setCategories(prev => prev.filter(c => c.id !== categoryId));
    };

    const updateGroupName = (categoryId: string, groupId: string, newName: string) => {
        setCategories(prev => prev.map(cat => cat.id === categoryId ? { ...cat, groups: cat.groups.map(grp => grp.id === groupId ? { ...grp, name: newName } : grp) } : cat));
    };

    const removeGroup = (categoryId: string, groupId: string) => {
        if (!window.confirm("Delete this group?")) return;
        setCategories(prev => prev.map(cat => cat.id === categoryId ? { ...cat, groups: cat.groups.filter(g => g.id !== groupId) } : cat));
    };

    const updateGroupKeywords = (categoryId: string, groupId: string, newKeywords: string[]) => {
        setCategories(prev => prev.map(cat => cat.id === categoryId ? { ...cat, groups: cat.groups.map(grp => grp.id === groupId ? { ...grp, keywords: newKeywords } : grp) } : cat));
    };

    return {
        categories,
        setCategories, // Exposed for enrichment to update data directly
        addCategory,
        addGroup,
        updateCategoryName,
        removeCategory,
        updateGroupName,
        removeGroup,
        updateGroupKeywords
    };
};