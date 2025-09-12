import { executeQuery } from '../config/database.js';

export class Notification {
  constructor(data) {
    this.id = data.id;
    this.type = data.type;
    this.title = data.title;
    this.message = data.message;
    this.isRead = data.is_read;
    this.userId = data.user_id;
    this.productId = data.product_id;
    this.orderId = data.order_id;
    this.timestamp = data.timestamp;
  }

  // Create a new notification
  static async create(notificationData) {
    const { type, title, message, userId, productId, orderId } = notificationData;
    
    const query = `
      INSERT INTO notifications (type, title, message, user_id, product_id, order_id) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    const result = await executeQuery(query, [type, title, message, userId, productId, orderId]);
    return await Notification.findById(result.insertId);
  }

  // Find notification by ID
  static async findById(id) {
    const query = 'SELECT * FROM notifications WHERE id = ?';
    const notifications = await executeQuery(query, [id]);
    
    if (notifications.length === 0) return null;
    return new Notification(notifications[0]);
  }

  // Get notifications for a user
  static async findByUser(userId, page = 1, limit = 10, unreadOnly = false) {
    const offset = (page - 1) * limit;
    let query = 'SELECT * FROM notifications WHERE user_id = ? OR user_id IS NULL';
    let params = [userId];

    if (unreadOnly) {
      query += ' AND is_read = FALSE';
    }

    query += ' ORDER BY timestamp DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const notifications = await executeQuery(query, params);
    return notifications.map(notification => new Notification(notification));
  }

  // Get all notifications with pagination and filters
  static async findAll(page = 1, limit = 10, filters = {}) {
    const offset = (page - 1) * limit;
    let query = 'SELECT * FROM notifications';
    let params = [];
    const conditions = [];

    // Apply filters
    if (filters.type) {
      conditions.push('type = ?');
      params.push(filters.type);
    }

    if (filters.userId) {
      conditions.push('(user_id = ? OR user_id IS NULL)');
      params.push(filters.userId);
    }

    if (filters.isRead !== undefined) {
      conditions.push('is_read = ?');
      params.push(filters.isRead);
    }

    if (filters.dateFrom) {
      conditions.push('timestamp >= ?');
      params.push(filters.dateFrom);
    }

    if (filters.dateTo) {
      conditions.push('timestamp <= ?');
      params.push(filters.dateTo);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY timestamp DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const notifications = await executeQuery(query, params);
    return notifications.map(notification => new Notification(notification));
  }

  // Get notification count
  static async count(filters = {}) {
    let query = 'SELECT COUNT(*) as count FROM notifications';
    let params = [];
    const conditions = [];

    if (filters.type) {
      conditions.push('type = ?');
      params.push(filters.type);
    }

    if (filters.userId) {
      conditions.push('(user_id = ? OR user_id IS NULL)');
      params.push(filters.userId);
    }

    if (filters.isRead !== undefined) {
      conditions.push('is_read = ?');
      params.push(filters.isRead);
    }

    if (filters.dateFrom) {
      conditions.push('timestamp >= ?');
      params.push(filters.dateFrom);
    }

    if (filters.dateTo) {
      conditions.push('timestamp <= ?');
      params.push(filters.dateTo);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    const result = await executeQuery(query, params);
    return result[0].count;
  }

  // Mark notification as read
  async markAsRead() {
    const query = 'UPDATE notifications SET is_read = TRUE WHERE id = ?';
    await executeQuery(query, [this.id]);
    this.isRead = true;
    return this;
  }

  // Mark notification as unread
  async markAsUnread() {
    const query = 'UPDATE notifications SET is_read = FALSE WHERE id = ?';
    await executeQuery(query, [this.id]);
    this.isRead = false;
    return this;
  }

  // Mark all notifications as read for a user
  static async markAllAsRead(userId) {
    const query = 'UPDATE notifications SET is_read = TRUE WHERE user_id = ? AND is_read = FALSE';
    await executeQuery(query, [userId]);
    return true;
  }

  // Delete notification
  async delete() {
    const query = 'DELETE FROM notifications WHERE id = ?';
    await executeQuery(query, [this.id]);
    return true;
  }

  // Delete old notifications (cleanup)
  static async deleteOld(daysOld = 30) {
    const query = `DELETE FROM notifications WHERE datetime(timestamp) < datetime('now', '-' || ? || ' day')`;
    const result = await executeQuery(query, [daysOld]);
    return result.affectedRows;
  }

  // Get unread count for user
  static async getUnreadCount(userId) {
    const query = 'SELECT COUNT(*) as count FROM notifications WHERE (user_id = ? OR user_id IS NULL) AND is_read = FALSE';
    const result = await executeQuery(query, [userId]);
    return result[0].count;
  }

  // Create low stock notification
  static async createLowStockNotification(productId, productName, currentStock, reorderPoint) {
    const title = 'Low Stock Alert';
    const message = `${productName} is running low (${currentStock} units remaining, reorder point: ${reorderPoint})`;
    
    return await Notification.create({
      type: 'Low Stock',
      title,
      message,
      productId,
      userId: null // Send to all users
    });
  }

  // Create overdue order notification
  static async createOverdueOrderNotification(orderId, productName, expectedDate) {
    const title = 'Overdue Order Alert';
    const message = `${productName} order is overdue (Expected: ${new Date(expectedDate).toLocaleDateString()})`;
    
    return await Notification.create({
      type: 'Overdue Order',
      title,
      message,
      orderId,
      userId: null // Send to all users
    });
  }

  // Create system notification
  static async createSystemNotification(title, message, userId = null) {
    return await Notification.create({
      type: 'System',
      title,
      message,
      userId
    });
  }

  // Get recent notifications
  static async getRecent(limit = 10) {
    const query = `
      SELECT * FROM notifications 
      ORDER BY timestamp DESC 
      LIMIT ?
    `;
    const notifications = await executeQuery(query, [limit]);
    return notifications.map(notification => new Notification(notification));
  }

  // Convert to JSON
  toJSON() {
    return {
      id: this.id,
      type: this.type,
      title: this.title,
      message: this.message,
      isRead: this.isRead,
      userId: this.userId,
      productId: this.productId,
      orderId: this.orderId,
      timestamp: this.timestamp
    };
  }
}

