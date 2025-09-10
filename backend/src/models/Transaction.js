import { executeQuery } from '../config/database.js';

export class Transaction {
  constructor(data) {
    this.id = data.id;
    this.productId = data.product_id;
    this.type = data.type;
    this.quantity = data.quantity;
    this.reason = data.reason;
    this.userId = data.user_id;
    this.timestamp = data.timestamp;
    this.productName = data.product_name;
    this.userName = data.user_name;
  }

  // Create a new transaction
  static async create(transactionData) {
    const { productId, type, quantity, reason, userId } = transactionData;
    
    const query = `
      INSERT INTO transactions (product_id, type, quantity, reason, user_id) 
      VALUES (?, ?, ?, ?, ?)
    `;
    
    const result = await executeQuery(query, [productId, type, quantity, reason, userId]);
    return await Transaction.findById(result.insertId);
  }

  // Find transaction by ID
  static async findById(id) {
    const query = `
      SELECT t.*, p.name as product_name, u.full_name as user_name
      FROM transactions t
      LEFT JOIN products p ON t.product_id = p.id
      LEFT JOIN users u ON t.user_id = u.id
      WHERE t.id = ?
    `;
    const transactions = await executeQuery(query, [id]);
    
    if (transactions.length === 0) return null;
    return new Transaction(transactions[0]);
  }

  // Get all transactions with pagination and filters
  static async findAll(page = 1, limit = 10, filters = {}) {
    const offset = (page - 1) * limit;
    let query = `
      SELECT t.*, p.name as product_name, u.full_name as user_name
      FROM transactions t
      LEFT JOIN products p ON t.product_id = p.id
      LEFT JOIN users u ON t.user_id = u.id
    `;
    let params = [];
    const conditions = [];

    // Apply filters
    if (filters.productId) {
      conditions.push('t.product_id = ?');
      params.push(filters.productId);
    }

    if (filters.userId) {
      conditions.push('t.user_id = ?');
      params.push(filters.userId);
    }

    if (filters.type) {
      conditions.push('t.type = ?');
      params.push(filters.type);
    }

    if (filters.dateFrom) {
      conditions.push('t.timestamp >= ?');
      params.push(filters.dateFrom);
    }

    if (filters.dateTo) {
      conditions.push('t.timestamp <= ?');
      params.push(filters.dateTo);
    }

    if (filters.search) {
      conditions.push('(p.name LIKE ? OR t.reason LIKE ? OR u.full_name LIKE ?)');
      params.push(`%${filters.search}%`, `%${filters.search}%`, `%${filters.search}%`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY t.timestamp DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const transactions = await executeQuery(query, params);
    return transactions.map(transaction => new Transaction(transaction));
  }

  // Get transactions by product
  static async findByProduct(productId, page = 1, limit = 10) {
    return await Transaction.findAll(page, limit, { productId });
  }

  // Get transactions by user
  static async findByUser(userId, page = 1, limit = 10) {
    return await Transaction.findAll(page, limit, { userId });
  }

  // Get transaction count
  static async count(filters = {}) {
    let query = `
      SELECT COUNT(*) as count 
      FROM transactions t
      LEFT JOIN products p ON t.product_id = p.id
      LEFT JOIN users u ON t.user_id = u.id
    `;
    let params = [];
    const conditions = [];

    if (filters.productId) {
      conditions.push('t.product_id = ?');
      params.push(filters.productId);
    }

    if (filters.userId) {
      conditions.push('t.user_id = ?');
      params.push(filters.userId);
    }

    if (filters.type) {
      conditions.push('t.type = ?');
      params.push(filters.type);
    }

    if (filters.dateFrom) {
      conditions.push('t.timestamp >= ?');
      params.push(filters.dateFrom);
    }

    if (filters.dateTo) {
      conditions.push('t.timestamp <= ?');
      params.push(filters.dateTo);
    }

    if (filters.search) {
      conditions.push('(p.name LIKE ? OR t.reason LIKE ? OR u.full_name LIKE ?)');
      params.push(`%${filters.search}%`, `%${filters.search}%`, `%${filters.search}%`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    const result = await executeQuery(query, params);
    return result[0].count;
  }

  // Get transaction statistics
  static async getStatistics(filters = {}) {
    const baseQuery = `
      FROM transactions t
      LEFT JOIN products p ON t.product_id = p.id
      LEFT JOIN users u ON t.user_id = u.id
    `;
    
    let whereClause = '';
    let params = [];
    const conditions = [];

    if (filters.productId) {
      conditions.push('t.product_id = ?');
      params.push(filters.productId);
    }

    if (filters.userId) {
      conditions.push('t.user_id = ?');
      params.push(filters.userId);
    }

    if (filters.type) {
      conditions.push('t.type = ?');
      params.push(filters.type);
    }

    if (filters.dateFrom) {
      conditions.push('t.timestamp >= ?');
      params.push(filters.dateFrom);
    }

    if (filters.dateTo) {
      conditions.push('t.timestamp <= ?');
      params.push(filters.dateTo);
    }

    if (conditions.length > 0) {
      whereClause = ' WHERE ' + conditions.join(' AND ');
    }

    const queries = [
      {
        query: `SELECT COUNT(*) as total_transactions ${baseQuery}${whereClause}`,
        params: params
      },
      {
        query: `SELECT COUNT(*) as stock_in_transactions ${baseQuery}${whereClause} AND t.type = 'Stock In'`,
        params: params
      },
      {
        query: `SELECT COUNT(*) as stock_out_transactions ${baseQuery}${whereClause} AND t.type = 'Stock Out'`,
        params: params
      },
      {
        query: `SELECT SUM(t.quantity) as total_stock_in ${baseQuery}${whereClause} AND t.type = 'Stock In'`,
        params: params
      },
      {
        query: `SELECT SUM(t.quantity) as total_stock_out ${baseQuery}${whereClause} AND t.type = 'Stock Out'`,
        params: params
      }
    ];

    const results = await Promise.all(
      queries.map(({ query, params }) => executeQuery(query, params))
    );

    return {
      totalTransactions: results[0][0].total_transactions || 0,
      stockInTransactions: results[1][0].stock_in_transactions || 0,
      stockOutTransactions: results[2][0].stock_out_transactions || 0,
      totalStockIn: results[3][0].total_stock_in || 0,
      totalStockOut: results[4][0].total_stock_out || 0
    };
  }

  // Get recent transactions
  static async getRecent(limit = 10) {
    const query = `
      SELECT t.*, p.name as product_name, u.full_name as user_name
      FROM transactions t
      LEFT JOIN products p ON t.product_id = p.id
      LEFT JOIN users u ON t.user_id = u.id
      ORDER BY t.timestamp DESC
      LIMIT ?
    `;
    const transactions = await executeQuery(query, [limit]);
    return transactions.map(transaction => new Transaction(transaction));
  }

  // Delete transaction
  async delete() {
    const query = 'DELETE FROM transactions WHERE id = ?';
    await executeQuery(query, [this.id]);
    return true;
  }

  // Convert to JSON
  toJSON() {
    return {
      id: this.id,
      productId: this.productId,
      productName: this.productName,
      type: this.type,
      quantity: this.quantity,
      reason: this.reason,
      userId: this.userId,
      userName: this.userName,
      timestamp: this.timestamp
    };
  }
}

