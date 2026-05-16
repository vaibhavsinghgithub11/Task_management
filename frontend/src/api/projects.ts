import api from './axios';
import type { Project, CreateProjectData, ApiResponse } from '../types';

/**
 * Project API calls
 */

export const projectApi = {
  // Get all projects
  getAll: async (): Promise<ApiResponse<Project[]>> => {
    const response = await api.get<ApiResponse<Project[]>>('/projects');
    return response.data;
  },

  // Get single project
  getById: async (id: string): Promise<ApiResponse<Project>> => {
    const response = await api.get<ApiResponse<Project>>(`/projects/${id}`);
    return response.data;
  },

  // Create project
  create: async (data: CreateProjectData): Promise<ApiResponse<Project>> => {
    const response = await api.post<ApiResponse<Project>>('/projects', data);
    return response.data;
  },

  // Update project
  update: async (id: string, data: Partial<CreateProjectData>): Promise<ApiResponse<Project>> => {
    const response = await api.put<ApiResponse<Project>>(`/projects/${id}`, data);
    return response.data;
  },

  // Delete project
  delete: async (id: string): Promise<ApiResponse<{}>> => {
    const response = await api.delete<ApiResponse<{}>>(`/projects/${id}`);
    return response.data;
  },

  // Add member to project
  addMember: async (projectId: string, userId: string): Promise<ApiResponse<Project>> => {
    const response = await api.post<ApiResponse<Project>>(`/projects/${projectId}/members`, { userId });
    return response.data;
  },

  // Remove member from project
  removeMember: async (projectId: string, userId: string): Promise<ApiResponse<Project>> => {
    const response = await api.delete<ApiResponse<Project>>(`/projects/${projectId}/members/${userId}`);
    return response.data;
  },

  // Get my created projects
  getMyCreated: async (): Promise<ApiResponse<Project[]>> => {
    const response = await api.get<ApiResponse<Project[]>>('/projects/my/created');
    return response.data;
  },
};
