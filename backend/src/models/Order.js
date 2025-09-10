import { executeQuery } from '../config/database.js';

export class Order {
  constructor(data) {
    this.id = data.id;
    this.supplierId = data.supplier_id;
    this.productId = data.product_id;
    this.quantity = data.quantity;
    this.status = data.status;
    this.orderDate = data.order_date;
    this.expectedDate = data.expected_date;
    this.deliveredDate = data.delivered_date;
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;
    this.supplierName = data.supplier_name;
    this.productName = data.product_name;
    this.productCategory = data.product_category;
  }

  // Create a new order
  static async create(orderData) {
    const { supplierId, productId, quantity, expectedDate } = orderData;
    
    const query = `
      INSERT INTO orders (supplier_id, product_id, quantity, expected_date) 
      VALUES (?, ?, ?, ?)
    `;
    
    const result = await executeQuery(query, [supplierId, productId, quantity, expectedDate]);
    return await Order.findById(result.insertId);
  }

  // Find order by ID
  static async findById(id) {
    const query = `
      SELECT o.*, s.name as supplier_name, p.name as product_name, p.category as product_category
      FROM orders o
      LEFT JOIN suppliers s ON o.supplier_id = s.id
      LEFT JOIN products p ON o.product_id = p.id
      WHERE o.id = ?
    `;
    const orders = await executeQuery(query, [id]);
    
    if (orders.length === 0) return null;
    return new Order(orders[0]);
  }

