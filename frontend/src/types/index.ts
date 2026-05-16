// User types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'member';
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: 'admin' | 'member';
}

// Project types
export interface Project {
  _id: string;
  title: string;
  description: string;
  createdBy: User;
  members: User[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectData {
  title: string;
  description: string;
  members?: string[];
}

// Task types
export type TaskStatus = 'Todo' | 'In Progress' | 'Completed' | 'Overdue';
export type TaskPriority = 'Low' | 'Medium' | 'High';

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  assignedTo: User;
  project: {
    _id: string;
    title: string;
  };
  createdBy: User;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskData {
  title: string;
  description: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate: string;
  assignedTo: string;
  project: string;
}

export interface UpdateTaskStatusData {
  status: TaskStatus;
}

// Dashboard types
export interface DashboardStats {
  tasks: {
    total: number;
    completed: number;
    inProgress: number;
    todo: number;
    overdue: number;
    pending: number;
    completionRate: number;
  };
  projects: {
    total: number;
  };
  users: {
    totalUsers: number;
    adminCount: number;
    memberCount: number;
  } | null;
}

export interface TasksByPriority {
  priority: TaskPriority;
  count: number;
}

export interface TasksByStatus {
  status: TaskStatus;
  count: number;
}

export interface TeamPerformance {
  userId: string;
  userName: string;
  userEmail: string;
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  overdueTasks: number;
  completionRate: number;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  count?: number;
}

export interface ApiError {
  success: false;
  error: string;
}
