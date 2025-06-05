const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  items: [{
    name: String,
    price: Number
  }],
  total: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);