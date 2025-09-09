const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    category: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    stockLevel: {
        type: Number,
        required: true
    },
    reorderPoint: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    supplierId: {
        type: String,
        ref: 'Supplier',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
