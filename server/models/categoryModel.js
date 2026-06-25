const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    status: { type: String, default: 'NEW' },
  },
  { versionKey: false }
);

const Category = mongoose.model('Category', categorySchema, 'categories');

module.exports = Category;
