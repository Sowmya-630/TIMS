import { executeQuery } from '../config/database.js';

export class Product {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.category = data.category;
    this.description = data.description;
    this.stockLevel = data.stock_level;
    this.reorderPoint = data.reorder_point;
    this.price = data.price;
    this.supplierId = data.supplier_id;
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;
  }

  // Create a new product
  static async create(productData) {
    const { name, category, description, stockLevel, reorderPoint, price, supplierId } = productData;
    
    const query = `
      INSERT INTO products (name, category, description, stock_level, reorder_point, price, supplier_id) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    
    const result = await executeQuery(query, [name, category, description, stockLevel, reorderPoint, price, supplierId]);
    return await Product.findById(result.insertId);
  }

  // Find product by ID
  static async findById(id) {
    const query = `
      SELECT p.*, s.name as supplier_name 
      FROM products p 
      LEFT JOIN suppliers s ON p.supplier_id = s.id 
      WHERE p.id = ?
    `;
    const products = await executeQuery(query, [id]);
    
    if (products.length === 0) return null;
    return new Product(products[0]);
  }

  // Get all products with pagination and filters
  static async findAll(page = 1, limit = 10, filters = {}) {
    const offset = (page - 1) * limit;
    let query = `
      SELECT p.*, s.name as supplier_name 
      FROM products p 
      LEFT JOIN suppliers s ON p.supplier_id = s.id
    `;
    let params = [];
    const conditions = [];

    // Apply filters
    if (filters.search) {
      conditions.push('(p.name LIKE ? OR p.category LIKE ? OR p.description LIKE ?)');
      params.push(`%${filters.search}%`, `%${filters.search}%`, `%${filters.search}%`);
    }

    if (filters.category) {
      conditions.push('p.category = ?');
      params.push(filters.category);
    }

    if (filters.supplierId) {
      conditions.push('p.supplier_id = ?');
      params.push(filters.supplierId);
    }

    if (filters.stockStatus) {
      switch (filters.stockStatus) {
        case 'low':
          conditions.push('p.stock_level <= p.reorder_point AND p.stock_level > 0');
          break;
        case 'out':
          conditions.push('p.stock_level = 0');
          break;
        case 'normal':
          conditions.push('p.stock_level > p.reorder_point');
          break;
      }
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const products = await executeQuery(query, params);
    return products.map(product => new Product(product));
  }

  // Update product
  async update(updateData) {
    const allowedFields = ['name', 'category', 'description', 'stock_level', 'reorder_point', 'price', 'supplier_id'];
    const updates = [];
    const values = [];

    for (const [key, value] of Object.entries(updateData)) {
      if (allowedFields.includes(key) && value !== undefined) {
        updates.push(`${key} = ?`);
        values.push(value);
      }
    }

    if (updates.length === 0) return this;

    values.push(this.id);
    const query = `UPDATE products SET ${updates.join(', ')} WHERE id = ?`;
    
    await executeQuery(query, values);
    return await Product.findById(this.id);
  }

  // Update stock level
  async updateStock(quantity, type) {
    const newStockLevel = type === 'Stock In' 
      ? this.stockLevel + quantity 
      : this.stockLevel - quantity;

    if (newStockLevel < 0) {
      throw new Error('Insufficient stock for this transaction');
    }

    const query = 'UPDATE products SET stock_level = ? WHERE id = ?';
    await executeQuery(query, [newStockLevel, this.id]);
    
    this.stockLevel = newStockLevel;
    return this;
  }

  // Delete product
  async delete() {
    const query = 'DELETE FROM products WHERE id = ?';
    await executeQuery(query, [this.id]);
    return true;
  }

  // Get product count
  static async count(filters = {}) {
    let query = 'SELECT COUNT(*) as count FROM products p';
    let params = [];
    const conditions = [];

    if (filters.search) {
      conditions.push('(p.name LIKE ? OR p.category LIKE ? OR p.description LIKE ?)');
      params.push(`%${filters.search}%`, `%${filters.search}%`, `%${filters.search}%`);
    }

    if (filters.category) {
      conditions.push('p.category = ?');
      params.push(filters.category);
    }

    if (filters.supplierId) {
      conditions.push('p.supplier_id = ?');
      params.push(filters.supplierId);
    }

    if (filters.stockStatus) {
      switch (filters.stockStatus) {
        case 'low':
          conditions.push('p.stock_level <= p.reorder_point AND p.stock_level > 0');
          break;
        case 'out':
          conditions.push('p.stock_level = 0');
          break;
        case 'normal':
          conditions.push('p.stock_level > p.reorder_point');
          break;
      }
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    const result = await executeQuery(query, params);
    return result[0].count;
  }

  // Get low stock products
  static async getLowStock() {
    const query = `
      SELECT p.*, s.name as supplier_name 
      FROM products p 
      LEFT JOIN suppliers s ON p.supplier_id = s.id 
      WHERE p.stock_level <= p.reorder_point AND p.stock_level > 0
      ORDER BY p.stock_level ASC
    `;
    const products = await executeQuery(query);
    return products.map(product => new Product(product));
  }

  // Get out of stock products
  static async getOutOfStock() {
    const query = `
      SELECT p.*, s.name as supplier_name 
      FROM products p 
      LEFT JOIN suppliers s ON p.supplier_id = s.id 
      WHERE p.stock_level = 0
      ORDER BY p.name ASC
    `;
    const products = await executeQuery(query);
    return products.map(product => new Product(product));
  }

  // Get all categories
  static async getCategories() {
    const query = 'SELECT DISTINCT category FROM products ORDER BY category ASC';
    const categories = await executeQuery(query);
    return categories.map(cat => cat.category);
  }

  // Check if product needs reorder
  needsReorder() {
    return this.stockLevel <= this.reorderPoint;
  }

  // Get stock status
  getStockStatus() {
    if (this.stockLevel === 0) return 'out';
    if (this.stockLevel <= this.reorderPoint) return 'low';
    return 'normal';
  }

  // Convert to JSON
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      category: this.category,
      description: this.description,
      stockLevel: this.stockLevel,
      reorderPoint: this.reorderPoint,
      price: this.price,
      supplierId: this.supplierId,
      supplierName: this.supplier_name,
      stockStatus: this.getStockStatus(),
      needsReorder: this.needsReorder(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}
