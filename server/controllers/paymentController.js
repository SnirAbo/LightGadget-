// server/controllers/paymentController.js
const express = require('express');
const paymentService = require('../services/paymentService');
const orderRepo = require('../repositories/orderRepo');
const Product = require('../models/productModel');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();


router.post('/create/:orderId', authMiddleware, async (req, res) => {
  try {
    const order = await orderRepo.getById(req.params.orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

   
    const isOwner = String(order.user) === String(req.user.id);
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }


    const { url, lowProfileId } = await paymentService.createPaymentPage(order);


    await orderRepo.updateOrder(order._id, { lowProfileId });

    res.json({ url });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/webhook', async (req, res) => {
  try {
    console.log('WEBHOOK HIT');             
    console.log('body:', req.body);  

    const { LowProfileId, ReturnValue } = req.body;
    console.log('LowProfileId:', LowProfileId, 'ReturnValue:', ReturnValue);

    const result = await paymentService.verifyPayment(LowProfileId);

    if (result.ResponseCode === 0) {
      const order = await orderRepo.getById(ReturnValue);
      console.log('order found:', order ? order._id : 'NULL', 'status:', order?.paymentStatus);  // 5
 

      if (order && order.paymentStatus !== 'paid') {
        await orderRepo.updateOrder(order._id, {
          paymentStatus: 'paid',
          transactionId: result.TranzactionId,
          paidAt: new Date(),
        });
        console.log('UPDATED TO PAID');

        // Decrement stock — runs only on the first 'paid' transition (idempotency guard above).
        // Negative stock is allowed; it signals an oversell for manual review.
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
          // Payment already confirmed — log but do not re-throw.
          console.error('Stock decrement failed for order', order._id, stockErr.message);
        }
      }
    }

    res.sendStatus(200);   
  } catch (error) {
    console.error('Webhook error:', error.message);
    res.sendStatus(200);   // גם על שגיאה
  }
});

module.exports = router;