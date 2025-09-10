import { Order } from '../models/Order.js';
import { Notification } from '../models/Notification.js';
import logger from '../config/logger.js';

// Get all orders
export const getOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const filters = {
      supplierId: req.query.supplierId || '',
      productId: req.query.productId || '',
      status: req.query.status || '',
      dateFrom: req.query.dateFrom || '',
      dateTo: req.query.dateTo || '',
      search: req.query.search || ''
    };

    const orders = await Order.findAll(page, limit, filters);
    const total = await Order.count(filters);
    const totalPages = Math.ceil(total / limit);

    res.json({
      orders: orders.map(order => order.toJSON()),
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
    logger.error('Get orders error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get order by ID
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({
      order: order.toJSON()
    });
  } catch (error) {
    logger.error('Get order by ID error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create new order
export const createOrder = async (req, res) => {
  try {
    const { supplierId, productId, quantity, expectedDate } = req.body;

    const order = await Order.create({
      supplierId,
      productId,
      quantity,
      expectedDate
    });
    
    logger.info(`New order created: ${order.id} by ${req.user.email}`);
    
    res.status(201).json({
      message: 'Order created successfully',
      order: order.toJSON()
    });
  } catch (error) {
    logger.error('Create order error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update order
export const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const updatedOrder = await order.update(updateData);
    
    logger.info(`Order updated: ${order.id} by ${req.user.email}`);
    
    res.json({
      message: 'Order updated successfully',
      order: updatedOrder.toJSON()
    });
  } catch (error) {
    logger.error('Update order error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, deliveredDate } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const updatedOrder = await order.updateStatus(status, deliveredDate);
    
    logger.info(`Order status updated: ${order.id} to ${status} by ${req.user.email}`);
    
    res.json({
      message: 'Order status updated successfully',
      order: updatedOrder.toJSON()
    });
  } catch (error) {
    logger.error('Update order status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete order
export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Only allow deletion of pending orders
    if (order.status !== 'Pending') {
      return res.status(400).json({ 
        error: 'Can only delete pending orders' 
      });
    }

    await order.delete();
    
    logger.info(`Order deleted: ${order.id} by ${req.user.email}`);
    
    res.json({
      message: 'Order deleted successfully'
    });
  } catch (error) {
    logger.error('Delete order error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get orders by supplier
export const getOrdersBySupplier = async (req, res) => {
  try {
    const { supplierId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const orders = await Order.findBySupplier(supplierId, page, limit);
    const total = await Order.count({ supplierId });
    const totalPages = Math.ceil(total / limit);

    res.json({
      orders: orders.map(order => order.toJSON()),
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
    logger.error('Get orders by supplier error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get orders by product
export const getOrdersByProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const orders = await Order.findByProduct(productId, page, limit);
    const total = await Order.count({ productId });
    const totalPages = Math.ceil(total / limit);

    res.json({
      orders: orders.map(order => order.toJSON()),
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
    logger.error('Get orders by product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get overdue orders
export const getOverdueOrders = async (req, res) => {
  try {
    const orders = await Order.getOverdue();
    
    res.json({
      orders: orders.map(order => order.toJSON())
    });
  } catch (error) {
    logger.error('Get overdue orders error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get pending orders
export const getPendingOrders = async (req, res) => {
  try {
    const orders = await Order.getPending();
    
    res.json({
      orders: orders.map(order => order.toJSON())
    });
  } catch (error) {
    logger.error('Get pending orders error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get order statistics
export const getOrderStats = async (req, res) => {
  try {
    const filters = {
      supplierId: req.query.supplierId || '',
      productId: req.query.productId || '',
      dateFrom: req.query.dateFrom || '',
      dateTo: req.query.dateTo || ''
    };

    const stats = await Order.getStatistics(filters);
    
    res.json({
      statistics: stats
    });
  } catch (error) {
    logger.error('Get order stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
