const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  description: { type: String },
  image: { type: String, default: 'https://via.placeholder.com/150' }
});

module.exports = mongoose.model('Product', productSchema);