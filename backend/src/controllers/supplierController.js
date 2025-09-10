import { Supplier } from '../models/Supplier.js';
import logger from '../config/logger.js';

// Get all suppliers
export const getSuppliers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';

    const suppliers = await Supplier.findAll(page, limit, search);
    const total = await Supplier.count(search);
    const totalPages = Math.ceil(total / limit);

    res.json({
      suppliers: suppliers.map(supplier => supplier.toJSON()),
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
    logger.error('Get suppliers error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get supplier by ID
export const getSupplierById = async (req, res) => {
  try {
    const { id } = req.params;
    const supplier = await Supplier.findById(id);
    
    if (!supplier) {
      return res.status(404).json({ error: 'Supplier not found' });
    }

    res.json({
      supplier: supplier.toJSON()
    });
  } catch (error) {
    logger.error('Get supplier by ID error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create new supplier
export const createSupplier = async (req, res) => {
  try {
    const { name, contactPerson, email, phone, address } = req.body;

    // Check if supplier with email already exists
    const existingSupplier = await Supplier.findByEmail(email);
    if (existingSupplier) {
      return res.status(400).json({ error: 'Supplier with this email already exists' });
    }

    const supplier = await Supplier.create({
      name,
      contactPerson,
      email,
      phone,
      address
    });
    
    logger.info(`New supplier created: ${name} by ${req.user.email}`);
    
    res.status(201).json({
      message: 'Supplier created successfully',
      supplier: supplier.toJSON()
    });
  } catch (error) {
    logger.error('Create supplier error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update supplier
export const updateSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, contactPerson, email, phone, address } = req.body;

    const supplier = await Supplier.findById(id);
    if (!supplier) {
      return res.status(404).json({ error: 'Supplier not found' });
    }

    // Check if email is being changed and if it's already taken
    if (email && email !== supplier.email) {
      const existingSupplier = await Supplier.findByEmail(email);
      if (existingSupplier) {
        return res.status(400).json({ error: 'Email already in use' });
      }
    }

    const updatedSupplier = await supplier.update({
      name,
      contactPerson,
      email,
      phone,
      address
    });
    
    logger.info(`Supplier updated: ${supplier.name} by ${req.user.email}`);
    
    res.json({
      message: 'Supplier updated successfully',
      supplier: updatedSupplier.toJSON()
    });
  } catch (error) {
    logger.error('Update supplier error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete supplier
export const deleteSupplier = async (req, res) => {
  try {
    const { id } = req.params;

    const supplier = await Supplier.findById(id);
    if (!supplier) {
      return res.status(404).json({ error: 'Supplier not found' });
    }

    // Check if supplier has products
    const hasProducts = await supplier.hasProducts();
    if (hasProducts) {
      return res.status(400).json({ 
        error: 'Cannot delete supplier with existing products. Please remove or reassign products first.' 
      });
    }

    // Check if supplier has pending orders
    const hasPendingOrders = await supplier.hasPendingOrders();
    if (hasPendingOrders) {
      return res.status(400).json({ 
        error: 'Cannot delete supplier with pending orders. Please complete or cancel orders first.' 
      });
    }

    await supplier.delete();
    
    logger.info(`Supplier deleted: ${supplier.name} by ${req.user.email}`);
    
    res.json({
      message: 'Supplier deleted successfully'
    });
  } catch (error) {
    logger.error('Delete supplier error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get supplier's products
export const getSupplierProducts = async (req, res) => {
  try {
    const { id } = req.params;
    const supplier = await Supplier.findById(id);
    
    if (!supplier) {
      return res.status(404).json({ error: 'Supplier not found' });
    }

    const products = await supplier.getProducts();
    
    res.json({
      products: products.map(product => ({
        id: product.id,
        name: product.name,
        category: product.category,
        stockLevel: product.stock_level,
        reorderPoint: product.reorder_point,
        price: product.price,
        stockStatus: product.stock_level === 0 ? 'out' : 
                    product.stock_level <= product.reorder_point ? 'low' : 'normal'
      }))
    });
  } catch (error) {
    logger.error('Get supplier products error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get supplier's order history
export const getSupplierOrderHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const supplier = await Supplier.findById(id);
    
    if (!supplier) {
      return res.status(404).json({ error: 'Supplier not found' });
    }

    const orders = await supplier.getOrderHistory();
    
    res.json({
      orders: orders.map(order => ({
        id: order.id,
        productName: order.product_name,
        productCategory: order.product_category,
        quantity: order.quantity,
        status: order.status,
        orderDate: order.order_date,
        expectedDate: order.expected_date,
        deliveredDate: order.delivered_date
      }))
    });
  } catch (error) {
    logger.error('Get supplier order history error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get supplier statistics
export const getSupplierStats = async (req, res) => {
  try {
    const { id } = req.params;
    const supplier = await Supplier.findById(id);
    
    if (!supplier) {
      return res.status(404).json({ error: 'Supplier not found' });
    }

    const stats = await supplier.getStatistics();
    
    res.json({
      supplier: supplier.toJSON(),
      statistics: stats
    });
  } catch (error) {
    logger.error('Get supplier stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all supplier statistics
export const getAllSupplierStats = async (req, res) => {
  try {
    const totalSuppliers = await Supplier.count();
    
    res.json({
      totalSuppliers
    });
  } catch (error) {
    logger.error('Get all supplier stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
