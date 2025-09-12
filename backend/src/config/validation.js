import { body, param, query, validationResult } from 'express-validator';

// Validation error handler
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

// User validation rules
export const validateUser = [
  body('fullName')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be between 2 and 100 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  body('role')
    .isIn(['Admin', 'Manager', 'Staff'])
    .withMessage('Role must be Admin, Manager, or Staff')
];

// Product validation rules
export const validateProduct = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Product name must be between 2 and 100 characters'),
  body('category')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Category must be between 2 and 50 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters'),
  body('stockLevel')
    .isInt({ min: 0 })
    .withMessage('Stock level must be a non-negative integer'),
  body('reorderPoint')
    .isInt({ min: 0 })
    .withMessage('Reorder point must be a non-negative integer'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('supplierId')
    .isUUID()
    .withMessage('Valid supplier ID is required')
];

// Supplier validation rules
export const validateSupplier = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Supplier name must be between 2 and 100 characters'),
  body('contactPerson')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Contact person name must be between 2 and 100 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('phone')
    .isMobilePhone()
    .withMessage('Valid phone number is required'),
  body('address')
    .trim()
    .isLength({ min: 10, max: 200 })
    .withMessage('Address must be between 10 and 200 characters')
];

// Transaction validation rules
export const validateTransaction = [
  body('productId')
    .isUUID()
    .withMessage('Valid product ID is required'),
  body('type')
    .isIn(['Stock In', 'Stock Out'])
    .withMessage('Transaction type must be either "Stock In" or "Stock Out"'),
  body('quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be a positive integer'),
  body('reason')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Reason must be between 5 and 200 characters')
];

// Order validation rules
export const validateOrder = [
  body('supplierId')
    .isUUID()
    .withMessage('Valid supplier ID is required'),
  body('productId')
    .isUUID()
    .withMessage('Valid product ID is required'),
  body('quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be a positive integer'),
  body('expectedDate')
    .isISO8601()
    .withMessage('Expected date must be a valid date')
];

// ID parameter validation
export const validateId = [
  param('id')
    .isUUID()
    .withMessage('Valid ID is required')
];

// Search query validation
export const validateSearchQuery = [
  query('q')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Search query must be between 1 and 100 characters'),
  query('category')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Category filter must be between 1 and 50 characters'),
  query('stockStatus')
    .optional()
    .isIn(['all', 'low', 'out', 'normal'])
    .withMessage('Stock status must be all, low, out, or normal'),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
];

