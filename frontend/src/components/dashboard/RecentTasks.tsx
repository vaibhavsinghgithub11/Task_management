import React from 'react';
import type { Task } from '../../types';
import { Link } from 'react-router-dom';

interface RecentTasksProps {
  tasks: Task[];
  loading?: boolean;
}

const RecentTasks: React.FC<RecentTasksProps> = ({ tasks, loading }) => {
  const getStatusColor = (status: string) => {
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'badge-danger';
      case 'Medium':
        return 'badge-warning';
      default:
        return 'badge-gray';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Tasks</h3>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Tasks</h3>
        <div className="text-center py-8">
          <svg
            className="w-16 h-16 text-gray-300 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <p className="text-gray-500">No tasks yet</p>
          <Link to="/tasks" className="text-primary-600 hover:text-primary-700 text-sm mt-2 inline-block">
            Create your first task
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Recent Tasks</h3>
        <Link
          to="/tasks"
          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          View all →
        </Link>
      </div>

      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task._id}
            className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-medium text-gray-800">{task.title}</h4>
              <span className={`badge ${getStatusColor(task.status)}`}>
                {task.status}
              </span>
            </div>
            
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {task.description}
            </p>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <span className={`badge ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
                <span className="text-gray-500">
                  {task.project.title}
                </span>
              </div>
              <span className="text-gray-500">
                Due: {new Date(task.dueDate).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentTasks;
