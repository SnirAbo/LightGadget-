const mongoose = require('mongoose');

const boughtBySchema = new mongoose.Schema(
  {
    name: String,
    date: { seconds: Number, nanoseconds: Number },
    quantity: Number,
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    quantity: { type: Number, default: 0 },
    category: { type: String, default: '' },
    description: { type: String, default: '' },
    price: { type: Number, default: 0 },
    pic: { type: String, default: '' },
    boughtBy: { type: [boughtBySchema], default: [] },
  },
  { versionKey: false }
);

const Product = mongoose.model('Product', productSchema, 'products');

module.exports = Product;
