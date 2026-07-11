const Product = require('../models/productModel');

const getAllProducts = () => Product.find();
const getById = (id) => Product.findById(id);
const addProduct = (obj) => new Product(obj).save();
const updateProduct = (id, obj) => Product.findByIdAndUpdate(id, { $set: obj }, { new: true });
const deleteProduct = (id) => Product.findByIdAndDelete(id);

module.exports = { getAllProducts, getById, addProduct, updateProduct, deleteProduct };
