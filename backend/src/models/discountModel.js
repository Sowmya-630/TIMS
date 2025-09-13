import { executeQuery } from '../config/database.js';

export class Discount {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.discountPercent = data.discount_percent;
    this.startDate = data.start_date;
    this.endDate = data.end_date;
    this.planId = data.plan_id;
    this.isActive = data.is_active === 1;
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;
  }

  // Create a new discount
  static async create(discountData) {
    const { name, description, discountPercent, startDate, endDate, planId = null, isActive = true } = discountData;
    
    const query = `INSERT INTO discounts (name, description, discount_percent, start_date, end_date, plan_id, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const result = await executeQuery(query, [name, description, discountPercent, startDate, endDate, planId, isActive ? 1 : 0]);
    return await Discount.findById(result.insertId);
  }

  // Find discount by ID
  static async findById(id) {
    const query = 'SELECT * FROM discounts WHERE id = ?';
    const discounts = await executeQuery(query, [id]);
    if (discounts.length === 0) return null;
    return new Discount(discounts[0]);
  }

  // Get all discounts with pagination
  static async findAll(page = 1, limit = 10, search = '', isActive = null, planId = null) {
    const offset = (page - 1) * limit;
    let query = 'SELECT * FROM discounts';
    let params = [];
    let conditions = [];

    if (search) {
      conditions.push('(name LIKE ? OR description LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }

    if (isActive !== null) {
      conditions.push('is_active = ?');
      params.push(isActive ? 1 : 0);
    }

    if (planId) {
      conditions.push('plan_id = ?');
      params.push(planId);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const discounts = await executeQuery(query, params);
    return discounts.map(discount => new Discount(discount));
  }

  // Get active discounts
  static async findActive(planId = null) {
    const currentDate = new Date().toISOString();
    let query = `SELECT * FROM discounts WHERE is_active = 1 AND start_date <= ? AND end_date >= ?`;
    let params = [currentDate, currentDate];

    if (planId) {
      query += ' AND (plan_id = ? OR plan_id IS NULL)';
      params.push(planId);
    }

    query += ' ORDER BY discount_percent DESC';

    const discounts = await executeQuery(query, params);
    return discounts.map(discount => new Discount(discount));
  }

  // Update discount
  async update(updateData) {
    const allowedFields = ['name', 'description', 'discount_percent', 'start_date', 'end_date', 'plan_id', 'is_active'];
    const updates = [];
    const values = [];

    for (const [key, value] of Object.entries(updateData)) {
      const dbField = key.replace(/([A-Z])/g, '_$1').toLowerCase(); // Convert camelCase to snake_case
      if (allowedFields.includes(dbField) && value !== undefined) {
        updates.push(`${dbField} = ?`);
        values.push(dbField === 'is_active' ? (value ? 1 : 0) : value);
      }
    }

    if (updates.length === 0) return this;

    values.push(this.id);
    const query = `UPDATE discounts SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
    await executeQuery(query, values);
    return await Discount.findById(this.id);
  }

  // Delete discount
  async delete() {
    const query = 'DELETE FROM discounts WHERE id = ?';
    await executeQuery(query, [this.id]);
    return true;
  }

  // Get discount count
  static async count(search = '', isActive = null, planId = null) {
    let query = 'SELECT COUNT(*) as count FROM discounts';
    let params = [];
    let conditions = [];

    if (search) {
      conditions.push('(name LIKE ? OR description LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }

    if (isActive !== null) {
      conditions.push('is_active = ?');
      params.push(isActive ? 1 : 0);
    }

    if (planId) {
      conditions.push('plan_id = ?');
      params.push(planId);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    const result = await executeQuery(query, params);
    return result[0].count;
  }

  // Convert to JSON
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      discountPercent: this.discountPercent,
      startDate: this.startDate,
      endDate: this.endDate,
      planId: this.planId,
      isActive: this.isActive,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}