  // Get all orders with pagination and filters
  static async findAll(page = 1, limit = 10, filters = {}) {
    const offset = (page - 1) * limit;
    let query = `
      SELECT o.*, s.name as supplier_name, p.name as product_name, p.category as product_category
      FROM orders o
      LEFT JOIN suppliers s ON o.supplier_id = s.id
      LEFT JOIN products p ON o.product_id = p.id
    `;
    let params = [];
    const conditions = [];

    // Apply filters
    if (filters.supplierId) {
      conditions.push('o.supplier_id = ?');
      params.push(filters.supplierId);
    }

    if (filters.productId) {
      conditions.push('o.product_id = ?');
      params.push(filters.productId);
    }

    if (filters.status) {
      conditions.push('o.status = ?');
      params.push(filters.status);
    }

    if (filters.dateFrom) {
      conditions.push('o.order_date >= ?');
      params.push(filters.dateFrom);
    }

    if (filters.dateTo) {
      conditions.push('o.order_date <= ?');
      params.push(filters.dateTo);
    }

    if (filters.search) {
      conditions.push('(s.name LIKE ? OR p.name LIKE ?)');
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY o.order_date DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const orders = await executeQuery(query, params);
    return orders.map(order => new Order(order));
  }

  // Get orders by supplier
  static async findBySupplier(supplierId, page = 1, limit = 10) {
    return await Order.findAll(page, limit, { supplierId });
  }

  // Get orders by product
  static async findByProduct(productId, page = 1, limit = 10) {
    return await Order.findAll(page, limit, { productId });
  }

  // Get order count
  static async count(filters = {}) {
    let query = `
      SELECT COUNT(*) as count 
      FROM orders o
      LEFT JOIN suppliers s ON o.supplier_id = s.id
      LEFT JOIN products p ON o.product_id = p.id
    `;
    let params = [];
    const conditions = [];

    if (filters.supplierId) {
      conditions.push('o.supplier_id = ?');
      params.push(filters.supplierId);
    }

    if (filters.productId) {
      conditions.push('o.product_id = ?');
      params.push(filters.productId);
    }

    if (filters.status) {
      conditions.push('o.status = ?');
      params.push(filters.status);
    }

    if (filters.dateFrom) {
      conditions.push('o.order_date >= ?');
      params.push(filters.dateFrom);
    }

    if (filters.dateTo) {
      conditions.push('o.order_date <= ?');
      params.push(filters.dateTo);
    }

    if (filters.search) {
      conditions.push('(s.name LIKE ? OR p.name LIKE ?)');
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    const result = await executeQuery(query, params);
    return result[0].count;
  }

  // Update order status
  async updateStatus(status, deliveredDate = null) {
    const query = 'UPDATE orders SET status = ?, delivered_date = ? WHERE id = ?';
    await executeQuery(query, [status, deliveredDate, this.id]);
    
    this.status = status;
    if (deliveredDate) {
      this.deliveredDate = deliveredDate;
    }
    return this;
  }

  // Update order
  async update(updateData) {
    const allowedFields = ['supplier_id', 'product_id', 'quantity', 'status', 'expected_date', 'delivered_date'];
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
    const query = `UPDATE orders SET ${updates.join(', ')} WHERE id = ?`;
    
    await executeQuery(query, values);
    return await Order.findById(this.id);
  }

  // Delete order
  async delete() {
    const query = 'DELETE FROM orders WHERE id = ?';
    await executeQuery(query, [this.id]);
    return true;
  }

  // Get overdue orders
  static async getOverdue() {
    const query = `
      SELECT o.*, s.name as supplier_name, p.name as product_name, p.category as product_category
      FROM orders o
      LEFT JOIN suppliers s ON o.supplier_id = s.id
      LEFT JOIN products p ON o.product_id = p.id
      WHERE o.status IN ('Pending', 'Confirmed', 'Shipped') 
      AND o.expected_date < NOW()
      ORDER BY o.expected_date ASC
    `;
    const orders = await executeQuery(query);
    return orders.map(order => new Order(order));
  }

  // Get pending orders
  static async getPending() {
    const query = `
      SELECT o.*, s.name as supplier_name, p.name as product_name, p.category as product_category
      FROM orders o
      LEFT JOIN suppliers s ON o.supplier_id = s.id
      LEFT JOIN products p ON o.product_id = p.id
      WHERE o.status = 'Pending'
      ORDER BY o.order_date ASC
    `;
    const orders = await executeQuery(query);
    return orders.map(order => new Order(order));
  }

  // Get order statistics
  static async getStatistics(filters = {}) {
    const baseQuery = `
      FROM orders o
      LEFT JOIN suppliers s ON o.supplier_id = s.id
      LEFT JOIN products p ON o.product_id = p.id
    `;
    
    let whereClause = '';
    let params = [];
    const conditions = [];

    if (filters.supplierId) {
      conditions.push('o.supplier_id = ?');
      params.push(filters.supplierId);
    }

    if (filters.productId) {
      conditions.push('o.product_id = ?');
      params.push(filters.productId);
    }

    if (filters.dateFrom) {
      conditions.push('o.order_date >= ?');
      params.push(filters.dateFrom);
    }

    if (filters.dateTo) {
      conditions.push('o.order_date <= ?');
      params.push(filters.dateTo);
    }

    if (conditions.length > 0) {
      whereClause = ' WHERE ' + conditions.join(' AND ');
    }

    const queries = [
      {
        query: `SELECT COUNT(*) as total_orders ${baseQuery}${whereClause}`,
        params: params
      },
      {
        query: `SELECT COUNT(*) as pending_orders ${baseQuery}${whereClause} AND o.status = 'Pending'`,
        params: params
      },
      {
        query: `SELECT COUNT(*) as confirmed_orders ${baseQuery}${whereClause} AND o.status = 'Confirmed'`,
        params: params
      },
      {
        query: `SELECT COUNT(*) as shipped_orders ${baseQuery}${whereClause} AND o.status = 'Shipped'`,
        params: params
      },
      {
        query: `SELECT COUNT(*) as delivered_orders ${baseQuery}${whereClause} AND o.status = 'Delivered'`,
        params: params
      },
      {
        query: `SELECT COUNT(*) as overdue_orders ${baseQuery}${whereClause} AND o.status = 'Overdue'`,
        params: params
      }
    ];

    const results = await Promise.all(
      queries.map(({ query, params }) => executeQuery(query, params))
    );

    return {
      totalOrders: results[0][0].total_orders || 0,
      pendingOrders: results[1][0].pending_orders || 0,
      confirmedOrders: results[2][0].confirmed_orders || 0,
      shippedOrders: results[3][0].shipped_orders || 0,
      deliveredOrders: results[4][0].delivered_orders || 0,
      overdueOrders: results[5][0].overdue_orders || 0
    };
  }

  // Check if order is overdue
  isOverdue() {
    if (this.status === 'Delivered' || this.status === 'Overdue') return false;
    return new Date(this.expectedDate) < new Date();
  }

  // Get days until expected delivery
  getDaysUntilExpected() {
    const expected = new Date(this.expectedDate);
    const now = new Date();
    const diffTime = expected - now;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  // Convert to JSON
  toJSON() {
    return {
      id: this.id,
      supplierId: this.supplierId,
      supplierName: this.supplierName,
      productId: this.productId,
      productName: this.productName,
      productCategory: this.productCategory,
      quantity: this.quantity,
      status: this.status,
      orderDate: this.orderDate,
      expectedDate: this.expectedDate,
      deliveredDate: this.deliveredDate,
      isOverdue: this.isOverdue(),
      daysUntilExpected: this.getDaysUntilExpected(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}
