const express = require('express');
const router = express.Router();
const fs = require('fs');

const productsData = JSON.parse(fs.readFileSync('C:/Users/Dmytro Krasulia/desktop/course/client/products.json', 'utf8'));
const products = productsData.items;

router.get('/', (req, res) => {
  res.json(products.map(item => ({
    id: item.sys.id,
    title: item.fields.title,
    price: item.fields.price,
    category: item.fields.category,
    description: item.fields.description,
    image: item.fields.image.fields.file.url
  })));
});

router.get('/:id', (req, res) => {
  const product = products.find(item => item.sys.id === req.params.id);
  if (product) {
    res.json({
      id: product.sys.id,
      title: product.fields.title,
      price: product.fields.price,
      category: product.fields.category,
      description: product.fields.description,
      image: product.fields.image.fields.file.url
    });
  } else {
    res.status(404).json({ error: 'Продукт не знайдено' });
  }
});

module.exports = router;