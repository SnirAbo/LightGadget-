const productRepo = require('../repositories/productRepo');

const getAllProducts = () => productRepo.getAllProducts();
const getById = (id) => productRepo.getById(id);
const addProduct = (obj) => productRepo.addProduct(obj);
const updateProduct = (id, obj) => productRepo.updateProduct(id, obj);
const deleteProduct = (id) => productRepo.deleteProduct(id);

module.exports = { getAllProducts, getById, addProduct, updateProduct, deleteProduct };
