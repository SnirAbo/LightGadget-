const userRepo = require('../repositories/userRepo');

const login = (userName) => userRepo.findByUserName(userName);
const register = (obj) => userRepo.addUser(obj);

module.exports = { login, register };
