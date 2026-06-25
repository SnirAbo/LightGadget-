const categoryRepo = require('../repositories/categoryRepo');

const getAllCategories = () => categoryRepo.getAllCategories();
const getById = (id) => categoryRepo.getById(id);
const addCategory = (obj) => categoryRepo.addCategory(obj);
const updateCategory = (id, obj) => categoryRepo.updateCategory(id, obj);
const deleteCategory = (id) => categoryRepo.deleteCategory(id);

module.exports = { getAllCategories, getById, addCategory, updateCategory, deleteCategory };
