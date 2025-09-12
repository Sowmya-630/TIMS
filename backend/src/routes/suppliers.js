import express from 'express';
import { 
  getSuppliers, 
  getSupplierById, 
  createSupplier, 
  updateSupplier, 
  deleteSupplier, 
  getSupplierProducts, 
  getSupplierOrderHistory, 
  getSupplierStats, 
  getAllSupplierStats 
} from '../controllers/supplierController.js';
import { authenticate, checkRole } from '../config/auth.js';
import { 
  validateSupplier, 
  validateId, 
  handleValidationErrors 
} from '../config/validation.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Public routes (all authenticated users)
router.get('/', getSuppliers);
router.get('/stats', getAllSupplierStats);
router.get('/:id', validateId, handleValidationErrors, getSupplierById);
router.get('/:id/products', validateId, handleValidationErrors, getSupplierProducts);
router.get('/:id/orders', validateId, handleValidationErrors, getSupplierOrderHistory);
router.get('/:id/stats', validateId, handleValidationErrors, getSupplierStats);

// Manager and Admin routes
router.post('/', checkRole(['Admin', 'Manager']), validateSupplier, handleValidationErrors, createSupplier);
router.put('/:id', checkRole(['Admin', 'Manager']), validateId, handleValidationErrors, updateSupplier);
router.delete('/:id', checkRole(['Admin', 'Manager']), validateId, handleValidationErrors, deleteSupplier);

export default router;

