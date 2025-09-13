import { SubscriptionPlan } from '../models/planModel.js';

// Create a new plan
export const createPlan = async (req, res) => {
  try {
    const planData = {
      name: req.body.name,
      description: req.body.description,
      productType: req.body.productType,
      price: req.body.price,
      dataQuota: req.body.dataQuota,
      durationDays: req.body.durationDays,
      isActive: req.body.isActive !== undefined ? req.body.isActive : true
    };

    const plan = await SubscriptionPlan.create(planData);
    res.status(201).json(plan.toJSON());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all plans
export const getPlans = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const productType = req.query.productType || null;
    const isActive = req.query.isActive !== undefined ? req.query.isActive === 'true' : null;

    const plans = await SubscriptionPlan.findAll(page, limit, search, productType, isActive);
    const total = await SubscriptionPlan.count(search, productType, isActive);

    res.json({
      plans: plans.map(plan => plan.toJSON()),
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

// Get active plans only
export const getActivePlans = async (req, res) => {
  try {
    const plans = await SubscriptionPlan.findAll(1, 100, '', null, true);
    res.json(plans.map(plan => plan.toJSON()));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get plan by ID
export const getPlanById = async (req, res) => {
  try {
    const plan = await SubscriptionPlan.findById(req.params.id);
    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }
    res.json(plan.toJSON());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update plan
export const updatePlan = async (req, res) => {
  try {
    const plan = await SubscriptionPlan.findById(req.params.id);
    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    const updatedPlan = await plan.update(req.body);
    res.json(updatedPlan.toJSON());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete plan
export const deletePlan = async (req, res) => {
  try {
    const plan = await SubscriptionPlan.findById(req.params.id);
    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    await plan.delete();
    res.json({ message: 'Plan and all associated subscriptions deleted successfully' });
  } catch (error) {
    console.error('Delete plan error:', error);
    res.status(500).json({ message: error.message });
  }
};