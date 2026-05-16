import express from 'express';
import {
  getDashboardStats,
  getTasksByPriority,
  getTasksByStatus,
  getRecentTasks,
  getUpcomingTasks,
  getTasksByProject,
  getTeamPerformance,
  getActivitySummary
} from '../controllers/dashboardController';
import { protect, adminOnly } from '../middleware/auth';

const router = express.Router();

/**
 * Dashboard Routes
 */

// All routes require authentication
router.use(protect);

// General dashboard statistics
router.get('/stats', getDashboardStats);

// Task analytics
router.get('/tasks/by-priority', getTasksByPriority);
router.get('/tasks/by-status', getTasksByStatus);
router.get('/tasks/recent', getRecentTasks);
router.get('/tasks/upcoming', getUpcomingTasks);

// Activity summary
router.get('/activity', getActivitySummary);

// Admin only routes
router.get('/tasks/by-project', adminOnly, getTasksByProject);
router.get('/team/performance', adminOnly, getTeamPerformance);

export default router;
