const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  city: { type: String, default: '' },
  street: { type: String, default: '' },
  house: { type: String, default: '' },
  isDefault: { type: Boolean, default: false },
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, default: '' },
  avatar: { type: String, default: '' },
  address: { type: addressSchema, default: () => ({}) },
  language: { type: String, default: 'uk' },
  token: { type: String },
  resetToken: { type: String },
  resetPasswordExpires: { type: Date },
});

module.exports = mongoose.model('User', userSchema);