import express from 'express';
import { createAudit, getAudits } from '../controllers/auditController.js';

const router = express.Router();

router.post('/', createAudit);
router.get('/', getAudits);

export default router;