const User = require('../models/userModel');

const getAllUsers = () => User.find();
const getById = (id) => User.findById(id);
const findByEmail = (email) => User.findOne({ email });
const addUser = (obj) => new User(obj).save();
const updateUser = (id, obj) => User.findByIdAndUpdate(id, obj, { new: true });
const deleteUser = (id) => User.findByIdAndDelete(id);

module.exports = { getAllUsers, getById, findByEmail, addUser, updateUser, deleteUser };
