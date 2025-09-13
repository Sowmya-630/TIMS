import express from 'express';
import { 
  registerUser, 
  loginUser, 
  getUsers, 
  getUserById, 
  updateUser, 
  updatePassword, 
  getUserSubscriptions, 
  deleteUser 
} from '../controllers/userController.js';
import { verifyToken, verifyRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Authenticated routes
router.get('/profile', verifyToken, (req, res) => {
  req.params.id = req.user.id;
  getUserById(req, res);
});
router.put('/profile', verifyToken, (req, res) => {
  req.params.id = req.user.id;
  updateUser(req, res);
});
router.put('/password', verifyToken, updatePassword);

// User-specific routes
router.get('/:id', verifyToken, getUserById);
router.put('/:id', verifyToken, updateUser);
router.get('/:id/subscriptions', verifyToken, getUserSubscriptions);

// Admin only routes
router.get('/', verifyToken, verifyRole('Admin'), getUsers);
router.delete('/:id', verifyToken, verifyRole('Admin'), deleteUser);

export default router;