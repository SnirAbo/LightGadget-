const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    quantity: { type: Number, default: 0 },
    category: { type: String, default: '' },
    description: { type: String, default: '' },
    price: { type: Number, default: 0 },
    pic: { type: String, default: '' },
  },
  { versionKey: false }
);

const Product = mongoose.model('Product', productSchema, 'products');

module.exports = Product;
