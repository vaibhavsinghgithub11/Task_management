import api from './axios';
import type { DashboardStats, TasksByPriority, TasksByStatus, Task, TeamPerformance, ApiResponse } from '../types';

/**
 * Dashboard API calls
 */

export const dashboardApi = {
  // Get dashboard statistics
  getStats: async (): Promise<ApiResponse<DashboardStats>> => {
    const response = await api.get<ApiResponse<DashboardStats>>('/dashboard/stats');
    return response.data;
  },

  // Get tasks by priority
  getTasksByPriority: async (): Promise<ApiResponse<TasksByPriority[]>> => {
    const response = await api.get<ApiResponse<TasksByPriority[]>>('/dashboard/tasks/by-priority');
    return response.data;
  },

  // Get tasks by status
  getTasksByStatus: async (): Promise<ApiResponse<TasksByStatus[]>> => {
    const response = await api.get<ApiResponse<TasksByStatus[]>>('/dashboard/tasks/by-status');
    return response.data;
  },

  // Get recent tasks
  getRecentTasks: async (limit: number = 5): Promise<ApiResponse<Task[]>> => {
    const response = await api.get<ApiResponse<Task[]>>(`/dashboard/tasks/recent?limit=${limit}`);
    return response.data;
  },

  // Get upcoming tasks
  getUpcomingTasks: async (limit: number = 5): Promise<ApiResponse<Task[]>> => {
    const response = await api.get<ApiResponse<Task[]>>(`/dashboard/tasks/upcoming?limit=${limit}`);
    return response.data;
  },

  // Get tasks by project (admin only)
  getTasksByProject: async (): Promise<ApiResponse<any[]>> => {
    const response = await api.get<ApiResponse<any[]>>('/dashboard/tasks/by-project');
    return response.data;
  },

  // Get team performance (admin only)
  getTeamPerformance: async (): Promise<ApiResponse<TeamPerformance[]>> => {
    const response = await api.get<ApiResponse<TeamPerformance[]>>('/dashboard/team/performance');
    return response.data;
  },

  // Get activity summary
  getActivity: async (): Promise<ApiResponse<any>> => {
    const response = await api.get<ApiResponse<any>>('/dashboard/activity');
    return response.data;
  },
};
