import api from './axios';
import type { User, ApiResponse } from '../types';

/**
 * User API calls (Admin only)
 */

export const userApi = {
  // Get all users
  getAll: async (): Promise<ApiResponse<User[]>> => {
    const response = await api.get<ApiResponse<User[]>>('/users');
    return response.data;
  },

  // Get single user
  getById: async (id: string): Promise<ApiResponse<User>> => {
    const response = await api.get<ApiResponse<User>>(`/users/${id}`);
    return response.data;
  },

  // Update user role
  updateRole: async (id: string, role: 'admin' | 'member'): Promise<ApiResponse<User>> => {
    const response = await api.put<ApiResponse<User>>(`/users/${id}/role`, { role });
    return response.data;
  },

  // Delete user
  delete: async (id: string): Promise<ApiResponse<{}>> => {
    const response = await api.delete<ApiResponse<{}>>(`/users/${id}`);
    return response.data;
  },

  // Get user statistics
  getStats: async (): Promise<ApiResponse<any>> => {
    const response = await api.get<ApiResponse<any>>('/users/stats');
    return response.data;
  },
};
