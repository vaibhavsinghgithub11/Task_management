import express from 'express';
import {
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
  getUserStats
} from '../controllers/userController';
import { protect, adminOnly } from '../middleware/auth';

const router = express.Router();

/**
 * User Management Routes
 * All routes are protected and require admin privileges
 */

// Apply protect middleware to all routes
router.use(protect);

// Apply adminOnly middleware to all routes
router.use(adminOnly);

// User statistics
router.get('/stats', getUserStats);

// User CRUD operations
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.put('/:id/role', updateUserRole);
router.delete('/:id', deleteUser);

export default router;
