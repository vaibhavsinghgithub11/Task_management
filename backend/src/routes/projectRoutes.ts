import express from 'express';
import {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addMemberToProject,
  removeMemberFromProject,
  getMyCreatedProjects
} from '../controllers/projectController';
import { protect, adminOnly } from '../middleware/auth';

const router = express.Router();

/**
 * Project Routes
 */

// All routes require authentication
router.use(protect);

// Get projects created by current user (admin only)
router.get('/my/created', adminOnly, getMyCreatedProjects);

// Get all projects (members see only their projects, admins see all)
router.get('/', getAllProjects);

// Get single project
router.get('/:id', getProjectById);

// Admin only routes
router.post('/', adminOnly, createProject);
router.put('/:id', adminOnly, updateProject);
router.delete('/:id', adminOnly, deleteProject);

// Member management (admin only)
router.post('/:id/members', adminOnly, addMemberToProject);
router.delete('/:id/members/:userId', adminOnly, removeMemberFromProject);

export default router;
