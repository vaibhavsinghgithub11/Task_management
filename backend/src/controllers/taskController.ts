import { Response, NextFunction } from 'express';
import Task from '../models/Task';
import Project from '../models/Project';
import User from '../models/User';
import asyncHandler from '../utils/asyncHandler';
import ErrorResponse from '../utils/errorResponse';
import { AuthRequest, TaskStatus, TaskPriority } from '../types';
import mongoose from 'mongoose';

/**
 * @desc    Create a new task
 * @route   POST /api/tasks
 * @access  Private/Admin
 */
export const createTask = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { title, description, status, priority, dueDate, assignedTo, project } = req.body;

  // Validate required fields
  if (!title || !description || !dueDate || !assignedTo || !project) {
    return next(new ErrorResponse('Please provide all required fields', 400));
  }

  // Validate project exists
  const projectExists = await Project.findById(project);
  if (!projectExists) {
    return next(new ErrorResponse(`Project not found with ID: ${project}`, 404));
  }

  // Validate user exists
  const userExists = await User.findById(assignedTo);
  if (!userExists) {
    return next(new ErrorResponse(`User not found with ID: ${assignedTo}`, 404));
  }

  // Check if user is a member of the project
  const isMember = projectExists.members.some(
    (member) => member.toString() === assignedTo
  );

  if (!isMember) {
    return next(new ErrorResponse('User must be a member of the project to be assigned tasks', 400));
  }

  // Create task
  const task = await Task.create({
    title,
    description,
    status: status || TaskStatus.TODO,
    priority: priority || TaskPriority.MEDIUM,
    dueDate,
    assignedTo,
    project,
    createdBy: req.user?.id
  });

  // Populate references
  await task.populate('assignedTo', 'name email role');
  await task.populate('project', 'title');
  await task.populate('createdBy', 'name email role');

  res.status(201).json({
    success: true,
    message: 'Task created successfully',
    data: task
  });
});

/**
 * @desc    Get all tasks
 * @route   GET /api/tasks
 * @access  Private
 */
export const getAllTasks = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  let query: any = {};

  // Members can only see tasks assigned to them
  if (req.user?.role !== 'admin') {
    query.assignedTo = req.user?.id;
  }

  // Filter by project
  if (req.query.project) {
    query.project = req.query.project;
  }

  // Filter by status
  if (req.query.status) {
    query.status = req.query.status;
  }

  // Filter by priority
  if (req.query.priority) {
    query.priority = req.query.priority;
  }

  // Search by title
  if (req.query.search) {
    query.title = { $regex: req.query.search, $options: 'i' };
  }

  const tasks = await Task.find(query)
    .populate('assignedTo', 'name email role')
    .populate('project', 'title')
    .populate('createdBy', 'name email role')
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    count: tasks.length,
    data: tasks
  });
});

/**
 * @desc    Get single task
 * @route   GET /api/tasks/:id
 * @access  Private
 */
export const getTaskById = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const task = await Task.findById(req.params.id)
    .populate('assignedTo', 'name email role')
    .populate('project', 'title')
    .populate('createdBy', 'name email role');

  if (!task) {
    return next(new ErrorResponse(`Task not found with id: ${req.params.id}`, 404));
  }

  // Check if user has access to this task
  if (req.user?.role !== 'admin' && task.assignedTo._id.toString() !== req.user?.id) {
    return next(new ErrorResponse('Not authorized to access this task', 403));
  }

  res.status(200).json({
    success: true,
    data: task
  });
});

/**
 * @desc    Update task
 * @route   PUT /api/tasks/:id
 * @access  Private/Admin
 */
export const updateTask = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { title, description, status, priority, dueDate, assignedTo } = req.body;

  let task = await Task.findById(req.params.id);

  if (!task) {
    return next(new ErrorResponse(`Task not found with id: ${req.params.id}`, 404));
  }

  // Validate assignedTo if provided
  if (assignedTo) {
    const userExists = await User.findById(assignedTo);
    if (!userExists) {
      return next(new ErrorResponse(`User not found with ID: ${assignedTo}`, 404));
    }

    // Check if user is a member of the project
    const project = await Project.findById(task.project);
    const isMember = project?.members.some(
      (member) => member.toString() === assignedTo
    );

    if (!isMember) {
      return next(new ErrorResponse('User must be a member of the project', 400));
    }
  }

  // Update fields
  if (title) task.title = title;
  if (description) task.description = description;
  if (status) task.status = status;
  if (priority) task.priority = priority;
  if (dueDate) task.dueDate = dueDate;
  if (assignedTo) task.assignedTo = assignedTo;

  await task.save();

  // Populate and return
  await task.populate('assignedTo', 'name email role');
  await task.populate('project', 'title');
  await task.populate('createdBy', 'name email role');

  res.status(200).json({
    success: true,
    message: 'Task updated successfully',
    data: task
  });
});

/**
 * @desc    Update task status (Members can update their own tasks)
 * @route   PATCH /api/tasks/:id/status
 * @access  Private
 */
export const updateTaskStatus = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { status } = req.body;

  if (!status) {
    return next(new ErrorResponse('Please provide a status', 400));
  }

  // Validate status
  if (!Object.values(TaskStatus).includes(status)) {
    return next(new ErrorResponse('Invalid status value', 400));
  }

  let task = await Task.findById(req.params.id);

  if (!task) {
    return next(new ErrorResponse(`Task not found with id: ${req.params.id}`, 404));
  }

  // Members can only update their own tasks
  if (req.user?.role !== 'admin' && task.assignedTo.toString() !== req.user?.id) {
    return next(new ErrorResponse('You can only update tasks assigned to you', 403));
  }

  task.status = status;
  await task.save();

  await task.populate('assignedTo', 'name email role');
  await task.populate('project', 'title');
  await task.populate('createdBy', 'name email role');

  res.status(200).json({
    success: true,
    message: 'Task status updated successfully',
    data: task
  });
});

/**
 * @desc    Delete task
 * @route   DELETE /api/tasks/:id
 * @access  Private/Admin
 */
export const deleteTask = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return next(new ErrorResponse(`Task not found with id: ${req.params.id}`, 404));
  }

  await task.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Task deleted successfully',
    data: {}
  });
});

/**
 * @desc    Get tasks by project
 * @route   GET /api/tasks/project/:projectId
 * @access  Private
 */
export const getTasksByProject = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { projectId } = req.params;

  // Verify project exists
  const project = await Project.findById(projectId);
  if (!project) {
    return next(new ErrorResponse(`Project not found with id: ${projectId}`, 404));
  }

  // Check if user has access to this project
  if (req.user?.role !== 'admin') {
    const isMember = project.members.some(
      (member) => member.toString() === req.user?.id
    );

    if (!isMember) {
      return next(new ErrorResponse('Not authorized to access this project', 403));
    }
  }

  let query: any = { project: projectId };

  // Members only see their own tasks
  if (req.user?.role !== 'admin') {
    query.assignedTo = req.user?.id;
  }

  const tasks = await Task.find(query)
    .populate('assignedTo', 'name email role')
    .populate('project', 'title')
    .populate('createdBy', 'name email role')
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    count: tasks.length,
    data: tasks
  });
});

/**
 * @desc    Get my assigned tasks
 * @route   GET /api/tasks/my/assigned
 * @access  Private
 */
export const getMyAssignedTasks = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const tasks = await Task.find({ assignedTo: req.user?.id })
    .populate('assignedTo', 'name email role')
    .populate('project', 'title')
    .populate('createdBy', 'name email role')
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    count: tasks.length,
    data: tasks
  });
});
