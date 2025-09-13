import express from 'express';
import { createPlan, getPlans } from '../controllers/planController.js';
import { verifyToken, verifyRole } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Anyone logged in can view plans
router.get('/', verifyToken, getPlans);

// Only admin can create plans
router.post('/', verifyToken, verifyRole('admin'), createPlan);

export default router;