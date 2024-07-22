// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['user', 'trader', 'admin'], default: 'user' },
  profile: {
    firstName: String,
    lastName: String,
    address: String,
    phoneNumber: String
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
