import { CronJob } from 'cron';
import { Product } from '../models/Product.js';
import { Order } from '../models/Order.js';
import { Notification } from '../models/Notification.js';
import logger from '../config/logger.js';

class NotificationService {
  constructor() {
    this.jobs = [];
    this.startJobs();
  }

  startJobs() {
    // Check for low stock every hour
    this.jobs.push(new CronJob('0 * * * *', () => {
      this.checkLowStock();
    }, null, true, 'America/New_York'));

    // Check for overdue orders every 6 hours
    this.jobs.push(new CronJob('0 */6 * * *', () => {
      this.checkOverdueOrders();
    }, null, true, 'America/New_York'));

    // Clean up old notifications daily at 2 AM
    this.jobs.push(new CronJob('0 2 * * *', () => {
      this.cleanupOldNotifications();
    }, null, true, 'America/New_York'));

    logger.info('Notification service started with scheduled jobs');
  }

  async checkLowStock() {
    try {
      const lowStockProducts = await Product.getLowStock();
      
      for (const product of lowStockProducts) {
        // Check if notification already exists for this product
        const existingNotification = await this.getExistingLowStockNotification(product.id);
        
        if (!existingNotification) {
          await Notification.createLowStockNotification(
            product.id,
            product.name,
            product.stockLevel,
            product.reorderPoint
          );
          
          logger.info(`Low stock notification created for product: ${product.name}`);
        }
      }
    } catch (error) {
      logger.error('Error checking low stock:', error);
    }
  }

  async checkOverdueOrders() {
    try {
      const overdueOrders = await Order.getOverdue();
      
      for (const order of overdueOrders) {
        // Update order status to overdue if not already
        if (order.status !== 'Overdue') {
          await order.updateStatus('Overdue');
        }

        // Check if notification already exists for this order
        const existingNotification = await this.getExistingOverdueOrderNotification(order.id);
        
        if (!existingNotification) {
          await Notification.createOverdueOrderNotification(
            order.id,
            order.productName,
            order.expectedDate
          );
          
          logger.info(`Overdue order notification created for order: ${order.id}`);
        }
      }
    } catch (error) {
      logger.error('Error checking overdue orders:', error);
    }
  }

  async cleanupOldNotifications() {
    try {
      const deletedCount = await Notification.deleteOld(30); // Delete notifications older than 30 days
      logger.info(`Cleaned up ${deletedCount} old notifications`);
    } catch (error) {
      logger.error('Error cleaning up old notifications:', error);
    }
  }

  async getExistingLowStockNotification(productId) {
    try {
      const query = `
        SELECT * FROM notifications 
        WHERE type = 'Low Stock' 
        AND product_id = ? 
        AND timestamp > DATE_SUB(NOW(), INTERVAL 1 HOUR)
        ORDER BY timestamp DESC 
        LIMIT 1
      `;
      const { executeQuery } = await import('../config/database.js');
      const notifications = await executeQuery(query, [productId]);
      return notifications.length > 0 ? notifications[0] : null;
    } catch (error) {
      logger.error('Error checking existing low stock notification:', error);
      return null;
    }
  }

  async getExistingOverdueOrderNotification(orderId) {
    try {
      const query = `
        SELECT * FROM notifications 
        WHERE type = 'Overdue Order' 
        AND order_id = ? 
        AND timestamp > DATE_SUB(NOW(), INTERVAL 6 HOUR)
        ORDER BY timestamp DESC 
        LIMIT 1
      `;
      const { executeQuery } = await import('../config/database.js');
      const notifications = await executeQuery(query, [orderId]);
      return notifications.length > 0 ? notifications[0] : null;
    } catch (error) {
      logger.error('Error checking existing overdue order notification:', error);
      return null;
    }
  }

  stopJobs() {
    this.jobs.forEach(job => job.stop());
    logger.info('Notification service stopped');
  }
}

export default NotificationService;

