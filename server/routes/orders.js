const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Order = require('../models/Order');

// Middleware для перевірки JWT
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Create order
router.post('/', authMiddleware, async (req, res) => {
  const { user, address, phone, items, total } = req.body;
  try {
    const order = new Order({ user, address, phone, items, total });
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: 'Error creating order', error: err.message });
  }
});

// Get user orders
router.get('/:user', authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ user: decodeURIComponent(req.params.user) });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching orders', error: err.message });
  }
});

module.exports = router;