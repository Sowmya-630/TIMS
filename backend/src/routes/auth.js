import express from 'express';
import { 
  register, 
  login, 
  getProfile, 
  updateProfile, 
  changePassword, 
  logout 
} from '../controllers/authController.js';
import { authenticate } from '../config/auth.js';
import { validateUser, handleValidationErrors } from '../config/validation.js';

const router = express.Router();

// Public routes
router.post('/register', validateUser, handleValidationErrors, register);
router.post('/login', login);

// Protected routes
router.use(authenticate);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/change-password', changePassword);
router.post('/logout', logout);

export default router;
