import api from './axios';
import type { Task, CreateTaskData, UpdateTaskStatusData, ApiResponse } from '../types';

/**
 * Task API calls
 */

export const taskApi = {
  // Get all tasks
  getAll: async (params?: {
    status?: string;
    priority?: string;
    project?: string;
    search?: string;
  }): Promise<ApiResponse<Task[]>> => {
    const response = await api.get<ApiResponse<Task[]>>('/tasks', { params });
    return response.data;
  },

  // Get single task
  getById: async (id: string): Promise<ApiResponse<Task>> => {
    const response = await api.get<ApiResponse<Task>>(`/tasks/${id}`);
    return response.data;
  },

  // Create task
  create: async (data: CreateTaskData): Promise<ApiResponse<Task>> => {
    const response = await api.post<ApiResponse<Task>>('/tasks', data);
    return response.data;
  },

  // Update task
  update: async (id: string, data: Partial<CreateTaskData>): Promise<ApiResponse<Task>> => {
    const response = await api.put<ApiResponse<Task>>(`/tasks/${id}`, data);
    return response.data;
  },

  // Update task status
  updateStatus: async (id: string, data: UpdateTaskStatusData): Promise<ApiResponse<Task>> => {
    const response = await api.patch<ApiResponse<Task>>(`/tasks/${id}/status`, data);
    return response.data;
  },

  // Delete task
  delete: async (id: string): Promise<ApiResponse<{}>> => {
    const response = await api.delete<ApiResponse<{}>>(`/tasks/${id}`);
    return response.data;
  },

  // Get tasks by project
  getByProject: async (projectId: string): Promise<ApiResponse<Task[]>> => {
    const response = await api.get<ApiResponse<Task[]>>(`/tasks/project/${projectId}`);
    return response.data;
  },

  // Get my assigned tasks
  getMyAssigned: async (): Promise<ApiResponse<Task[]>> => {
    const response = await api.get<ApiResponse<Task[]>>('/tasks/my/assigned');
    return response.data;
  },
};
