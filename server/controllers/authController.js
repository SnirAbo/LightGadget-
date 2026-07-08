const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Auth = require('../services/authService');
require('dotenv').config();

const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET;

// POST /auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await Auth.login(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, SECRET_KEY, { expiresIn: '24h' });

    const { password: _pw, ...userWithoutPassword } = user.toObject();
    res.json({ token, user: userWithoutPassword });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /auth/register
router.post('/register', async (req, res) => {
  try {
    const obj = { ...req.body };
    obj.password = await bcrypt.hash(obj.password, 10);
    const result = await Auth.register(obj);
    const { password: _pw, ...userWithoutPassword } = result.toObject();
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
