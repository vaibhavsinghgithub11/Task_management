import { Response, NextFunction } from 'express';
import Project from '../models/Project';
import User from '../models/User';
import asyncHandler from '../utils/asyncHandler';
import ErrorResponse from '../utils/errorResponse';
import { AuthRequest } from '../types';
import mongoose from 'mongoose';

/**
 * @desc    Create a new project
 * @route   POST /api/projects
 * @access  Private/Admin
 */
export const createProject = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { title, description, members } = req.body;

  // Validate input
  if (!title || !description) {
    return next(new ErrorResponse('Please provide title and description', 400));
  }

  // Validate members if provided
  if (members && Array.isArray(members)) {
    // Check if all member IDs are valid
    for (const memberId of members) {
      if (!mongoose.Types.ObjectId.isValid(memberId)) {
        return next(new ErrorResponse(`Invalid member ID: ${memberId}`, 400));
      }

      const user = await User.findById(memberId);
      if (!user) {
        return next(new ErrorResponse(`User not found with ID: ${memberId}`, 404));
      }
    }
  }

  // Create project
  const project = await Project.create({
    title,
    description,
    createdBy: req.user?.id,
    members: members || []
  });

  // Populate creator and members
  await project.populate('createdBy', 'name email role');
  await project.populate('members', 'name email role');

  res.status(201).json({
    success: true,
    message: 'Project created successfully',
    data: project
  });
});

/**
 * @desc    Get all projects
 * @route   GET /api/projects
 * @access  Private
 */
export const getAllProjects = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  let query;

  // Admin can see all projects
  // Members can only see projects they're assigned to
  if (req.user?.role === 'admin') {
    query = Project.find();
  } else {
    query = Project.find({ members: req.user?.id });
  }

  const projects = await query
    .populate('createdBy', 'name email role')
    .populate('members', 'name email role')
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    count: projects.length,
    data: projects
  });
});

/**
 * @desc    Get single project
 * @route   GET /api/projects/:id
 * @access  Private
 */
export const getProjectById = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const project = await Project.findById(req.params.id)
    .populate('createdBy', 'name email role')
    .populate('members', 'name email role');

  if (!project) {
    return next(new ErrorResponse(`Project not found with id: ${req.params.id}`, 404));
  }

  // Check if user has access to this project
  if (req.user?.role !== 'admin') {
    const isMember = project.members.some(
      (member: any) => member._id.toString() === req.user?.id
    );

    if (!isMember) {
      return next(new ErrorResponse('Not authorized to access this project', 403));
    }
  }

  res.status(200).json({
    success: true,
    data: project
  });
});

/**
 * @desc    Update project
 * @route   PUT /api/projects/:id
 * @access  Private/Admin
 */
export const updateProject = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { title, description, members } = req.body;

  let project = await Project.findById(req.params.id);

  if (!project) {
    return next(new ErrorResponse(`Project not found with id: ${req.params.id}`, 404));
  }

  // Validate members if provided
  if (members && Array.isArray(members)) {
    for (const memberId of members) {
      if (!mongoose.Types.ObjectId.isValid(memberId)) {
        return next(new ErrorResponse(`Invalid member ID: ${memberId}`, 400));
      }

      const user = await User.findById(memberId);
      if (!user) {
        return next(new ErrorResponse(`User not found with ID: ${memberId}`, 404));
      }
    }
  }

  // Update fields
  if (title) project.title = title;
  if (description) project.description = description;
  if (members) project.members = members;

  await project.save();

  // Populate and return
  await project.populate('createdBy', 'name email role');
  await project.populate('members', 'name email role');

  res.status(200).json({
    success: true,
    message: 'Project updated successfully',
    data: project
  });
});

/**
 * @desc    Delete project
 * @route   DELETE /api/projects/:id
 * @access  Private/Admin
 */
export const deleteProject = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return next(new ErrorResponse(`Project not found with id: ${req.params.id}`, 404));
  }

  await project.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Project deleted successfully',
    data: {}
  });
});

/**
 * @desc    Add member to project
 * @route   POST /api/projects/:id/members
 * @access  Private/Admin
 */
export const addMemberToProject = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { userId } = req.body;

  if (!userId) {
    return next(new ErrorResponse('Please provide userId', 400));
  }

  // Validate user ID
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return next(new ErrorResponse('Invalid user ID', 400));
  }

  const user = await User.findById(userId);
  if (!user) {
    return next(new ErrorResponse(`User not found with ID: ${userId}`, 404));
  }

  const project = await Project.findById(req.params.id);
  if (!project) {
    return next(new ErrorResponse(`Project not found with id: ${req.params.id}`, 404));
  }

  // Check if user is already a member
  if (project.members.includes(userId)) {
    return next(new ErrorResponse('User is already a member of this project', 400));
  }

  // Add member
  project.members.push(userId);
  await project.save();

  await project.populate('createdBy', 'name email role');
  await project.populate('members', 'name email role');

  res.status(200).json({
    success: true,
    message: 'Member added to project successfully',
    data: project
  });
});

/**
 * @desc    Remove member from project
 * @route   DELETE /api/projects/:id/members/:userId
 * @access  Private/Admin
 */
export const removeMemberFromProject = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { userId } = req.params;

  const project = await Project.findById(req.params.id);
  if (!project) {
    return next(new ErrorResponse(`Project not found with id: ${req.params.id}`, 404));
  }

  // Check if user is a member
  const memberIndex = project.members.findIndex(
    (member) => member.toString() === userId
  );

  if (memberIndex === -1) {
    return next(new ErrorResponse('User is not a member of this project', 400));
  }

  // Remove member
  project.members.splice(memberIndex, 1);
  await project.save();

  await project.populate('createdBy', 'name email role');
  await project.populate('members', 'name email role');

  res.status(200).json({
    success: true,
    message: 'Member removed from project successfully',
    data: project
  });
});

/**
 * @desc    Get projects created by current user
 * @route   GET /api/projects/my/created
 * @access  Private/Admin
 */
export const getMyCreatedProjects = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const projects = await Project.find({ createdBy: req.user?.id })
    .populate('createdBy', 'name email role')
    .populate('members', 'name email role')
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    count: projects.length,
    data: projects
  });
});
