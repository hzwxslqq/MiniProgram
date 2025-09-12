const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import MySQL database utilities
const { initDB } = require('./utils/mysql');

// Initialize MySQL database
initDB();

// Import MySQL routes
const authRoutes = require('./routes/mysql/auth');
const productRoutes = require('./routes/mysql/products');
const cartRoutes = require('./routes/mysql/cart');
const orderRoutes = require('./routes/mysql/orders');

// Initialize app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Online Store API (MySQL Version)', 
    version: '1.0.0' 
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    message: 'Endpoint not found' 
  });
});

// Start server
app.listen(PORT, async () => {
  console.log(`MySQL Server is running on port ${PORT}`);
  
  // Seed data
  const Product = require('./models/mysql/Product');
  await Product.seedData();
});

module.exports = app;