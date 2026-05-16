import express from 'express';
import {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  updateTaskStatus,
  deleteTask,
  getTasksByProject,
  getMyAssignedTasks
} from '../controllers/taskController';
import { protect, adminOnly } from '../middleware/auth';

const router = express.Router();

/**
 * Task Routes
 */

// All routes require authentication
router.use(protect);

// Get my assigned tasks
router.get('/my/assigned', getMyAssignedTasks);

// Get tasks by project
router.get('/project/:projectId', getTasksByProject);

// Get all tasks (filtered by role)
router.get('/', getAllTasks);

// Get single task
router.get('/:id', getTaskById);

// Update task status (members can update their own tasks)
router.patch('/:id/status', updateTaskStatus);

// Admin only routes
router.post('/', adminOnly, createTask);
router.put('/:id', adminOnly, updateTask);
router.delete('/:id', adminOnly, deleteTask);

export default router;
