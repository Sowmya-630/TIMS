import { executeQuery } from '../config/database.js';

export class Supplier {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.contactPerson = data.contact_person;
    this.email = data.email;
    this.phone = data.phone;
    this.address = data.address;
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;
  }

  // Create a new supplier
  static async create(supplierData) {
    const { name, contactPerson, email, phone, address } = supplierData;
    
    const query = `
      INSERT INTO suppliers (name, contact_person, email, phone, address) 
      VALUES (?, ?, ?, ?, ?)
    `;
    
    const result = await executeQuery(query, [name, contactPerson, email, phone, address]);
    return await Supplier.findById(result.insertId);
  }

  // Find supplier by ID
  static async findById(id) {
    const query = 'SELECT * FROM suppliers WHERE id = ?';
    const suppliers = await executeQuery(query, [id]);
    
    if (suppliers.length === 0) return null;
    return new Supplier(suppliers[0]);
  }

  // Find supplier by email
  static async findByEmail(email) {
    const query = 'SELECT * FROM suppliers WHERE email = ?';
    const suppliers = await executeQuery(query, [email]);
    
    if (suppliers.length === 0) return null;
    return new Supplier(suppliers[0]);
  }

  // Get all suppliers with pagination
  static async findAll(page = 1, limit = 10, search = '') {
    const offset = (page - 1) * limit;
    let query = 'SELECT * FROM suppliers';
    let params = [];

    if (search) {
      query += ' WHERE name LIKE ? OR contact_person LIKE ? OR email LIKE ?';
      params = [`%${search}%`, `%${search}%`, `%${search}%`];
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const suppliers = await executeQuery(query, params);
    return suppliers.map(supplier => new Supplier(supplier));
  }

  // Update supplier
  async update(updateData) {
    const allowedFields = ['name', 'contact_person', 'email', 'phone', 'address'];
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
    const query = `UPDATE suppliers SET ${updates.join(', ')} WHERE id = ?`;
    
    await executeQuery(query, values);
    return await Supplier.findById(this.id);
  }

  // Delete supplier
  async delete() {
    const query = 'DELETE FROM suppliers WHERE id = ?';
    await executeQuery(query, [this.id]);
    return true;
  }

  // Get supplier count
  static async count(search = '') {
    let query = 'SELECT COUNT(*) as count FROM suppliers';
    let params = [];

    if (search) {
      query += ' WHERE name LIKE ? OR contact_person LIKE ? OR email LIKE ?';
      params = [`%${search}%`, `%${search}%`, `%${search}%`];
    }

    const result = await executeQuery(query, params);
    return result[0].count;
  }

  // Get supplier's products
  async getProducts() {
    const query = `
      SELECT p.*, s.name as supplier_name 
      FROM products p 
      LEFT JOIN suppliers s ON p.supplier_id = s.id 
      WHERE p.supplier_id = ?
      ORDER BY p.name ASC
    `;
    const products = await executeQuery(query, [this.id]);
    return products;
  }

  // Get supplier's order history
  async getOrderHistory() {
    const query = `
      SELECT o.*, p.name as product_name, p.category as product_category
      FROM orders o
      LEFT JOIN products p ON o.product_id = p.id
      WHERE o.supplier_id = ?
      ORDER BY o.order_date DESC
    `;
    const orders = await executeQuery(query, [this.id]);
    return orders;
  }

  // Get supplier statistics
  async getStatistics() {
    const queries = [
      {
        query: 'SELECT COUNT(*) as total_products FROM products WHERE supplier_id = ?',
        params: [this.id]
      },
      {
        query: 'SELECT COUNT(*) as total_orders FROM orders WHERE supplier_id = ?',
        params: [this.id]
      },
      {
        query: 'SELECT COUNT(*) as pending_orders FROM orders WHERE supplier_id = ? AND status IN ("Pending", "Confirmed", "Shipped")',
        params: [this.id]
      },
      {
        query: 'SELECT COUNT(*) as overdue_orders FROM orders WHERE supplier_id = ? AND status = "Overdue"',
        params: [this.id]
      }
    ];

    const results = await Promise.all(
      queries.map(({ query, params }) => executeQuery(query, params))
    );

    return {
      totalProducts: results[0][0].total_products,
      totalOrders: results[1][0].total_orders,
      pendingOrders: results[2][0].pending_orders,
      overdueOrders: results[3][0].overdue_orders
    };
  }

  // Check if supplier has products
  async hasProducts() {
    const query = 'SELECT COUNT(*) as count FROM products WHERE supplier_id = ?';
    const result = await executeQuery(query, [this.id]);
    return result[0].count > 0;
  }

  // Check if supplier has pending orders
  async hasPendingOrders() {
    const query = 'SELECT COUNT(*) as count FROM orders WHERE supplier_id = ? AND status IN ("Pending", "Confirmed", "Shipped")';
    const result = await executeQuery(query, [this.id]);
    return result[0].count > 0;
  }

  // Convert to JSON
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      contactPerson: this.contactPerson,
      email: this.email,
      phone: this.phone,
      address: this.address,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}
