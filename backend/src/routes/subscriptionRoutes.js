import express from 'express';
import { 
  createSubscription, 
  getSubscriptions, 
  getSubscriptionById, 
  updateSubscription, 
  cancelSubscription, 
  renewSubscription, 
  recordUsage 
} from '../controllers/subscriptionController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create subscription (authenticated users)
router.post('/', verifyToken, createSubscription);

// Get subscriptions (authenticated users)
router.get('/', verifyToken, getSubscriptions);

// Get subscription by ID (authenticated users)
router.get('/:id', verifyToken, getSubscriptionById);

// Update subscription (authenticated users)
router.put('/:id', verifyToken, updateSubscription);

// Cancel subscription (authenticated users)
router.post('/:id/cancel', verifyToken, cancelSubscription);

// Renew subscription (authenticated users)
router.post('/:id/renew', verifyToken, renewSubscription);

// Record usage (authenticated users)
router.post('/:id/usage', verifyToken, recordUsage);

export default router;