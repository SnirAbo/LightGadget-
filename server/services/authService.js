const userRepo = require('../repositories/userRepo');

const login = (email) => userRepo.findByEmail(email);
const register = (obj) => userRepo.addUser(obj);

module.exports = { login, register };
