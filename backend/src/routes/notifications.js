import express from 'express';
import { 
  getNotifications, 
  getNotificationById, 
  markAsRead, 
  markAsUnread, 
  markAllAsRead, 
  deleteNotification, 
  getUnreadCount, 
  getAllNotifications, 
  createSystemNotification, 
  getRecentNotifications 
} from '../controllers/notificationController.js';
import { authenticate, checkRole } from '../config/auth.js';
import { 
  validateId, 
  handleValidationErrors 
} from '../config/validation.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Public routes (all authenticated users)
router.get('/', getNotifications);
router.get('/recent', getRecentNotifications);
router.get('/unread-count', getUnreadCount);
router.get('/:id', validateId, handleValidationErrors, getNotificationById);
router.put('/:id/read', validateId, handleValidationErrors, markAsRead);
router.put('/:id/unread', validateId, handleValidationErrors, markAsUnread);
router.put('/mark-all-read', markAllAsRead);
router.delete('/:id', validateId, handleValidationErrors, deleteNotification);

// Admin only routes
router.get('/admin/all', checkRole(['Admin']), getAllNotifications);
router.post('/admin/system', checkRole(['Admin']), createSystemNotification);

export default router;
