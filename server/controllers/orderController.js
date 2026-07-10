const express = require('express');
const orderService = require('../services/orderService');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(401).json({ message: 'Admin only' });
  next();
};

router.get('/my', authMiddleware, async (req, res) => {
  try {
    const orders = await orderService.getByUser(req.user.id);
    res.json(orders);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

router.get('/', authMiddleware, adminOnly, async (req, res) => {
  try {
    const orders = await orderService.getAllOrders();
    res.json(orders);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const result = await orderService.addOrder(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const order = await orderService.getById(req.params.id);
    res.json(order);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

router.put('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const result = await orderService.updateOrder(req.params.id, req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

router.delete('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const result = await orderService.deleteOrder(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

module.exports = router;
