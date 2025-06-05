const mongoose = require('mongoose');

// Підключення до MongoDB
mongoose.connect('mongodb://localhost:27017/online-store', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Експорт моделі
module.exports = mongoose;