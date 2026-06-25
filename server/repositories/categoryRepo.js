const Category = require('../models/categoryModel');

const getAllCategories = () => Category.find();
const getById = (id) => Category.findById(id);
const addCategory = (obj) => new Category(obj).save();
const updateCategory = (id, obj) => Category.findByIdAndUpdate(id, { $set: obj }, { new: true });
const deleteCategory = (id) => Category.findByIdAndDelete(id);

module.exports = { getAllCategories, getById, addCategory, updateCategory, deleteCategory };
