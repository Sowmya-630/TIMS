const express = require('express');
const mongoose = require('mongoose');
const Product = require('../models/products');
const router = express.Router();

// Add new product
router.post('/', async (req, res) => {
    const { name, category, description, stockLevel, reorderPoint, price, supplierId } = req.body;

    try {
        let existingProduct = await Product.findOne({ name });
        if (existingProduct) {
            return res.status(400).json({ message: "Product with this name already exists" });
        }

        const newProduct = new Product({
            name,
            category,
            description,
            stockLevel,
            reorderPoint,
            price,
            supplierId
        });

        await newProduct.save();
        res.status(201).json({ message: "Product added successfully", product: newProduct });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

// Edit a product
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, category, description, stockLevel, reorderPoint, price, supplierId } = req.body;

    try {
        const updatedProduct = await Product.findByIdAndUpdate(id, {
            name,
            category,
            description,
            stockLevel,
            reorderPoint,
            price,
            supplierId
        }, { new: true });

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

// Delete a product
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        con
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

// Get list of products with optional search by category or name
router.get('/', async (req, res) => {
    const { search } = req.query;

    try {
        let query = {};
        if (search) {
            query = {
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { category: { $regex: search, $options: 'i' } }
                ]
            };
        }

        const products = await Product.find(query).sort({ name: 1 });
        res.status(200).json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

// Stock in/out transaction
router.post('/stock/:id', async (req, res) => {
    const { id } = req.params;
    const { type, quantity } = req.body; // type: 'in' or 'out'

    try {
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        if (type === 'in') {
            product.stockLevel += quantity;
        } else if (type === 'out') {
            if (product.stockLevel < quantity) {
                return res.status(400).json({ message: "Not enough stock available" });
            }
            product.stockLevel -= quantity;
        } else {
            return res.status(400).json({ message: "Invalid transaction type" });
        }

        await product.save();
        res.status(200).json({ message: "Stock updated successfully", product });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
