import { Notification } from '../models/Notification.js';
import logger from '../config/logger.js';

// Get notifications for current user
export const getNotifications = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const unreadOnly = req.query.unreadOnly === 'true';

    const notifications = await Notification.findByUser(req.user.id, page, limit, unreadOnly);
    const total = await Notification.count({ userId: req.user.id, isRead: unreadOnly ? false : undefined });
    const totalPages = Math.ceil(total / limit);

    res.json({
      notifications: notifications.map(notification => notification.toJSON()),
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    logger.error('Get notifications error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get notification by ID
export const getNotificationById = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findById(id);
    
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    // Check if user has access to this notification
    if (notification.userId && notification.userId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({
      notification: notification.toJSON()
    });
  } catch (error) {
    logger.error('Get notification by ID error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Mark notification as read
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findById(id);
    
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    // Check if user has access to this notification
    if (notification.userId && notification.userId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await notification.markAsRead();
    
    logger.info(`Notification marked as read: ${id} by ${req.user.email}`);
    
    res.json({
      message: 'Notification marked as read',
      notification: notification.toJSON()
    });
  } catch (error) {
    logger.error('Mark notification as read error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Mark notification as unread
export const markAsUnread = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findById(id);
    
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    // Check if user has access to this notification
    if (notification.userId && notification.userId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await notification.markAsUnread();
    
    logger.info(`Notification marked as unread: ${id} by ${req.user.email}`);
    
    res.json({
      message: 'Notification marked as unread',
      notification: notification.toJSON()
    });
  } catch (error) {
    logger.error('Mark notification as unread error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Mark all notifications as read
export const markAllAsRead = async (req, res) => {
  try {
    await Notification.markAllAsRead(req.user.id);
    
    logger.info(`All notifications marked as read by ${req.user.email}`);
    
    res.json({
      message: 'All notifications marked as read'
    });
  } catch (error) {
    logger.error('Mark all notifications as read error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete notification
export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findById(id);
    
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    // Check if user has access to this notification
    if (notification.userId && notification.userId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await notification.delete();
    
    logger.info(`Notification deleted: ${id} by ${req.user.email}`);
    
    res.json({
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    logger.error('Delete notification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get unread count
export const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.getUnreadCount(req.user.id);
    
    res.json({
      unreadCount: count
    });
  } catch (error) {
    logger.error('Get unread count error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all notifications (Admin only)
export const getAllNotifications = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const filters = {
      type: req.query.type || '',
      isRead: req.query.isRead !== undefined ? req.query.isRead === 'true' : undefined,
      dateFrom: req.query.dateFrom || '',
      dateTo: req.query.dateTo || ''
    };

    const notifications = await Notification.findAll(page, limit, filters);
    const total = await Notification.count(filters);
    const totalPages = Math.ceil(total / limit);

    res.json({
      notifications: notifications.map(notification => notification.toJSON()),
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    logger.error('Get all notifications error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create system notification (Admin only)
export const createSystemNotification = async (req, res) => {
  try {
    const { title, message, userId } = req.body;

    const notification = await Notification.createSystemNotification(title, message, userId);
    
    logger.info(`System notification created: ${title} by ${req.user.email}`);
    
    res.status(201).json({
      message: 'System notification created successfully',
      notification: notification.toJSON()
    });
  } catch (error) {
    logger.error('Create system notification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get recent notifications
export const getRecentNotifications = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const notifications = await Notification.getRecent(limit);
    
    res.json({
      notifications: notifications.map(notification => notification.toJSON())
    });
  } catch (error) {
    logger.error('Get recent notifications error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

