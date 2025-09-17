# MySQL Setup Guide

## Overview

This guide explains how to set up and use MySQL database for the Online Store application. The application supports both file-based and MySQL databases, with MySQL being the recommended option for production use.

## Prerequisites

1. Install MySQL server (version 5.7 or higher)
2. Create a MySQL database named `online_store`
3. Have the MySQL server running

## Setup Instructions

### 1. Configure Environment Variables

Update the `.env` file in the `backend` directory with your MySQL configuration:

```env
DB_TYPE=mysql
MYSQL_HOST=localhost
MYSQL_USER=your_mysql_username
MYSQL_PASSWORD=your_mysql_password
MYSQL_DATABASE=online_store
```

### 2. Initialize Database

Run the following command to create tables and seed initial data:

```bash
cd backend
npm run init-mysql-db
```

### 3. Migrate Existing Data (Optional)

If you have existing data in the file-based database that you want to migrate to MySQL:

```bash
cd backend
npm run migrate-data
```

### 4. Start Server

Start the server with MySQL database:

```bash
cd backend
npm run start-mysql
```

Or you can use the shortcut script:

```bash
cd backend
npm start
```

(Note: This will use the database type specified in the `.env` file)

## Database Schema

The MySQL implementation includes four main tables with appropriate relationships:

### Users Table
```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  avatar VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Products Table
```sql
CREATE TABLE products (
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
);
```

### Cart Items Table
```sql
CREATE TABLE cart_items (
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
);
```

### Orders Table
```sql
CREATE TABLE orders (
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
);
```

## Switching Between Database Implementations

To switch between database implementations:

1. Update the `DB_TYPE` environment variable in `.env`:
   - `DB_TYPE=file` for file-based database
   - `DB_TYPE=mysql` for MySQL database

2. Restart the server

## Troubleshooting

### Common Issues

1. **Connection refused**: Make sure MySQL server is running
2. **Access denied**: Check your MySQL username and password
3. **Database doesn't exist**: Create the `online_store` database in MySQL
4. **Table already exists**: The database has already been initialized

### Debugging Tips

1. Check the MySQL error logs for connection issues
2. Verify that the MySQL user has the necessary permissions
3. Use a MySQL client to connect to the database and check table structures