const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    user : { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true, min: 1 },
        title: { type: String, required: true },
        price: { type: Number, required: true, min: 0 },
      }
    ],
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    shippingCost: { type: Number, required: true, min: 0 },
    totalPrice: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ['pending', 'shipped', 'delivered'], default: 'pending' },
    phoneNumber: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

const Order = mongoose.model('Order', orderSchema, 'orders');

module.exports = Order;
