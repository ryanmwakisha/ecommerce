// routes/products.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const Product = require('../models/Product');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
const authorizeRole = require('../middleware/authorizeRole');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

router.get('/', async (req, res) => {
  try {
    const { search, category } = req.query;
    let query = {};
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    if (category) {
      query.category = category;
    }
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).send('Error fetching products');
  }
});

router.post('/', authenticateToken, authorizeRole(['trader']), upload.single('image'), async (req, res) => {
  try {
    const { name, description, price } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;
    const product = new Product({ name, description, price: parseFloat(price), image });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).send('Error creating product');
  }
});

router.put('/:id', authenticateToken, authorizeRole(['trader']), upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;
    const product = await Product.findByIdAndUpdate(id, 
      { name, description, price: parseFloat(price), image },
      { new: true }
    );
    if (product) {
      res.json(product);
    } else {
      res.status(404).send('Product not found');
    }
  } catch (error) {
    res.status(500).send('Error updating product');
  }
});

router.delete('/:id', authenticateToken, authorizeRole(['trader']), async (req, res) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).send('Error deleting product');
  }
});

module.exports = router;
