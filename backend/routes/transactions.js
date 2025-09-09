const express = require('express');
const Transaction = require('../models/Transaction');
const Product = require('../models/products');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// GET all transactions
router.get('/', authMiddleware, async (req, res) => {
  try {
    const transactions = await Transaction.find().populate('productId userId');
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE transaction
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { productId, type, quantity, reason } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (type === 'Stock In') product.stockLevel += quantity;
    else product.stockLevel -= quantity;

    await product.save();

    const transaction = await Transaction.create({
      ...req.body,
      userId: req.user.id
    });

    res.status(201).json(transaction);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
