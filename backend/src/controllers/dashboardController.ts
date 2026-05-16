import { Response, NextFunction } from 'express';
import Task from '../models/Task';
import Project from '../models/Project';
import User from '../models/User';
import asyncHandler from '../utils/asyncHandler';
import { AuthRequest, TaskStatus, UserRole } from '../types';

/**
 * @desc    Get dashboard statistics
 * @route   GET /api/dashboard/stats
 * @access  Private
 */
export const getDashboardStats = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const isAdmin = req.user?.role === UserRole.ADMIN;
  let taskQuery: any = {};
  let projectQuery: any = {};

  // Members only see their own stats
  if (!isAdmin) {
    taskQuery.assignedTo = req.user?.id;
    projectQuery.members = req.user?.id;
  }

  // Task statistics
  const totalTasks = await Task.countDocuments(taskQuery);
  const completedTasks = await Task.countDocuments({ ...taskQuery, status: TaskStatus.COMPLETED });
  const inProgressTasks = await Task.countDocuments({ ...taskQuery, status: TaskStatus.IN_PROGRESS });
  const todoTasks = await Task.countDocuments({ ...taskQuery, status: TaskStatus.TODO });
  const overdueTasks = await Task.countDocuments({ ...taskQuery, status: TaskStatus.OVERDUE });

  // Pending tasks (Todo + In Progress)
  const pendingTasks = todoTasks + inProgressTasks;

  // Project statistics
  const totalProjects = await Project.countDocuments(projectQuery);

  // User statistics (admin only)
  let userStats = null;
  if (isAdmin) {
    const totalUsers = await User.countDocuments();
    const adminCount = await User.countDocuments({ role: UserRole.ADMIN });
    const memberCount = await User.countDocuments({ role: UserRole.MEMBER });

    userStats = {
      totalUsers,
      adminCount,
      memberCount
    };
  }

  // Task completion rate
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  res.status(200).json({
    success: true,
    data: {
      tasks: {
        total: totalTasks,
        completed: completedTasks,
        inProgress: inProgressTasks,
        todo: todoTasks,
        overdue: overdueTasks,
        pending: pendingTasks,
        completionRate
      },
      projects: {
        total: totalProjects
      },
      users: userStats
    }
  });
});

/**
 * @desc    Get task statistics by priority
 * @route   GET /api/dashboard/tasks/by-priority
 * @access  Private
 */
export const getTasksByPriority = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const isAdmin = req.user?.role === UserRole.ADMIN;
  let matchQuery: any = {};

  // Members only see their own tasks
  if (!isAdmin) {
    matchQuery.assignedTo = req.user?.id;
  }

  const tasksByPriority = await Task.aggregate([
    { $match: matchQuery },
    {
      $group: {
        _id: '$priority',
        count: { $sum: 1 }
      }
    },
    {
      $project: {
        priority: '$_id',
        count: 1,
        _id: 0
      }
    }
  ]);

  res.status(200).json({
    success: true,
    data: tasksByPriority
  });
});

/**
 * @desc    Get task statistics by status
 * @route   GET /api/dashboard/tasks/by-status
 * @access  Private
 */
export const getTasksByStatus = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const isAdmin = req.user?.role === UserRole.ADMIN;
  let matchQuery: any = {};

  // Members only see their own tasks
  if (!isAdmin) {
    matchQuery.assignedTo = req.user?.id;
  }

  const tasksByStatus = await Task.aggregate([
    { $match: matchQuery },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    },
    {
      $project: {
        status: '$_id',
        count: 1,
        _id: 0
      }
    }
  ]);

  res.status(200).json({
    success: true,
    data: tasksByStatus
  });
});

/**
 * @desc    Get recent tasks
 * @route   GET /api/dashboard/tasks/recent
 * @access  Private
 */
export const getRecentTasks = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const isAdmin = req.user?.role === UserRole.ADMIN;
  const limit = parseInt(req.query.limit as string) || 5;
  let query: any = {};

  // Members only see their own tasks
  if (!isAdmin) {
    query.assignedTo = req.user?.id;
  }

  const recentTasks = await Task.find(query)
    .populate('assignedTo', 'name email')
    .populate('project', 'title')
    .populate('createdBy', 'name email')
    .sort('-createdAt')
    .limit(limit);

  res.status(200).json({
    success: true,
    count: recentTasks.length,
    data: recentTasks
  });
});

/**
 * @desc    Get upcoming tasks (by due date)
 * @route   GET /api/dashboard/tasks/upcoming
 * @access  Private
 */
