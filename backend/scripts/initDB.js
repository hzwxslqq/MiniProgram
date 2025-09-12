const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load environment variables
dotenv.config();

// Import models
const User = require('../models/User');
const Product = require('../models/Product');

// Connect to database
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const initDB = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    
    // Create admin user
    const adminUser = new User({
      username: 'admin',
      password: 'admin123',
      email: 'admin@example.com',
      phone: '1234567890'
    });
    
    await adminUser.save();
    console.log('Admin user created');
    
    // Create sample products
    const products = [
      {
        name: 'Wireless Headphones',
        description: 'High-quality wireless headphones with noise cancellation',
        price: 129.99,
        originalPrice: 159.99,
        image: '/images/product1.png',
        images: ['/images/product1.png'],
        categoryId: '1',
        categoryName: 'Electronics',
        stock: 50,
        rating: 4.5,
        reviewCount: 128,
        tags: ['electronics', 'audio', 'wireless'],
        isFeatured: true
      },
      {
        name: 'Smart Watch',
        description: 'Feature-rich smartwatch with health monitoring',
        price: 199.99,
        originalPrice: 249.99,
        image: '/images/product2.png',
        images: ['/images/product2.png'],
        categoryId: '1',
        categoryName: 'Electronics',
        stock: 30,
        rating: 4.8,
        reviewCount: 97,
        tags: ['electronics', 'wearable', 'health'],
        isFeatured: true
      },
      {
        name: 'Bluetooth Speaker',
        description: 'Portable Bluetooth speaker with excellent sound quality',
        price: 79.99,
        originalPrice: 99.99,
        image: '/images/product3.png',
        images: ['/images/product3.png'],
        categoryId: '1',
        categoryName: 'Electronics',
        stock: 100,
        rating: 4.3,
        reviewCount: 64,
        tags: ['electronics', 'audio', 'portable'],
        isFeatured: false
      },
      {
        name: 'Phone Case',
        description: 'Durable phone case with stylish design',
        price: 24.99,
        originalPrice: 34.99,
        image: '/images/product4.png',
        images: ['/images/product4.png'],
        categoryId: '2',
        categoryName: 'Accessories',
        stock: 200,
        rating: 4.1,
        reviewCount: 210,
        tags: ['accessories', 'phone', 'protection'],
        isFeatured: false
      },
      {
        name: 'Laptop Backpack',
        description: 'Spacious backpack with laptop compartment',
        price: 59.99,
        originalPrice: 79.99,
        image: '/images/product5.png',
        images: ['/images/product5.png'],
        categoryId: '3',
        categoryName: 'Bags',
        stock: 75,
        rating: 4.6,
        reviewCount: 85,
        tags: ['bags', 'laptop', 'travel'],
        isFeatured: true
      },
      {
        name: 'Water Bottle',
        description: 'Insulated water bottle that keeps drinks cold for 24 hours',
        price: 19.99,
        originalPrice: 29.99,
        image: '/images/product6.png',
        images: ['/images/product6.png'],
        categoryId: '4',
        categoryName: 'Home',
        stock: 150,
        rating: 4.2,
        reviewCount: 142,
        tags: ['home', 'kitchen', 'hydration'],
        isFeatured: false
      }
    ];
    
    await Product.insertMany(products);
    console.log('Sample products created');
    
    console.log('Database initialized successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
};

initDB();