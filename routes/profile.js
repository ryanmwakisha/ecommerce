// routes/profile.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authenticateToken = require('../middleware/authenticateToken');

router.get('/', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    res.json(user.profile);
  } catch (error) {
    res.status(500).send('Error fetching profile');
  }
});

router.put('/', authenticateToken, async (req, res) => {
  try {
    const { firstName, lastName, address, phoneNumber } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { profile: { firstName, lastName, address, phoneNumber } },
      { new: true }
    );
    res.json(user.profile);
  } catch (error) {
    res.status(500).send('Error updating profile');
  }
});

module.exports = router;
