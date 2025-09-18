const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

// Import database configuration
const { DB_TYPE } = require('./config/dbConfig');

// Import database utilities based on configuration
let db, User, Product, CartItem, Order, UserAddress;
if (DB_TYPE === 'mysql') {
  db = require('./utils/mysql');
  User = require('./models/mysql/User');
  Product = require('./models/mysql/Product');
  CartItem = require('./models/mysql/CartItem');
  Order = require('./models/mysql/Order');
  UserAddress = require('./models/mysql/UserAddress');
} else {
  db = require('./utils/db');
  User = require('./models/User');
  Product = require('./models/Product');
  CartItem = require('./models/CartItem');
  Order = require('./models/Order');
  UserAddress = require('./models/UserAddress');
}

// Initialize database
db.initDB();

// Make models available globally for controllers
global.User = User;
global.Product = Product;
global.CartItem = CartItem;
global.Order = Order;
global.UserAddress = UserAddress;

// Import routes based on database configuration
let authRoutes, productRoutes, cartRoutes, orderRoutes, addressRoutes;
if (DB_TYPE === 'mysql') {
  authRoutes = require('./routes/mysql/auth');
  productRoutes = require('./routes/mysql/products');
  cartRoutes = require('./routes/mysql/cart');
  orderRoutes = require('./routes/mysql/orders');
  addressRoutes = require('./routes/mysql/address');
} else {
  authRoutes = require('./routes/auth');
  productRoutes = require('./routes/products');
  cartRoutes = require('./routes/cart');
  orderRoutes = require('./routes/orders');
  addressRoutes = require('./routes/address');
}

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
app.use('/api/user/addresses', addressRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: `Online Store API (${DB_TYPE} version)`, 
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
  console.log(`Server is running on port ${PORT} using ${DB_TYPE} database`);
  
  // Seed data
  if (DB_TYPE === 'mysql') {
    await Product.seedData();
  } else {
    await Product.seedData();
  }
});

module.exports = app;