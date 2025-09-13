// backend/controllers/planController.js
import logger from '../config/logger.js';
import { SubscriptionPlan } from '../models/planModel.js';

// Create a new plan
export const createPlan = async (req, res) => {
  try {
    const { name, description, productType, price, dataQuota, durationDays, isActive } = req.body;

    const plan = await SubscriptionPlan.create({
      name,
      description,
      productType,
      price,
      dataQuota,
      durationDays,
      isActive
    });

    logger.info(`Plan created: ${name} by user ${req.user.email}`);
    res.status(201).json({ message: 'Plan created successfully', plan: plan.toJSON() });
  } catch (error) {
    logger.error('Error creating plan:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all plans (with pagination, search, filters)
export const getAllPlans = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', productType, isActive } = req.query;

    const plans = await SubscriptionPlan.findAll(
      parseInt(page),
      parseInt(limit),
      search,
      productType,
      isActive !== undefined ? isActive === 'true' : null
    );

    const total = await SubscriptionPlan.count(
      search,
      productType,
      isActive !== undefined ? isActive === 'true' : null
    );

    res.json({
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      plans: plans.map(plan => plan.toJSON())
    });
  } catch (error) {
    logger.error('Error fetching plans:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get plan by ID
export const getPlanById = async (req, res) => {
  try {
    const plan = await SubscriptionPlan.findById(req.params.planId);
    if (!plan) return res.status(404).json({ error: 'Plan not found' });

    res.json(plan.toJSON());
  } catch (error) {
    logger.error('Error fetching plan by ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update plan
export const updatePlan = async (req, res) => {
  try {
    const plan = await SubscriptionPlan.findById(req.params.planId);
    if (!plan) return res.status(404).json({ error: 'Plan not found' });

    const updatedPlan = await plan.update(req.body);
    logger.info(`Plan updated: ${plan.id} by user ${req.user.email}`);
    res.json({ message: 'Plan updated successfully', plan: updatedPlan.toJSON() });
  } catch (error) {
    logger.error('Error updating plan:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete plan
export const deletePlan = async (req, res) => {
  try {
    const plan = await SubscriptionPlan.findById(req.params.planId);
    if (!plan) return res.status(404).json({ error: 'Plan not found' });

    await plan.delete();
    logger.info(`Plan deleted: ${plan.id} by user ${req.user.email}`);
    res.json({ message: 'Plan deleted successfully' });
  } catch (error) {
    logger.error('Error deleting plan:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
