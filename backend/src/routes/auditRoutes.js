import express from 'express';
import { createAudit, getAudits } from '../controllers/auditController.js';
import { verifyToken, verifyRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin only routes
router.post('/', verifyToken, verifyRole('Admin'), createAudit);
router.get('/', verifyToken, verifyRole('Admin'), getAudits);

export default router;