import { AuditLog } from '../models/auditLogModel.js';

export const createAudit = async (req, res) => {
  try {
    const auditData = {
      userId: req.body.userId,
      action: req.body.action,
      entityType: req.body.entityType,
      entityId: req.body.entityId,
      details: req.body.details
    };

    const audit = await AuditLog.create(auditData);
    res.status(201).json(audit.toJSON());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAudits = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const filters = {};

    // Add filters if provided
    if (req.query.userId) filters.userId = req.query.userId;
    if (req.query.action) filters.action = req.query.action;
    if (req.query.entityType) filters.entityType = req.query.entityType;

    const audits = await AuditLog.findAll(page, limit, filters);
    const total = await AuditLog.count(filters);

    res.json({
      audits: audits.map(audit => audit.toJSON()),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};