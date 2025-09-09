const express = require('express');
const Order = require('../models/Order');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// GET all orders
router.get('/', authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find().populate('productId supplierId');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE order
router.post('/', authMiddleware, async (req, res) => {
  try {
    const newOrder = await Order.create(req.body);
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE order status
router.put('/:id/status', authMiddleware, async (req, res) => {
  const { status } = req.body;
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
