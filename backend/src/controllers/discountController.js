import { Discount } from '../models/discountModel.js';

export const createDiscount = async (req, res) => {
  try {
    const discountData = {
      name: req.body.name,
      description: req.body.description,
      discountPercent: req.body.discountPercent,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      planId: req.body.planId || null,
      isActive: req.body.isActive !== undefined ? req.body.isActive : true
    };

    const discount = await Discount.create(discountData);
    res.status(201).json(discount.toJSON());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDiscounts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const isActive = req.query.isActive !== undefined ? req.query.isActive === 'true' : null;
    const planId = req.query.planId || null;

    const discounts = await Discount.findAll(page, limit, search, isActive, planId);
    const total = await Discount.count(search, isActive, planId);

    res.json({
      discounts: discounts.map(discount => discount.toJSON()),
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

export const getActiveDiscounts = async (req, res) => {
  try {
    const planId = req.query.planId || null;
    const discounts = await Discount.findActive(planId);
    res.json(discounts.map(discount => discount.toJSON()));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};