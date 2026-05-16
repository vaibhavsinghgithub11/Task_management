import React from 'react';
import type { TaskPriority, TaskStatus } from '../../types';

interface TaskStatusBadgeProps {
  status: TaskStatus;
}

interface TaskPriorityBadgeProps {
  priority: TaskPriority;
}

export const TaskStatusBadge: React.FC<TaskStatusBadgeProps> = ({ status }) => {
  const getStatusClass = () => {
    switch (status) {
      case 'Completed':
        return 'badge-success';
      case 'In Progress':
        return 'badge-info';
      case 'Overdue':
        return 'badge-danger';
      default:
        return 'badge-gray';
    }
  };

  return <span className={`badge ${getStatusClass()}`}>{status}</span>;
};

export const TaskPriorityBadge: React.FC<TaskPriorityBadgeProps> = ({ priority }) => {
  const getPriorityClass = () => {
    switch (priority) {
      case 'High':
        return 'badge-danger';
      case 'Medium':
        return 'badge-warning';
      default:
        return 'badge-gray';
    }
  };

  return <span className={`badge ${getPriorityClass()}`}>{priority}</span>;
};
