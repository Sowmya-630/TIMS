import { Product } from '../models/Product.js';
import { Transaction } from '../models/Transaction.js';
import { Notification } from '../models/Notification.js';
import logger from '../config/logger.js';

// Get all products
export const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const filters = {
      search: req.query.search || '',
      category: req.query.category || '',
      supplierId: req.query.supplierId || '',
      stockStatus: req.query.stockStatus || ''
    };

    const products = await Product.findAll(page, limit, filters);
    const total = await Product.count(filters);
    const totalPages = Math.ceil(total / limit);

    res.json({
      products: products.map(product => product.toJSON()),
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
    logger.error('Get products error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get product by ID
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({
      product: product.toJSON()
    });
  } catch (error) {
    logger.error('Get product by ID error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create new product
export const createProduct = async (req, res) => {
  try {
    const { name, category, description, stockLevel, reorderPoint, price, supplierId } = req.body;

    const product = await Product.create({
      name,
      category,
      description,
      stockLevel,
      reorderPoint,
      price,
      supplierId
    });
    
    logger.info(`New product created: ${name} by ${req.user.email}`);
    
    res.status(201).json({
      message: 'Product created successfully',
      product: product.toJSON()
    });
  } catch (error) {
    logger.error('Create product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const updatedProduct = await product.update(updateData);
    
    logger.info(`Product updated: ${product.name} by ${req.user.email}`);
    
    res.json({
      message: 'Product updated successfully',
      product: updatedProduct.toJSON()
    });
  } catch (error) {
    logger.error('Update product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    await product.delete();
    
    logger.info(`Product deleted: ${product.name} by ${req.user.email}`);
    
    res.json({
      message: 'Product deleted successfully'
    });
  } catch (error) {
    logger.error('Delete product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update stock level
export const updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, quantity, reason } = req.body;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Update stock level
    await product.updateStock(quantity, type);
    
    // Create transaction record
    await Transaction.create({
      productId: id,
      type,
      quantity,
      reason,
      userId: req.user.id
    });

    // Check if product needs reorder notification
    if (product.needsReorder()) {
      await Notification.createLowStockNotification(
        product.id,
        product.name,
        product.stockLevel,
        product.reorderPoint
      );
    }
    
    logger.info(`Stock updated for product: ${product.name} - ${type}: ${quantity} by ${req.user.email}`);
    
    res.json({
      message: 'Stock updated successfully',
      product: product.toJSON()
    });
  } catch (error) {
    logger.error('Update stock error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

// Get low stock products
export const getLowStockProducts = async (req, res) => {
  try {
    const products = await Product.getLowStock();
    
    res.json({
      products: products.map(product => product.toJSON())
    });
  } catch (error) {
    logger.error('Get low stock products error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get out of stock products
export const getOutOfStockProducts = async (req, res) => {
  try {
    const products = await Product.getOutOfStock();
    
    res.json({
      products: products.map(product => product.toJSON())
    });
  } catch (error) {
    logger.error('Get out of stock products error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get product categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Product.getCategories();
    
    res.json({
      categories
    });
  } catch (error) {
    logger.error('Get categories error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get product statistics
export const getProductStats = async (req, res) => {
  try {
    const totalProducts = await Product.count();
    const lowStockProducts = await Product.getLowStock();
    const outOfStockProducts = await Product.getOutOfStock();
    const categories = await Product.getCategories();

    res.json({
      totalProducts,
      lowStockCount: lowStockProducts.length,
      outOfStockCount: outOfStockProducts.length,
      categoryCount: categories.length
    });
  } catch (error) {
    logger.error('Get product stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
