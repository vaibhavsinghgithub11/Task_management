import React from 'react';
import type { Project } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (projectId: string) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onEdit, onDelete }) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const creatorId = project.createdBy.id || (project.createdBy as any)._id;
  const isCreator = user?.id === creatorId;

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {project.title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2">
            {project.description}
          </p>
        </div>
        
        {/* Actions - Only for admin or creator */}
        {(isAdmin || isCreator) && (
          <div className="flex gap-2 ml-4">
            <button
              onClick={() => onEdit(project)}
              className="text-blue-600 hover:text-blue-800 p-2 rounded hover:bg-blue-50 transition-colors"
              title="Edit Project"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to delete this project?')) {
                  onDelete(project._id);
                }
              }}
              className="text-red-600 hover:text-red-800 p-2 rounded hover:bg-red-50 transition-colors"
              title="Delete Project"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Metadata */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span>Created by: <span className="font-medium">{project.createdBy.name}</span></span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>Created: {formatDate(project.createdAt)}</span>
        </div>
      </div>

      {/* Members */}
      <div className="border-t pt-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Team Members</span>
          <span className="text-sm text-gray-500">{project.members.length} member{project.members.length !== 1 ? 's' : ''}</span>
        </div>
        
        {project.members.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {project.members.slice(0, 5).map((member) => {
              const memberId = member.id || (member as any)._id;
              return (
                <div
                  key={memberId}
                  className="flex items-center bg-gray-100 rounded-full px-3 py-1 text-xs"
                  title={member.email}
                >
                  <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center mr-2 text-xs font-semibold">
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-gray-700">{member.name}</span>
                </div>
              );
            })}
            {project.members.length > 5 && (
              <div className="flex items-center bg-gray-100 rounded-full px-3 py-1 text-xs text-gray-600">
                +{project.members.length - 5} more
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
