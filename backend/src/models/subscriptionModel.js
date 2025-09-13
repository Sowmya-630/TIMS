import { executeQuery } from '../config/database.js';
import { SubscriptionPlan } from './planModel.js';
import { User } from './userModel.js';

export class Subscription {
  constructor(data) {
    this.id = data.id;
    this.userId = data.user_id;
    this.planId = data.plan_id;
    this.status = data.status;
    this.startDate = data.start_date;
    this.endDate = data.end_date;
    this.autoRenew = data.auto_renew === 1;
    this.dataUsed = data.data_used;
    this.discountId = data.discount_id;
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;
  }

  // Create a new subscription
  static async create(subscriptionData) {
    const { userId, planId, status = 'Active', startDate, endDate, autoRenew = false, discountId = null } = subscriptionData;
    
    const query = `INSERT INTO subscriptions (user_id, plan_id, status, start_date, end_date, auto_renew, discount_id) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const result = await executeQuery(query, [userId, planId, status, startDate, endDate, autoRenew ? 1 : 0, discountId]);

    // Create audit entry for subscription creation
    await executeQuery('INSERT INTO audit_logs (user_id, action, entity_type, entity_id, details) VALUES (?, ?, ?, ?, ?)',
      [userId, 'create', 'subscription', result.insertId, `Subscription created with plan ${planId}`]);

    return await Subscription.findById(result.insertId);
  }

  // Find subscription by ID
  static async findById(id) {
    const query = 'SELECT * FROM subscriptions WHERE id = ?';
    const subscriptions = await executeQuery(query, [id]);
    if (subscriptions.length === 0) return null;
    return new Subscription(subscriptions[0]);
  }

  // Get all subscriptions with pagination
  static async findAll(page = 1, limit = 10, userId = null, status = null) {
    const offset = (page - 1) * limit;
    let query = 'SELECT * FROM subscriptions';
    let params = [];
    let conditions = [];

    if (userId) {
      conditions.push('user_id = ?');
      params.push(userId);
    }

    if (status) {
      conditions.push('status = ?');
      params.push(status);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const subscriptions = await executeQuery(query, params);
    return subscriptions.map(subscription => new Subscription(subscription));
  }

  // Get subscriptions by user ID
  static async findByUserId(userId, status = null) {
    let query = 'SELECT * FROM subscriptions WHERE user_id = ?';
    let params = [userId];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    query += ' ORDER BY created_at DESC';

    const subscriptions = await executeQuery(query, params);
    return subscriptions.map(subscription => new Subscription(subscription));
  }

  // Update subscription
  async update(updateData, userId) {
    const allowedFields = ['status', 'end_date', 'auto_renew', 'data_used', 'discount_id'];
    const updates = [];
    const values = [];
    let auditDetails = [];

    for (const [key, value] of Object.entries(updateData)) {
      const dbField = key.replace(/([A-Z])/g, '_$1').toLowerCase(); // Convert camelCase to snake_case
      if (allowedFields.includes(dbField) && value !== undefined) {
        updates.push(`${dbField} = ?`);
        values.push(dbField === 'auto_renew' ? (value ? 1 : 0) : value);
        auditDetails.push(`${dbField}=${value}`);
      }
    }

    if (updates.length === 0) return this;

    values.push(this.id);
    const query = `UPDATE subscriptions SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
    await executeQuery(query, values);

    // Create audit entry for subscription update
    await executeQuery('INSERT INTO audit_logs (user_id, action, entity_type, entity_id, details) VALUES (?, ?, ?, ?, ?)',
      [userId, 'update', 'subscription', this.id, auditDetails.join(', ')]);

    return await Subscription.findById(this.id);
  }

  // Cancel subscription
  async cancel(userId, reason = 'User requested cancellation') {
    const query = 'UPDATE subscriptions SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
    await executeQuery(query, ['Cancelled', this.id]);

    // Create audit entry for subscription cancellation
    await executeQuery('INSERT INTO audit_logs (user_id, action, entity_type, entity_id, details) VALUES (?, ?, ?, ?, ?)',
      [userId, 'cancel', 'subscription', this.id, reason]);

    return await Subscription.findById(this.id);
  }

  // Renew subscription
  async renew(userId, newEndDate) {
    const query = 'UPDATE subscriptions SET status = ?, end_date = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
    await executeQuery(query, ['Active', newEndDate, this.id]);

    // Create audit entry for subscription renewal
    await executeQuery('INSERT INTO audit_logs (user_id, action, entity_type, entity_id, details) VALUES (?, ?, ?, ?, ?)',
      [userId, 'renew', 'subscription', this.id, `Renewed until ${newEndDate}`]);

    return await Subscription.findById(this.id);
  }

  // Record usage
  async recordUsage(dataAmount) {
    // Update total data used in subscription
    await executeQuery('UPDATE subscriptions SET data_used = data_used + ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [dataAmount, this.id]);

    return await Subscription.findById(this.id);
  }

  // Get subscription count
  static async count(userId = null, status = null) {
    let query = 'SELECT COUNT(*) as count FROM subscriptions';
    let params = [];
    let conditions = [];

    if (userId) {
      conditions.push('user_id = ?');
      params.push(userId);
    }

    if (status) {
      conditions.push('status = ?');
      params.push(status);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    const result = await executeQuery(query, params);
    return result[0].count;
  }

  // Get subscription with plan details
  async getWithPlanDetails() {
    const plan = await SubscriptionPlan.findById(this.planId);
    const user = await User.findById(this.userId);

    return {
      ...this.toJSON(),
      plan: plan ? plan.toJSON() : null,
      user: user ? user.toJSON() : null
    };
  }

  // Get audit history
  async getAuditHistory() {
    const query = 'SELECT * FROM audit_logs WHERE entity_type = ? AND entity_id = ? ORDER BY timestamp DESC';
    const auditHistory = await executeQuery(query, ['subscription', this.id]);

    return auditHistory.map(audit => ({
      id: audit.id,
      userId: audit.user_id,
      action: audit.action,
      details: audit.details,
      timestamp: audit.timestamp
    }));
  }

  // Convert to JSON
  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      planId: this.planId,
      status: this.status,
      startDate: this.startDate,
      endDate: this.endDate,
      autoRenew: this.autoRenew,
      dataUsed: this.dataUsed,
      discountId: this.discountId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}