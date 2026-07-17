const express = require('express');
const productService = require('../services/productService');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  next();
};

// Public — customers need to browse
router.get('/', async (req, res) => {
  try {
    const products = await productService.getAllProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await productService.getById(req.params.id);
    res.json(product);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

// Admin only
router.post('/', authMiddleware, adminOnly, async (req, res) => {
  try {
    const result = await productService.addProduct(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

router.put('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const result = await productService.updateProduct(req.params.id, req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

router.delete('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const result = await productService.deleteProduct(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

module.exports = router;