export const getUpcomingTasks = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const isAdmin = req.user?.role === UserRole.ADMIN;
  const limit = parseInt(req.query.limit as string) || 5;
  let query: any = {
    status: { $ne: TaskStatus.COMPLETED },
    dueDate: { $gte: new Date() }
  };

  // Members only see their own tasks
  if (!isAdmin) {
    query.assignedTo = req.user?.id;
  }

  const upcomingTasks = await Task.find(query)
    .populate('assignedTo', 'name email')
    .populate('project', 'title')
    .populate('createdBy', 'name email')
    .sort('dueDate')
    .limit(limit);

  res.status(200).json({
    success: true,
    count: upcomingTasks.length,
    data: upcomingTasks
  });
});

/**
 * @desc    Get tasks by project (for charts)
 * @route   GET /api/dashboard/tasks/by-project
 * @access  Private/Admin
 */
export const getTasksByProject = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const tasksByProject = await Task.aggregate([
    {
      $group: {
        _id: '$project',
        total: { $sum: 1 },
        completed: {
          $sum: { $cond: [{ $eq: ['$status', TaskStatus.COMPLETED] }, 1, 0] }
        },
        inProgress: {
          $sum: { $cond: [{ $eq: ['$status', TaskStatus.IN_PROGRESS] }, 1, 0] }
        },
        todo: {
          $sum: { $cond: [{ $eq: ['$status', TaskStatus.TODO] }, 1, 0] }
        },
        overdue: {
          $sum: { $cond: [{ $eq: ['$status', TaskStatus.OVERDUE] }, 1, 0] }
        }
      }
    },
    {
      $lookup: {
        from: 'projects',
        localField: '_id',
        foreignField: '_id',
        as: 'project'
      }
    },
    {
      $unwind: '$project'
    },
    {
      $project: {
        projectId: '$_id',
        projectTitle: '$project.title',
        total: 1,
        completed: 1,
        inProgress: 1,
        todo: 1,
        overdue: 1,
        completionRate: {
          $cond: [
            { $eq: ['$total', 0] },
            0,
            { $multiply: [{ $divide: ['$completed', '$total'] }, 100] }
          ]
        },
        _id: 0
      }
    },
    {
      $sort: { total: -1 }
    }
  ]);

  res.status(200).json({
    success: true,
    count: tasksByProject.length,
    data: tasksByProject
  });
});

/**
 * @desc    Get team performance (Admin only)
 * @route   GET /api/dashboard/team/performance
 * @access  Private/Admin
 */
export const getTeamPerformance = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const teamPerformance = await Task.aggregate([
    {
      $group: {
        _id: '$assignedTo',
        totalTasks: { $sum: 1 },
        completedTasks: {
          $sum: { $cond: [{ $eq: ['$status', TaskStatus.COMPLETED] }, 1, 0] }
        },
        inProgressTasks: {
          $sum: { $cond: [{ $eq: ['$status', TaskStatus.IN_PROGRESS] }, 1, 0] }
        },
        overdueTasks: {
          $sum: { $cond: [{ $eq: ['$status', TaskStatus.OVERDUE] }, 1, 0] }
        }
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'user'
      }
    },
    {
      $unwind: '$user'
    },
    {
      $project: {
        userId: '$_id',
        userName: '$user.name',
        userEmail: '$user.email',
        totalTasks: 1,
        completedTasks: 1,
        inProgressTasks: 1,
        overdueTasks: 1,
        completionRate: {
          $cond: [
            { $eq: ['$totalTasks', 0] },
            0,
            { $multiply: [{ $divide: ['$completedTasks', '$totalTasks'] }, 100] }
          ]
        },
        _id: 0
      }
    },
    {
      $sort: { completedTasks: -1 }
    }
  ]);

  res.status(200).json({
    success: true,
    count: teamPerformance.length,
    data: teamPerformance
  });
});

/**
 * @desc    Get activity summary (last 7 days)
 * @route   GET /api/dashboard/activity
 * @access  Private
 */
export const getActivitySummary = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const isAdmin = req.user?.role === UserRole.ADMIN;
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  let taskQuery: any = { createdAt: { $gte: sevenDaysAgo } };
  let projectQuery: any = { createdAt: { $gte: sevenDaysAgo } };

  // Members only see their own activity
  if (!isAdmin) {
    taskQuery.assignedTo = req.user?.id;
    projectQuery.members = req.user?.id;
  }

  const recentTasksCount = await Task.countDocuments(taskQuery);
  const recentProjectsCount = await Project.countDocuments(projectQuery);

  // Tasks completed in last 7 days
  const recentCompletedTasks = await Task.countDocuments({
    ...taskQuery,
    status: TaskStatus.COMPLETED
  });

  res.status(200).json({
    success: true,
    data: {
      period: 'Last 7 days',
      tasksCreated: recentTasksCount,
      tasksCompleted: recentCompletedTasks,
      projectsCreated: isAdmin ? recentProjectsCount : null
    }
  });
});
