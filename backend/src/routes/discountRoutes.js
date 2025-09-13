import express from 'express';
import { createDiscount, getDiscounts } from '../controllers/discountController.js';

const router = express.Router();

router.post('/', createDiscount);
router.get('/', getDiscounts);

export default router;