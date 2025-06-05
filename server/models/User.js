const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  language: { type: String, default: 'uk' },
  avatar: { type: String },
  token: { type: String }, // Для JWT
  resetToken: { type: String }, // Для скидання пароля
  resetPasswordExpires: { type: Date } // Термін дії токена скидання
});

const User = mongoose.model('User', userSchema);

module.exports = User;