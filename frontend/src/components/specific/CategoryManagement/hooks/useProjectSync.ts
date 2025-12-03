import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectService } from '../../../../api/services/projectService';
import { Project, Keyword } from '../../../../types';

export const useProjectSync = (currentProjectId: string | null) => {
    const queryClient = useQueryClient();

    // --- Queries ---
    const projectsListQuery = useQuery({
        queryKey: ['projects-list'],
        queryFn: () => projectService.listProjects(),
    });

    const activeProjectQuery = useQuery({
        queryKey: ['project', currentProjectId],
        queryFn: () => projectService.getProject(currentProjectId!),
        enabled: !!currentProjectId,
        staleTime: 1000 * 60 * 5,
    });

    // --- Project Mutations ---

    const createProjectMutation = useMutation({
        mutationFn: projectService.createProject,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects-list'] })
    });

    const updateProjectMutation = useMutation({
        mutationFn: (vars: { id: string, title: string }) =>
            projectService.updateProject(vars.id, { title: vars.title }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects-list'] });
            queryClient.invalidateQueries({ queryKey: ['project', currentProjectId] });
        }
    });

    // ▼▼▼ NEW: Delete Project ▼▼▼
    const deleteProjectMutation = useMutation({
        mutationFn: projectService.deleteProject,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects-list'] });
            // If the active project was deleted, the parent component handles clearing the ID
        }
    });

    // --- Category Mutations ---

    const createCategoryMutation = useMutation({
        mutationFn: (vars: { projectId: string, name: string }) =>
            projectService.createCategory(vars.projectId, { name: vars.name }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['project', currentProjectId] })
    });

    const updateCategoryMutation = useMutation({
        mutationFn: (vars: { id: string, name: string }) =>
            projectService.updateCategory(vars.id, { name: vars.name }),
        onMutate: async (newItem) => {
            await queryClient.cancelQueries({ queryKey: ['project', currentProjectId] });
            const previous = queryClient.getQueryData<Project>(['project', currentProjectId]);

            if (previous) {
                queryClient.setQueryData<Project>(['project', currentProjectId], {
                    ...previous,
                    categories: previous.categories.map(c =>
                        c.id === newItem.id ? { ...c, name: newItem.name } : c
                    )
                });
            }
            return { previous };
        },
        onError: (_err, _vars, context) => {
            if (context?.previous) {
                queryClient.setQueryData(['project', currentProjectId], context.previous);
            }
        },
        onSettled: () => queryClient.invalidateQueries({ queryKey: ['project', currentProjectId] })
    });

    const deleteCategoryMutation = useMutation({
        mutationFn: projectService.deleteCategory,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['project', currentProjectId] })
    });

    // --- Group Mutations ---

    const createGroupMutation = useMutation({
        mutationFn: (vars: { categoryId: string, name: string }) =>
            projectService.createGroup(vars.categoryId, { name: vars.name }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['project', currentProjectId] })
    });

    const updateGroupMutation = useMutation({
        mutationFn: (vars: { id: string, name: string }) =>
            projectService.updateGroup(vars.id, { name: vars.name }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['project', currentProjectId] })
    });

    const deleteGroupMutation = useMutation({
        mutationFn: projectService.deleteGroup,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['project', currentProjectId] })
    });

    // --- Keyword Mutations ---

    const bulkAddKeywordsMutation = useMutation({
        mutationFn: (vars: { groupId: string, keywords: string[] }) =>
            projectService.bulkCreateKeywords(vars.groupId, { keywords: vars.keywords }),

        onMutate: async (vars) => {
            await queryClient.cancelQueries({ queryKey: ['project', currentProjectId] });
            const previous = queryClient.getQueryData<Project>(['project', currentProjectId]);

            if (previous) {
                const tempKeywords: Keyword[] = vars.keywords.map((txt, idx) => ({
                    id: `temp_${Date.now()}_${idx}`,
                    text: txt,
                    isNew: true
                }));

                const updatedCategories = previous.categories.map(cat => ({
                    ...cat,
                    groups: cat.groups.map(grp => {
                        if (grp.id === vars.groupId) {
                            return {
                                ...grp,
                                keywords: [...grp.keywords, ...tempKeywords]
                            };
                        }
                        return grp;
                    })
                }));

                queryClient.setQueryData<Project>(['project', currentProjectId], {
                    ...previous,
                    categories: updatedCategories
                });
            }
            return { previous };
        },
        onError: (_err, _vars, context) => {
            if (context?.previous) {
                queryClient.setQueryData(['project', currentProjectId], context.previous);
            }
        },
        onSettled: () => queryClient.invalidateQueries({ queryKey: ['project', currentProjectId] })
    });

    const deleteKeywordMutation = useMutation({
        mutationFn: projectService.deleteKeyword,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['project', currentProjectId] })
    });

    return {
        // Data
        projects: projectsListQuery.data?.data || [],
        isLoadingProjects: projectsListQuery.isLoading,
        activeProject: activeProjectQuery.data,
        isLoadingActive: activeProjectQuery.isLoading,
        isError: activeProjectQuery.isError,

        // Actions
        createProject: createProjectMutation.mutateAsync,
        updateProject: updateProjectMutation.mutateAsync,
        deleteProject: deleteProjectMutation.mutateAsync, // ▼▼▼ EXPOSED

        createCategory: createCategoryMutation.mutateAsync,
        updateCategory: updateCategoryMutation.mutateAsync,
        deleteCategory: deleteCategoryMutation.mutateAsync,

        createGroup: createGroupMutation.mutateAsync,
        updateGroup: updateGroupMutation.mutateAsync,
        deleteGroup: deleteGroupMutation.mutateAsync,

        bulkAddKeywords: bulkAddKeywordsMutation.mutateAsync,
        deleteKeyword: deleteKeywordMutation.mutateAsync,

        invalidateProject: () => queryClient.invalidateQueries({ queryKey: ['project', currentProjectId] })
    };
};