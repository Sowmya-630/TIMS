import { executeQuery } from '../config/database.js';

export class AuditLog {
  constructor(data) {
    this.id = data.id;
    this.userId = data.user_id;
    this.action = data.action;
    this.entityType = data.entity_type;
    this.entityId = data.entity_id;
    this.details = data.details;
    this.timestamp = data.timestamp;
  }

  // Create a new audit log entry
  static async create(logData) {
    const { userId, action, entityType, entityId, details } = logData;
    
    const query = `
      INSERT INTO audit_logs (user_id, action, entity_type, entity_id, details) 
      VALUES (?, ?, ?, ?, ?)
    `;
    
    const result = await executeQuery(query, [
      userId, 
      action, 
      entityType, 
      entityId, 
      details
    ]);
    
    return await AuditLog.findById(result.insertId);
  }

  // Find log by ID
  static async findById(id) {
    const query = 'SELECT * FROM audit_logs WHERE id = ?';
    const logs = await executeQuery(query, [id]);
    
    if (logs.length === 0) return null;
    return new AuditLog(logs[0]);
  }

  // Get logs by user ID
  static async findByUserId(userId, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const query = 'SELECT * FROM audit_logs WHERE user_id = ? ORDER BY timestamp DESC LIMIT ? OFFSET ?';
    const logs = await executeQuery(query, [userId, limit, offset]);
    
    return logs.map(log => new AuditLog(log));
  }

  // Get logs by entity
  static async findByEntity(entityType, entityId, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const query = 'SELECT * FROM audit_logs WHERE entity_type = ? AND entity_id = ? ORDER BY timestamp DESC LIMIT ? OFFSET ?';
    const logs = await executeQuery(query, [entityType, entityId, limit, offset]);
    
    return logs.map(log => new AuditLog(log));
  }

  // Get all logs with pagination and filtering
  static async findAll(page = 1, limit = 10, filters = {}) {
    const offset = (page - 1) * limit;
    let query = 'SELECT * FROM audit_logs';
    let params = [];
    let conditions = [];

    if (filters.userId) {
      conditions.push('user_id = ?');
      params.push(filters.userId);
    }

    if (filters.action) {
      conditions.push('action = ?');
      params.push(filters.action);
    }

    if (filters.entityType) {
      conditions.push('entity_type = ?');
      params.push(filters.entityType);
    }

    if (filters.entityId) {
      conditions.push('entity_id = ?');
      params.push(filters.entityId);
    }

    if (filters.startDate) {
      conditions.push('timestamp >= ?');
      params.push(filters.startDate);
    }

    if (filters.endDate) {
      conditions.push('timestamp <= ?');
      params.push(filters.endDate);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY timestamp DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const logs = await executeQuery(query, params);
    return logs.map(log => new AuditLog(log));
  }

  // Get log count
  static async count(filters = {}) {
    let query = 'SELECT COUNT(*) as count FROM audit_logs';
    let params = [];
    let conditions = [];

    if (filters.userId) {
      conditions.push('user_id = ?');
      params.push(filters.userId);
    }

    if (filters.action) {
      conditions.push('action = ?');
      params.push(filters.action);
    }

    if (filters.entityType) {
      conditions.push('entity_type = ?');
      params.push(filters.entityType);
    }

    if (filters.entityId) {
      conditions.push('entity_id = ?');
      params.push(filters.entityId);
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
      userId: this.userId,
      action: this.action,
      entityType: this.entityType,
      entityId: this.entityId,
      details: this.details,
      timestamp: this.timestamp
    };
  }
}