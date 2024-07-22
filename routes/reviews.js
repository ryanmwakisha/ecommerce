const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const authenticateToken = require('../middleware/authenticateToken');

router.post('/', authenticateToken, async (req, res) => {
  try {
    const { product, rating, comment } = req.body;
    const review = new Review({
      user: req.user.userId,
      product,
      rating,
      comment
    });
    await review.save();
    res.status(201).json(review);
  } catch (error) {
    res.status(500).send('Error creating review');
  }
});

router.get('/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId }).populate('user');
    res.json(reviews);
  } catch (error) {
    res.status(500).send('Error fetching reviews');
  }
});

module.exports = router;
