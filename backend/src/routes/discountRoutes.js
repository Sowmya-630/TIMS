import express from 'express';
import { createDiscount, getDiscounts, getActiveDiscounts } from '../controllers/discountController.js';
import { verifyToken, verifyRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get active discounts (public)
router.get('/active', getActiveDiscounts);

// Get all discounts (admin only)
router.get('/', verifyToken, verifyRole('Admin'), getDiscounts);

// Create discount (admin only)
router.post('/', verifyToken, verifyRole('Admin'), createDiscount);

export default router;