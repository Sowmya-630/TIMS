import { Subscription } from '../models/subscriptionModel.js';
import { SubscriptionPlan } from '../models/planModel.js';
import { User } from '../models/userModel.js';

export const createSubscription = async (req, res) => {
  try {
    const subscriptionData = {
      userId: req.body.userId || req.user.id,
      planId: req.body.planId,
      status: req.body.status || 'Active',
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      autoRenew: req.body.autoRenew || false,
      discountId: req.body.discountId || null
    };

    // Verify plan exists
    const plan = await SubscriptionPlan.findById(subscriptionData.planId);
    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    // Verify user exists
    const user = await User.findById(subscriptionData.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const subscription = await Subscription.create(subscriptionData);
    const subscriptionWithDetails = await subscription.getWithPlanDetails();
    
    res.status(201).json(subscriptionWithDetails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSubscriptions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const userId = req.query.userId || (req.user.role === 'EndUser' ? req.user.id : null);
    const status = req.query.status || null;

    const subscriptions = await Subscription.findAll(page, limit, userId, status);
    const total = await Subscription.count(userId, status);

    // Get detailed subscription info
    const subscriptionsWithDetails = await Promise.all(
      subscriptions.map(async (subscription) => {
        return await subscription.getWithPlanDetails();
      })
    );

    res.json({
      subscriptions: subscriptionsWithDetails,
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

export const getSubscriptionById = async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    // Check if user can access this subscription
    if (req.user.role === 'EndUser' && subscription.userId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const subscriptionWithDetails = await subscription.getWithPlanDetails();
    res.json(subscriptionWithDetails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    // Check if user can update this subscription
    if (req.user.role === 'EndUser' && subscription.userId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const updatedSubscription = await subscription.update(req.body, req.user.id);
    const subscriptionWithDetails = await updatedSubscription.getWithPlanDetails();
    
    res.json(subscriptionWithDetails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const cancelSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    // Check if user can cancel this subscription
    if (req.user.role === 'EndUser' && subscription.userId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const reason = req.body.reason || 'User requested cancellation';
    const cancelledSubscription = await subscription.cancel(req.user.id, reason);
    const subscriptionWithDetails = await cancelledSubscription.getWithPlanDetails();
    
    res.json(subscriptionWithDetails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const renewSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    // Check if user can renew this subscription
    if (req.user.role === 'EndUser' && subscription.userId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const newEndDate = req.body.newEndDate;
    if (!newEndDate) {
      return res.status(400).json({ message: 'New end date is required' });
    }

    const renewedSubscription = await subscription.renew(req.user.id, newEndDate);
    const subscriptionWithDetails = await renewedSubscription.getWithPlanDetails();
    
    res.json(subscriptionWithDetails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const recordUsage = async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    const dataAmount = req.body.dataAmount;
    if (!dataAmount || dataAmount <= 0) {
      return res.status(400).json({ message: 'Valid data amount is required' });
    }

    const updatedSubscription = await subscription.recordUsage(dataAmount);
    const subscriptionWithDetails = await updatedSubscription.getWithPlanDetails();
    
    res.json(subscriptionWithDetails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};