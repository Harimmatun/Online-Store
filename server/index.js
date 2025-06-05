const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');

// Завантаження .env перед імпортом маршрутів
dotenv.config();

// Дебаг-логування змінних із .env
console.log('Loaded environment variables:');
console.log('PORT:', process.env.PORT);
console.log('MONGO_URI:', process.env.MONGO_URI);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('EMAIL_HOST:', process.env.EMAIL_HOST);
console.log('EMAIL_PORT:', process.env.EMAIL_PORT);

// Перевірка nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

transporter.verify((error, success) => {
  if (error) {
    console.error('Mailtrap configuration error:', error);
  } else {
    console.log('Mailtrap is ready to send emails');
  }
});

// Імпорт маршрутів після завантаження .env
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Handle root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Online Store API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(`Error: ${err.message}`);
  res.status(500).json({ message: 'Server error', error: err.message });
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('MongoDB connected successfully');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

// Start server only if not in test environment
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Test API: http://localhost:${PORT}/api/products`);
  });
}

module.exports = app;