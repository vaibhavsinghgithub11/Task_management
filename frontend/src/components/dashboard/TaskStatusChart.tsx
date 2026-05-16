import React from 'react';
import type { TasksByStatus } from '../../types';

interface TaskStatusChartProps {
  data: TasksByStatus[];
  loading?: boolean;
}

const TaskStatusChart: React.FC<TaskStatusChartProps> = ({ data, loading }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-500';
      case 'In Progress':
        return 'bg-blue-500';
      case 'Overdue':
        return 'bg-red-500';
      default:
        return 'bg-gray-400';
    }
  };

  const total = data.reduce((sum, item) => sum + item.count, 0);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Tasks by Status</h3>
        <div className="animate-pulse space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i}>
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (total === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Tasks by Status</h3>
        <div className="text-center py-8">
          <p className="text-gray-500">No task data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">Tasks by Status</h3>

      <div className="space-y-4">
        {data.map((item) => {
          const percentage = total > 0 ? (item.count / total) * 100 : 0;
          
          return (
            <div key={item.status}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  {item.status}
                </span>
                <span className="text-sm text-gray-600">
                  {item.count} ({percentage.toFixed(0)}%)
                </span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`${getStatusColor(item.status)} h-3 rounded-full transition-all duration-500`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Total Tasks</span>
          <span className="text-lg font-bold text-gray-800">{total}</span>
        </div>
      </div>
    </div>
  );
};

export default TaskStatusChart;
