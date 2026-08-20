const express = require('express');
const paymentService = require('../services/paymentService');
const orderRepo = require('../repositories/orderRepo');
const Product = require('../models/productModel');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/create/:orderId', authMiddleware, async (req, res) => {
  try {
    const order = await orderRepo.getById(req.params.orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const isOwner = String(order.user) === String(req.user.id);
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const customer = {
      fullName: req.body.fullName,
      phone: req.body.phone,
      email: req.body.email,
    };

    const { url, paymentId } = await paymentService.createPaymentPage(order, customer);
    await orderRepo.updateOrder(order._id, { paymentId });

    res.json({ url });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/webhook', async (req, res) => {
  try {
    const raw = req.body.Data;
    const data = typeof raw === 'string' ? JSON.parse(raw) : raw;
    
    const orderId = data.OrderIdClientUsage;
    const success = String(data.Success) === 'True';

    if (orderId && success) {
      const order = await orderRepo.getById(orderId);
      if (order && order.paymentStatus !== 'paid') {
        await orderRepo.updateOrder(order._id, {
          paymentStatus: 'paid',
          transactionId: data.PaymentId,
          paidAt: new Date(),
        });
        try {
          await Product.bulkWrite(
            order.items.map((item) => ({
              updateOne: {
                filter: { _id: item.product },
                update: { $inc: { quantity: -item.quantity } },
              },
            }))
          );
        } catch (stockErr) {
          console.error('Stock decrement failed:', order._id, stockErr.message);
        }
      }
    }
    res.sendStatus(200);
  } catch (error) {
    console.error('Webhook error:', error.message);
    res.sendStatus(200);
  }
});

module.exports = router;