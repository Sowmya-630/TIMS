import { Transaction } from '../models/Transaction.js';
import { Product } from '../models/Product.js';
import logger from '../config/logger.js';

// Get all transactions
export const getTransactions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const filters = {
      productId: req.query.productId || '',
      userId: req.query.userId || '',
      type: req.query.type || '',
      dateFrom: req.query.dateFrom || '',
      dateTo: req.query.dateTo || '',
      search: req.query.search || ''
    };

    const transactions = await Transaction.findAll(page, limit, filters);
    const total = await Transaction.count(filters);
    const totalPages = Math.ceil(total / limit);

    res.json({
      transactions: transactions.map(transaction => transaction.toJSON()),
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
    logger.error('Get transactions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get transaction by ID
export const getTransactionById = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findById(id);
    
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json({
      transaction: transaction.toJSON()
    });
  } catch (error) {
    logger.error('Get transaction by ID error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create new transaction
export const createTransaction = async (req, res) => {
  try {
    const { productId, type, quantity, reason } = req.body;

    // Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check stock availability for stock out transactions
    if (type === 'Stock Out' && product.stockLevel < quantity) {
      return res.status(400).json({ 
        error: `Insufficient stock. Available: ${product.stockLevel}, Requested: ${quantity}` 
      });
    }

    // Create transaction
    const transaction = await Transaction.create({
      productId,
      type,
      quantity,
      reason,
      userId: req.user.id
    });

    // Update product stock level
    await product.updateStock(quantity, type);
    
    logger.info(`Transaction created: ${type} ${quantity} units of ${product.name} by ${req.user.email}`);
    
    res.status(201).json({
      message: 'Transaction created successfully',
      transaction: transaction.toJSON()
    });
  } catch (error) {
    logger.error('Create transaction error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

// Get transactions by product
export const getTransactionsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const transactions = await Transaction.findByProduct(productId, page, limit);
    const total = await Transaction.count({ productId });
    const totalPages = Math.ceil(total / limit);

    res.json({
      transactions: transactions.map(transaction => transaction.toJSON()),
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
    logger.error('Get transactions by product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get transactions by user
export const getTransactionsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const transactions = await Transaction.findByUser(userId, page, limit);
    const total = await Transaction.count({ userId });
    const totalPages = Math.ceil(total / limit);

    res.json({
      transactions: transactions.map(transaction => transaction.toJSON()),
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
    logger.error('Get transactions by user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get recent transactions
export const getRecentTransactions = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const transactions = await Transaction.getRecent(limit);
    
    res.json({
      transactions: transactions.map(transaction => transaction.toJSON())
    });
  } catch (error) {
    logger.error('Get recent transactions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get transaction statistics
export const getTransactionStats = async (req, res) => {
  try {
    const filters = {
      productId: req.query.productId || '',
      userId: req.query.userId || '',
      type: req.query.type || '',
      dateFrom: req.query.dateFrom || '',
      dateTo: req.query.dateTo || ''
    };

    const stats = await Transaction.getStatistics(filters);
    
    res.json({
      statistics: stats
    });
  } catch (error) {
    logger.error('Get transaction stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete transaction
export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    const transaction = await Transaction.findById(id);
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    // Only allow deletion of recent transactions (within 24 hours)
    const transactionDate = new Date(transaction.timestamp);
    const now = new Date();
    const hoursDiff = (now - transactionDate) / (1000 * 60 * 60);

    if (hoursDiff > 24) {
      return res.status(400).json({ 
        error: 'Cannot delete transactions older than 24 hours' 
      });
    }

    // Reverse the stock change
    const product = await Product.findById(transaction.productId);
    if (product) {
      const reverseType = transaction.type === 'Stock In' ? 'Stock Out' : 'Stock In';
      await product.updateStock(transaction.quantity, reverseType);
    }

    await transaction.delete();
    
    logger.info(`Transaction deleted: ${transaction.id} by ${req.user.email}`);
    
    res.json({
      message: 'Transaction deleted successfully'
    });
  } catch (error) {
    logger.error('Delete transaction error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

