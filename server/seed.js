const mongoose = require('mongoose');
const Product = require('./models/Product');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const seedProducts = async () => {
  try {
    const data = JSON.parse(fs.readFileSync('../client/products.json', 'utf-8'));
    const products = data.items.map(item => ({
      title: item.fields.title,
      price: item.fields.price,
      category: item.fields.category,
      description: item.fields.description,
      image: item.fields.image.fields.file.url
    }));
    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log('Products seeded successfully');
    process.exit();
  } catch (err) {
    console.error('Error seeding products:', err);
    process.exit(1);
  }
};

seedProducts();