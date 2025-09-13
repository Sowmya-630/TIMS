import { executeQuery } from '../config/database.js';

export class SubscriptionPlan {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.productType = data.product_type;
    this.price = data.price;
    this.dataQuota = data.data_quota;
    this.durationDays = data.duration_days;
    this.isActive = data.is_active === 1;
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;
  }

  // Create a new subscription plan
  static async create(planData) {
    const { name, description, productType, price, dataQuota, durationDays, isActive = true } = planData;
    
    const query = `INSERT INTO subscription_plans (name, description, product_type, price, data_quota, duration_days, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const result = await executeQuery(query, [name, description, productType, price, dataQuota, durationDays, isActive ? 1 : 0]);
    return await SubscriptionPlan.findById(result.insertId);
  }

  // Find plan by ID
  static async findById(id) {
    const query = 'SELECT * FROM subscription_plans WHERE id = ?';
    const plans = await executeQuery(query, [id]);
    if (plans.length === 0) return null;
    return new SubscriptionPlan(plans[0]);
  }

  // Get all plans with pagination
  static async findAll(page = 1, limit = 10, search = '', productType = null, isActive = null) {
    const offset = (page - 1) * limit;
    let query = 'SELECT * FROM subscription_plans';
    let params = [];
    let conditions = [];

    if (search) {
      conditions.push('(name LIKE ? OR description LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }

    if (productType) {
      conditions.push('product_type = ?');
      params.push(productType);
    }

    if (isActive !== null) {
      conditions.push('is_active = ?');
      params.push(isActive ? 1 : 0);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const plans = await executeQuery(query, params);
    return plans.map(plan => new SubscriptionPlan(plan));
  }

  // Update plan
  async update(updateData) {
    const allowedFields = ['name', 'description', 'product_type', 'price', 'data_quota', 'duration_days', 'is_active'];
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
    const query = `UPDATE subscription_plans SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
    await executeQuery(query, values);
    return await SubscriptionPlan.findById(this.id);
  }

  // Delete plan (with cascade deletion of subscriptions)
  async delete() {
    try {
      // First delete all subscriptions using this plan
      const deleteSubscriptionsQuery = 'DELETE FROM subscriptions WHERE plan_id = ?';
      await executeQuery(deleteSubscriptionsQuery, [this.id]);
      
      // Then delete the plan
      const deletePlanQuery = 'DELETE FROM subscription_plans WHERE id = ?';
      await executeQuery(deletePlanQuery, [this.id]);
      
      return true;
    } catch (error) {
      console.error('Error deleting plan:', error);
      throw new Error('Failed to delete plan and associated subscriptions');
    }
  }

  // Get plan count
  static async count(search = '', productType = null, isActive = null) {
    let query = 'SELECT COUNT(*) as count FROM subscription_plans';
    let params = [];
    let conditions = [];

    if (search) {
      conditions.push('(name LIKE ? OR description LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }

    if (productType) {
      conditions.push('product_type = ?');
      params.push(productType);
    }

    if (isActive !== null) {
      conditions.push('is_active = ?');
      params.push(isActive ? 1 : 0);
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
      productType: this.productType,
      price: this.price,
      dataQuota: this.dataQuota,
      durationDays: this.durationDays,
      isActive: this.isActive,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}