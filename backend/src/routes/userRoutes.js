import express from 'express';
import { registerUser, loginUser, getUsers } from '../controllers/userController.js';
import { verifyToken, verifyRole } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

// Only admin can view all users
router.get('/', verifyToken, verifyRole('admin'), getUsers);

export default router;