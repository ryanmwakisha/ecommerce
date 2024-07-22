// controllers/productController.js
const { Product, Category, User } = require('../models');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

exports.upload = upload.single('image');

exports.createProduct = async (req, res) => {
  try {
    if (req.user.userType !== 'manufacturer') {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    const { name, description, price, categoryId } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    const product = await Product.create({ name, description, price, categoryId, userId: req.user.id, imageUrl });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.findAll({ include: [Category, User] });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, categoryId } = req.body;

    // Build product object
    const productFields = {};
    if (name) productFields.name = name;
    if (description) productFields.description = description;
    if (price) productFields.price = price;
    if (categoryId) productFields.categoryId = categoryId;

    // If there's a new image uploaded
    if (req.file) {
      productFields.imageUrl = `/uploads/${req.file.filename}`;
    }

    let product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    // Ensure the user is authorized to update the product
    if (product.userId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Update product
    await product.update(productFields);

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

