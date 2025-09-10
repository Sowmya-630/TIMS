import express from 'express';
import { 
  getTransactions, 
  getTransactionById, 
  createTransaction, 
  getTransactionsByProduct, 
  getTransactionsByUser, 
  getRecentTransactions, 
  getTransactionStats, 
  deleteTransaction 
} from '../controllers/transactionController.js';
import { authenticate, checkRole } from '../config/auth.js';
import { 
  validateTransaction, 
  validateId, 
  handleValidationErrors 
} from '../config/validation.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Public routes (all authenticated users)
router.get('/', getTransactions);
router.get('/recent', getRecentTransactions);
router.get('/stats', getTransactionStats);
router.get('/:id', validateId, handleValidationErrors, getTransactionById);
router.get('/product/:productId', getTransactionsByProduct);
router.get('/user/:userId', getTransactionsByUser);

// Staff, Manager, and Admin routes
router.post('/', validateTransaction, handleValidationErrors, createTransaction);

// Manager and Admin routes
router.delete('/:id', checkRole(['Admin', 'Manager']), validateId, handleValidationErrors, deleteTransaction);

export default router;
