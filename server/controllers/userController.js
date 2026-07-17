const express = require('express');
const userService = require('../services/userService');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  next();
};

// String() on both sides: JWT serialises ObjectId to string, but explicit coercion avoids
// a silent === false if the serialisation ever changes.
const selfOrAdmin = (req, res, next) => {
  if (req.user.role === 'admin' || String(req.user.id) === String(req.params.id)) return next();
  return res.status(403).json({ message: 'Forbidden' });
};

// Admin only — list of all users for admin panel
router.get('/', authMiddleware, adminOnly, async (req, res) => {
  try {
    const users = await userService.getAllUser();
    res.json(users);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

// Public — this is registration
router.post('/', async (req, res) => {
  try {
    const result = await userService.addUser(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

// Self or admin
router.get('/:id', authMiddleware, selfOrAdmin, async (req, res) => {
  try {
    const user = await userService.getById(req.params.id);
    res.json(user);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

router.put('/:id', authMiddleware, selfOrAdmin, async (req, res) => {
  try {
    const result = await userService.updateUser(req.params.id, req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

// Admin only
router.delete('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const result = await userService.deleteUser(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

module.exports = router;
