const userRepo = require('../repositories/userRepo');

const getAllUser = () => userRepo.getAllUsers();
const getById = (id) => userRepo.getById(id);
const addUser = (obj) => userRepo.addUser(obj);
const updateUser = (id, obj) => userRepo.updateUser(id, obj);
const deleteUser = (id) => userRepo.deleteUser(id);

module.exports = { getAllUser, getById, addUser, updateUser, deleteUser };
