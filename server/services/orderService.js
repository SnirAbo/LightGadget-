const orderRepo = require('../repositories/orderRepo');

const getAllOrders = () => orderRepo.getAllOrders();
const getById = (id) => orderRepo.getById(id);
const getByUser = (user) => orderRepo.getByUser(user);
const addOrder = (obj) => orderRepo.addOrder(obj);
const updateOrder = (id, obj) => orderRepo.updateOrder(id, obj);
const deleteOrder = (id) => orderRepo.deleteOrder(id);

module.exports = { getAllOrders, getById, getByUser, addOrder, updateOrder, deleteOrder };
