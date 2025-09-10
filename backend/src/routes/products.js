import express from 'express';
import { 
  getProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct, 
  updateStock, 
  getLowStockProducts, 
  getOutOfStockProducts, 
  getCategories, 
  getProductStats 
} from '../controllers/productController.js';
import { authenticate, checkRole } from '../config/auth.js';
import { 
  validateProduct, 
  validateTransaction, 
  validateId, 
  validateSearchQuery, 
  handleValidationErrors 
} from '../config/validation.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Public routes (all authenticated users)
router.get('/', validateSearchQuery, handleValidationErrors, getProducts);
router.get('/low-stock', getLowStockProducts);
router.get('/out-of-stock', getOutOfStockProducts);
router.get('/categories', getCategories);
router.get('/stats', getProductStats);
router.get('/:id', validateId, handleValidationErrors, getProductById);

// Manager and Admin routes
router.post('/', checkRole(['Admin', 'Manager']), validateProduct, handleValidationErrors, createProduct);
router.put('/:id', checkRole(['Admin', 'Manager']), validateId, handleValidationErrors, updateProduct);
router.delete('/:id', checkRole(['Admin', 'Manager']), validateId, handleValidationErrors, deleteProduct);

// Staff, Manager, and Admin routes
router.put('/:id/stock', validateTransaction, handleValidationErrors, updateStock);

export default router;
