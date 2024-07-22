// routes/orders.js
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const authenticateToken = require('../middleware/authenticateToken');
const authorizeRole = require('../middleware/authorizeRole');

// Create a new order
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { products, totalAmount, shippingAddress, paymentInfo } = req.body;
    const order = new Order({
      user: req.user.userId,
      products,
      totalAmount,
      shippingAddress,
      paymentInfo
    });
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(500).send('Error creating order');
  }
});

// Get user's orders
router.get('/my-orders', authenticateToken, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.userId }).populate('products.product');
    res.json(orders);
  } catch (error) {
    res.status(500).send('Error fetching orders');
  }
});

// Get all orders (admin only)
router.get('/', authenticateToken, authorizeRole(['admin']), async (req, res) => {
  try {
    const orders = await Order.find().populate('user').populate('products.product');
    res.json(orders);
  } catch (error) {
    res.status(500).send('Error fetching orders');
  }
});

// Update order status (admin only)
router.put('/:id', authenticateToken, authorizeRole(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
    if (order) {
      res.json(order);
    } else {
      res.status(404).send('Order not found');
    }
  } catch (error) {
    res.status(500).send('Error updating order');
  }
});

module.exports = router;
