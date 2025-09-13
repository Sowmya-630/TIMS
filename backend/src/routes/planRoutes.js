import express from 'express';
import { 
  createPlan, 
  getPlans, 
  getActivePlans, 
  getPlanById, 
  updatePlan, 
  deletePlan 
} from '../controllers/planController.js';
import { verifyToken, verifyRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get active plans (public)
router.get('/active', getActivePlans);

// Get all plans (authenticated users)
router.get('/', verifyToken, getPlans);

// Get plan by ID (authenticated users)
router.get('/:id', verifyToken, getPlanById);

// Create plan (admin only)
router.post('/', verifyToken, verifyRole('Admin'), createPlan);

// Update plan (admin only)
router.put('/:id', verifyToken, verifyRole('Admin'), updatePlan);

// Delete plan (admin only)
router.delete('/:id', verifyToken, verifyRole('Admin'), deletePlan);

export default router;