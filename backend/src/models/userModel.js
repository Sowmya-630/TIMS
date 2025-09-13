import { executeQuery } from '../config/database.js';
import { hashPassword, comparePassword } from '../config/auth.js';

export class User {
  constructor(data) {
    this.id = data.id;
    this.fullName = data.full_name;
    this.email = data.email;
    this.role = data.role;
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;
  }

  // Create a new user
  static async create(userData) {
    const { fullName, email, password, role = 'EndUser' } = userData;
    const hashedPassword = await hashPassword(password);
    
    const query = `INSERT INTO users (full_name, email, password, role) VALUES (?, ?, ?, ?)`;
    const result = await executeQuery(query, [fullName, email, hashedPassword, role]);
    return await User.findById(result.insertId);
  }

  // Find user by ID
  static async findById(id) {
    const query = 'SELECT * FROM users WHERE id = ?';
    const users = await executeQuery(query, [id]);
    if (users.length === 0) return null;
    return new User(users[0]);
  }

  // Find user by email
  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = ?';
    const users = await executeQuery(query, [email]);
    if (users.length === 0) return null;
    return new User(users[0]);
  }

  // Get all users with pagination
  static async findAll(page = 1, limit = 10, search = '') {
    const offset = (page - 1) * limit;
    let query = 'SELECT * FROM users';
    let params = [];

    if (search) {
      query += ' WHERE full_name LIKE ? OR email LIKE ?';
      params = [`%${search}%`, `%${search}%`];
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const users = await executeQuery(query, params);
    return users.map(user => new User(user));
  }

  // Update user
  async update(updateData) {
    const allowedFields = ['full_name', 'email', 'role'];
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
    const query = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;

    await executeQuery(query, values);
    return await User.findById(this.id);
  }

  // Update password
  async updatePassword(newPassword) {
    const hashedPassword = await hashPassword(newPassword);
    const query = 'UPDATE users SET password = ? WHERE id = ?';

    await executeQuery(query, [hashedPassword, this.id]);
    return true;
  }

  // Verify password
  async verifyPassword(password) {
    const query = 'SELECT password FROM users WHERE id = ?';
    const users = await executeQuery(query, [this.id]);

    if (users.length === 0) return false;
    return await comparePassword(password, users[0].password);
  }

  // Delete user (with cascade deletion of subscriptions)
  async delete() {
    try {
      // First delete all subscriptions for this user
      const deleteSubscriptionsQuery = 'DELETE FROM subscriptions WHERE user_id = ?';
      await executeQuery(deleteSubscriptionsQuery, [this.id]);
      
      // Then delete the user
      const deleteUserQuery = 'DELETE FROM users WHERE id = ?';
      await executeQuery(deleteUserQuery, [this.id]);
      
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw new Error('Failed to delete user and associated data');
    }
  }

  // Get user count
  static async count(search = '') {
    let query = 'SELECT COUNT(*) as count FROM users';
    let params = [];

    if (search) {
      query += ' WHERE full_name LIKE ? OR email LIKE ?';
      params = [`%${search}%`, `%${search}%`];
    }

    const result = await executeQuery(query, params);
    return result[0].count;
  }

  // Get users by role
  static async findByRole(role) {
    const query = 'SELECT * FROM users WHERE role = ? ORDER BY created_at DESC';
    const users = await executeQuery(query, [role]);
    return users.map(user => new User(user));
  }

  // Get user subscriptions
  async getSubscriptions(status = null) {
    const { Subscription } = await import('./subscriptionModel.js');
    return await Subscription.findByUserId(this.id, status);
  }

  // Get user's active subscription
  async getActiveSubscription() {
    const { Subscription } = await import('./subscriptionModel.js');
    const subscriptions = await Subscription.findByUserId(this.id, 'Active');
    return subscriptions.length > 0 ? subscriptions[0] : null;
  }

  // Check if user has any subscription
  async hasSubscription() {
    const subscriptions = await this.getSubscriptions();
    return subscriptions.length > 0;
  }

  // Get user's subscription history
  async getSubscriptionHistory() {
    return await this.getSubscriptions();
  }

  // Get user with subscription details
  async getWithSubscriptions() {
    const subscriptions = await this.getSubscriptions();
    return {
      ...this.toJSON(),
      subscriptions: subscriptions.map(sub => sub.toJSON()),
      hasActiveSubscription: subscriptions.some(sub => sub.status === 'Active')
    };
  }

  // Convert to JSON (exclude sensitive data)
  toJSON() {
    return {
      id: this.id,
      fullName: this.fullName,
      email: this.email,
      role: this.role,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}