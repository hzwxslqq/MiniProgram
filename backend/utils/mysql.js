// MySQL database connection and utilities
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || 'password',
  database: process.env.MYSQL_DATABASE || 'online_store',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Initialize database tables
const initDB = async () => {
  try {
    // Create users table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        phone VARCHAR(20),
        avatar VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    
    // Create products table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        original_price DECIMAL(10, 2) DEFAULT NULL,
        image VARCHAR(255),
        images JSON,
        category_id VARCHAR(50) NOT NULL,
        category_name VARCHAR(100) NOT NULL,
        stock INT DEFAULT 0,
        rating DECIMAL(3, 2) DEFAULT 0,
        review_count INT DEFAULT 0,
        tags JSON,
        is_featured BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    
    // Create cart_items table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS cart_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        product_id INT NOT NULL,
        product_name VARCHAR(255) NOT NULL,
        product_image VARCHAR(255),
        price DECIMAL(10, 2) NOT NULL,
        quantity INT DEFAULT 1,
        selected BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        UNIQUE KEY unique_user_product (user_id, product_id)
      )
    `);
    
    // Create orders table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        order_number VARCHAR(50) UNIQUE NOT NULL,
        items JSON NOT NULL,
        subtotal DECIMAL(10, 2) NOT NULL,
        shipping_fee DECIMAL(10, 2) DEFAULT 0,
        total_amount DECIMAL(10, 2) NOT NULL,
        status ENUM('pending', 'paid', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
        shipping_address JSON NOT NULL,
        payment_method VARCHAR(50) DEFAULT 'wechat_pay',
        payment_id VARCHAR(100),
        tracking_number VARCHAR(100),
        estimated_delivery DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    
    console.log('Database tables initialized successfully');
    
    // Insert sample data if tables are empty
    await seedData();
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

// Seed database with sample data
const seedData = async () => {
  try {
    // Check if users table is empty
    const [userRows] = await pool.execute('SELECT COUNT(*) as count FROM users');
    if (userRows[0].count === 0) {
      // Insert admin user
      await pool.execute(
        'INSERT INTO users (username, password, email, phone) VALUES (?, ?, ?, ?)',
        ['admin', '$2a$10$8K1p/a0dhrxiowP.dnkgNORTWgdEDHn5L2/xjpEWuC.QQv4rKO9jO', 'admin@example.com', '1234567890']
      );
      console.log('Admin user created');
    }
    
    // Check if products table is empty
    const [productRows] = await pool.execute('SELECT COUNT(*) as count FROM products');
    if (productRows[0].count === 0) {
      // Insert sample products
      const products = [
        ['Wireless Headphones', 'High-quality wireless headphones with noise cancellation', 129.99, 159.99, '/images/product1.png', JSON.stringify(['/images/product1.png']), '1', 'Electronics', 50, 4.5, 128, JSON.stringify(['electronics', 'audio', 'wireless']), true],
        ['Smart Watch', 'Feature-rich smartwatch with health monitoring', 199.99, 249.99, '/images/product2.png', JSON.stringify(['/images/product2.png']), '1', 'Electronics', 30, 4.8, 97, JSON.stringify(['electronics', 'wearable', 'health']), true],
        ['Bluetooth Speaker', 'Portable Bluetooth speaker with excellent sound quality', 79.99, 99.99, '/images/product3.png', JSON.stringify(['/images/product3.png']), '1', 'Electronics', 100, 4.3, 64, JSON.stringify(['electronics', 'audio', 'portable']), false],
        ['Phone Case', 'Durable phone case with stylish design', 24.99, 34.99, '/images/product4.png', JSON.stringify(['/images/product4.png']), '2', 'Accessories', 200, 4.1, 210, JSON.stringify(['accessories', 'phone', 'protection']), false],
        ['Laptop Backpack', 'Spacious backpack with laptop compartment', 59.99, 79.99, '/images/product5.png', JSON.stringify(['/images/product5.png']), '3', 'Bags', 75, 4.6, 85, JSON.stringify(['bags', 'laptop', 'travel']), true],
        ['Water Bottle', 'Insulated water bottle that keeps drinks cold for 24 hours', 19.99, 29.99, '/images/product6.png', JSON.stringify(['/images/product6.png']), '4', 'Home', 150, 4.2, 142, JSON.stringify(['home', 'kitchen', 'hydration']), false]
      ];
      
      for (const product of products) {
        await pool.execute(
          'INSERT INTO products (name, description, price, original_price, image, images, category_id, category_name, stock, rating, review_count, tags, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          product
        );
      }
      console.log('Sample products created');
    }
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

// Export pool and init function
module.exports = {
  pool,
  initDB
};