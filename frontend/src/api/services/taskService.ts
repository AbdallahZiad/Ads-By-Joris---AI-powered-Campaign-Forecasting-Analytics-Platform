import { apiClient } from '../apiClient';
import { TaskResponse } from '../../types';

export const taskService = {
    // Poll the status of a specific task
    getTaskStatus: async <T>(taskId: string): Promise<TaskResponse<T>> => {
        return apiClient.get<TaskResponse<T>>(`/api/v1/tasks/${taskId}`);
    }
};