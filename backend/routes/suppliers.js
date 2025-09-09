const express = require('express');
const Supplier = require('../models/Supplier');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// GET all suppliers
router.get('/', async (req, res) => {
  try {
    const suppliers = await Supplier.find().populate('orderHistory');
    res.json(suppliers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE supplier
router.post('/',  async (req, res) => {
  try {
    const newSupplier = await Supplier.create(req.body);
    res.status(201).json(newSupplier);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE supplier
router.put('/:id',  async (req, res) => {
  try {
    const updatedSupplier = await Supplier.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedSupplier);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE supplier
router.delete('/:id', async (req, res) => {
  try {
    await Supplier.findByIdAndDelete(req.params.id);
    res.json({ message: 'Supplier deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
