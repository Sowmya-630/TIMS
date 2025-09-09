const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  supplierId: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  status: { type: String, enum: ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Overdue'], default: 'Pending' },
  orderDate: { type: Date, required: true },
  expectedDate: { type: Date, required: true },
  deliveredDate: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
