// backend/controllers/adminController.js
import { executeQuery } from '../config/database.js';
import logger from '../config/logger.js';
import { AuditLog } from '../models/AuditLogModel.js';
import { SubscriptionPlan } from '../models/planModel.js';

// Helper to log admin actions
async function logAction(userId, action, entityType, entityId, details) {
  await AuditLog.create({
    userId,
    action,
    entityType,
    entityId,
    details,
  });
  logger.info(`Admin action: ${action}, entity: ${entityType}, by user ${userId}`);
}

export const adminController = {
  // 1. Create a new plan
  createPlan: async (req, res) => {
    try {
      const plan = await SubscriptionPlan.create(req.body);
      await logAction(req.user.id, 'CREATE_PLAN', 'PLAN', plan.id, `Plan ${plan.name} created`);
      res.status(201).json({ message: 'Plan created successfully', plan: plan.toJSON() });
    } catch (err) {
      logger.error('Error creating plan:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // 2. Update a plan
  updatePlan: async (req, res) => {
    try {
      const plan = await SubscriptionPlan.findById(req.params.planId);
      if (!plan) return res.status(404).json({ error: 'Plan not found' });

      const updatedPlan = await plan.update(req.body);
      await logAction(req.user.id, 'UPDATE_PLAN', 'PLAN', plan.id, `Plan ${plan.id} updated`);
      res.json({ message: 'Plan updated successfully', plan: updatedPlan.toJSON() });
    } catch (err) {
      logger.error('Error updating plan:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // 3. Delete a plan
  deletePlan: async (req, res) => {
    try {
      const plan = await SubscriptionPlan.findById(req.params.planId);
      if (!plan) return res.status(404).json({ error: 'Plan not found' });

      await plan.delete();
      await logAction(req.user.id, 'DELETE_PLAN', 'PLAN', plan.id, `Plan ${plan.id} deleted`);
      res.json({ message: 'Plan deleted successfully' });
    } catch (err) {
      logger.error('Error deleting plan:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // 4. View all plans
  getAllPlans: async (req, res) => {
    try {
      const { page = 1, limit = 10, search = '', productType, isActive } = req.query;
      const plans = await SubscriptionPlan.findAll(
        parseInt(page),
        parseInt(limit),
        search,
        productType,
        isActive !== undefined ? isActive === 'true' : null
      );

      await logAction(req.user.id, 'VIEW_PLANS', 'PLAN', null, 'Viewed all plans');

      res.json({
        page: parseInt(page),
        limit: parseInt(limit),
        plans: plans.map(p => p.toJSON()),
      });
    } catch (err) {
      logger.error('Error fetching plans:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // 5. View all subscriptions (admin access)
  getAllSubscriptions: async (req, res) => {
    try {
      const query = `
        SELECT s.id, u.full_name, u.email, p.name AS plan_name, s.status, s.start_date, s.end_date
        FROM subscriptions s
        JOIN users u ON s.user_id = u.id
        JOIN subscription_plans p ON s.plan_id = p.id
      `;
      const subscriptions = await executeQuery(query);

      await logAction(req.user.id, 'VIEW_SUBSCRIPTIONS', 'SUBSCRIPTION', null, 'Viewed all subscriptions');
      res.json(subscriptions);
    } catch (err) {
      logger.error('Error fetching subscriptions:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // 6. View audit logs
  getAuditLogs: async (req, res) => {
    try {
      const { page = 1, limit = 20 } = req.query;
      const logs = await AuditLog.findAll(parseInt(page), parseInt(limit));

      await logAction(req.user.id, 'VIEW_AUDIT_LOGS', 'AUDIT', null, 'Viewed audit logs');
      res.json(logs);
    } catch (err) {
      logger.error('Error fetching audit logs:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // 7. Dashboard: Top plans by subscription count
  getTopPlans: async (req, res) => {
    try {
      const query = `
        SELECT p.id, p.name, COUNT(s.id) AS subscription_count
        FROM subscriptions s
        JOIN subscription_plans p ON s.plan_id = p.id
        WHERE s.status = 'active'
        GROUP BY p.id
        ORDER BY subscription_count DESC
        LIMIT 5
      `;
      const topPlans = await executeQuery(query);

      await logAction(req.user.id, 'VIEW_TOP_PLANS', 'PLAN', null, 'Viewed top plans');
      res.json(topPlans);
    } catch (err) {
      logger.error('Error fetching top plans:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
};
