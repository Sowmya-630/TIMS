import express from 'express';
import { 
  getUsers, 
  getUserById, 
  createUser, 
  updateUser, 
  deleteUser, 
  getUsersByRole, 
  getUserStats 
} from '../controllers/userController.js';
import { authenticate, checkRole } from '../config/auth.js';
import { validateUser, validateId, handleValidationErrors } from '../config/validation.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Admin and Manager routes
router.get('/', checkRole(['Admin', 'Manager']), getUsers);
router.get('/stats', checkRole(['Admin', 'Manager']), getUserStats);
router.get('/role/:role', checkRole(['Admin', 'Manager']), getUsersByRole);
router.get('/:id', checkRole(['Admin', 'Manager']), validateId, handleValidationErrors, getUserById);

// Admin only routes
router.post('/', checkRole(['Admin']), validateUser, handleValidationErrors, createUser);
router.put('/:id', checkRole(['Admin']), validateId, handleValidationErrors, updateUser);
router.delete('/:id', checkRole(['Admin']), validateId, handleValidationErrors, deleteUser);

export default router;

