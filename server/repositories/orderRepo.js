const Order = require('../models/orderModel');

const getAllOrders = () => Order.find();
const getById = (id) => Order.findById(id);
const getByUser = (user) => Order.find({ user });
const addOrder = (obj) => new Order(obj).save();
const updateOrder = (id, obj) => Order.findByIdAndUpdate(id, { $set: obj }, { new: true });
const deleteOrder = (id) => Order.findByIdAndDelete(id);

module.exports = { getAllOrders, getById, getByUser, addOrder, updateOrder, deleteOrder };
