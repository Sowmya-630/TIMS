const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  productId: { type: String, ref: 'Product', required: true },
  type: { type: String, enum: ['Stock In', 'Stock Out'], required: true },
  quantity: { type: Number, required: true },
  reason: { type: String },
  userId: { type: String, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
