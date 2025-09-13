// backend/controllers/subscriptionController.js
import { Discount } from '../models/discountModel.js';
import { SubscriptionPlan } from '../models/planModel.js';
import { Subscription } from '../models/subscriptionModel.js';
import { User } from '../models/userModel.js';

// Subscription Controller
export const subscriptionController = {

  // 1. Create a new subscription (Admin)
  createSubscription: async (req, res) => {
    try {
      const { userId, planId, startDate, endDate, autoRenew = false, discountId = null } = req.body;

      // Validate user and plan
      const user = await User.findById(userId);
      const plan = await SubscriptionPlan.findById(planId);
      if (!user || !plan) {
        return res.status(400).json({ error: 'Invalid user or plan' });
      }

      // Validate discount if provided
      if (discountId) {
        const discount = await Discount.findById(discountId);
        if (!discount || !discount.isActive) {
          return res.status(400).json({ error: 'Invalid or inactive discount' });
        }
      }

      const subscription = await Subscription.create({
        userId,
        planId,
        startDate,
        endDate,
        autoRenew,
        discountId
      });

      res.status(201).json({
        message: 'Subscription created successfully',
        subscription
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // 2. Get all subscriptions (Admin)
  getAllSubscriptions: async (req, res) => {
    try {
      const subscriptions = await Subscription.findAll();
      res.json(subscriptions);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // 3. Get subscriptions of the logged-in user
  getUserSubscriptions: async (req, res) => {
    try {
      const subscriptions = await Subscription.findByUserId(req.user.id);
      res.json(subscriptions);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // 4. Update subscription (Admin or user)
  updateSubscription: async (req, res) => {
    try {
      const { subscriptionId } = req.params;
      const updateData = req.body;

      const subscription = await Subscription.findById(subscriptionId);
      if (!subscription) return res.status(404).json({ error: 'Subscription not found' });

      const updatedSubscription = await subscription.update(updateData);
      res.json({
        message: 'Subscription updated successfully',
        subscription: updatedSubscription
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // 5. Cancel subscription
  cancelSubscription: async (req, res) => {
    try {
      const { subscriptionId } = req.params;
      const subscription = await Subscription.findById(subscriptionId);
      if (!subscription) return res.status(404).json({ error: 'Subscription not found' });

      const cancelledSubscription = await subscription.update({ status: 'cancelled' });
      res.json({
        message: 'Subscription cancelled successfully',
        subscription: cancelledSubscription
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // 6. Renew subscription
  renewSubscription: async (req, res) => {
    try {
      const { subscriptionId } = req.params;
      const { newEndDate } = req.body;

      const subscription = await Subscription.findById(subscriptionId);
      if (!subscription) return res.status(404).json({ error: 'Subscription not found' });

      const renewedSubscription = await subscription.update({ endDate: newEndDate, status: 'active' });
      res.json({
        message: 'Subscription renewed successfully',
        subscription: renewedSubscription
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // 7. Record usage
  recordUsage: async (req, res) => {
    try {
      const { subscriptionId } = req.params;
      const { dataUsed } = req.body;

      const subscription = await Subscription.findById(subscriptionId);
      if (!subscription) return res.status(404).json({ error: 'Subscription not found' });

      const updatedSubscription = await subscription.update({ dataUsed });
      res.json({
        message: 'Usage recorded successfully',
        subscription: updatedSubscription
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};
