import { apiClient } from '../apiClient';
import {
    Project, ProjectMetadata,
    CreateProjectPayload, UpdateProjectPayload,
    CreateCategoryPayload, UpdateCategoryPayload,
    CreateGroupPayload, UpdateGroupPayload,
    CreateKeywordPayload, BulkCreateKeywordsPayload, Keyword,
    CreateProjectTreePayload // Imported
} from '../../types';

export const projectService = {
    // --- Projects ---
    listProjects: async (skip = 0, limit = 100) => {
        return apiClient.get<{ data: ProjectMetadata[], count: number }>(`/api/v1/projects/?skip=${skip}&limit=${limit}`);
    },

    getProject: async (id: string) => {
        return apiClient.get<Project>(`/api/v1/projects/${id}`);
    },

    createProject: async (data: CreateProjectPayload) => {
        return apiClient.post<Project>('/api/v1/projects/', data);
    },

    // ▼▼▼ NEW: Atomic Tree Creation ▼▼▼
    createProjectTree: async (data: CreateProjectTreePayload) => {
        return apiClient.post<Project>('/api/v1/projects/tree', data);
    },

    updateProject: async (id: string, data: UpdateProjectPayload) => {
        return apiClient.patch<Project>(`/api/v1/projects/${id}`, data);
    },

    deleteProject: async (id: string) => {
        return apiClient.delete<{ message: string }>(`/api/v1/projects/${id}`);
    },

    // --- Categories ---
    createCategory: async (projectId: string, data: CreateCategoryPayload) => {
        return apiClient.post(`/api/v1/projects/${projectId}/categories`, data);
    },

    updateCategory: async (id: string, data: UpdateCategoryPayload) => {
        return apiClient.patch(`/api/v1/projects/categories/${id}`, data);
    },

    deleteCategory: async (id: string) => {
        return apiClient.delete(`/api/v1/projects/categories/${id}`);
    },

    // --- Groups ---
    createGroup: async (categoryId: string, data: CreateGroupPayload) => {
        return apiClient.post(`/api/v1/projects/categories/${categoryId}/groups`, data);
    },

    updateGroup: async (id: string, data: UpdateGroupPayload) => {
        return apiClient.patch(`/api/v1/projects/groups/${id}`, data);
    },

    deleteGroup: async (id: string) => {
        return apiClient.delete(`/api/v1/projects/groups/${id}`);
    },

    // --- Keywords ---
    createKeyword: async (groupId: string, data: CreateKeywordPayload) => {
        return apiClient.post(`/api/v1/projects/groups/${groupId}/keywords`, data);
    },

    bulkCreateKeywords: async (groupId: string, data: BulkCreateKeywordsPayload) => {
        return apiClient.post<Keyword[]>(`/api/v1/projects/groups/${groupId}/keywords/bulk`, data);
    },

    deleteKeyword: async (id: string) => {
        return apiClient.delete(`/api/v1/projects/keywords/${id}`);
    }
};