import express from 'express';
import { createSubscription, getSubscriptions } from '../controllers/subscriptionController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Any logged-in user can create or view subscriptions
router.post('/', verifyToken, createSubscription);
router.get('/', verifyToken, getSubscriptions);

export default router;