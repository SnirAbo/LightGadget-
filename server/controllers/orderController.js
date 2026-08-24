const express = require('express');
const crypto = require('crypto');
const orderService = require('../services/orderService');
const authMiddleware = require('../middleware/authMiddleware');
const optionalAuth = require('../middleware/optionalAuth');

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

router.post('/', optionalAuth, async (req, res) => {
  try {
    if (req.user) {
      // Registered user — user id comes from the token, never the body
      const result = await orderService.addOrder({ ...req.body, user: req.user.id });
      res.status(201).json(result);
    } else {
      // Guest — generate a one-time secret to authorize the payment step
      const guestToken = crypto.randomUUID();
      const { guestName, guestEmail, ...rest } = req.body;
      const result = await orderService.addOrder({ ...rest, guestToken, guestName, guestEmail });
      // guestToken is present on the saved doc and returned here (select:false only hides it from queries)
      res.status(201).json(result);
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
});

router.get('/:id', authMiddleware, async (req, res) => {
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
