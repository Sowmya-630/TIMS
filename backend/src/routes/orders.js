import express from 'express';
import { 
  getOrders, 
  getOrderById, 
  createOrder, 
  updateOrder, 
  updateOrderStatus, 
  deleteOrder, 
  getOrdersBySupplier, 
  getOrdersByProduct, 
  getOverdueOrders, 
  getPendingOrders, 
  getOrderStats 
} from '../controllers/orderController.js';
import { authenticate, checkRole } from '../config/auth.js';
import { 
  validateOrder, 
  validateId, 
  handleValidationErrors 
} from '../config/validation.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Public routes (all authenticated users)
router.get('/', getOrders);
router.get('/stats', getOrderStats);
router.get('/overdue', getOverdueOrders);
router.get('/pending', getPendingOrders);
router.get('/:id', validateId, handleValidationErrors, getOrderById);
router.get('/supplier/:supplierId', getOrdersBySupplier);
router.get('/product/:productId', getOrdersByProduct);

// Manager and Admin routes
router.post('/', checkRole(['Admin', 'Manager']), validateOrder, handleValidationErrors, createOrder);
router.put('/:id', checkRole(['Admin', 'Manager']), validateId, handleValidationErrors, updateOrder);
router.put('/:id/status', checkRole(['Admin', 'Manager']), validateId, handleValidationErrors, updateOrderStatus);
router.delete('/:id', checkRole(['Admin', 'Manager']), validateId, handleValidationErrors, deleteOrder);

export default router;

