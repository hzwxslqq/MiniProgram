const fs = require('fs');
const path = require('path');
const { pool } = require('./utils/mysql');
const bcrypt = require('bcryptjs');

// Load data from file-based database
const dbPath = path.join(__dirname, 'data', 'db.json');
const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// Helper function to convert date strings to MySQL format
function convertToMySQLDate(dateString) {
  if (!dateString) return null;
  // Convert ISO string to MySQL datetime format
  return dateString.replace('T', ' ').replace('Z', '');
}

// Helper function to handle ID conversion
function convertId(id) {
  // If ID is a string that can be converted to a number and fits in INT range, convert it
  if (typeof id === 'string' && /^\d+$/.test(id) && parseInt(id) <= 2147483647) {
    return parseInt(id);
  }
  // If ID is already a number and fits in INT range, return it
  if (typeof id === 'number' && id <= 2147483647) {
    return id;
  }
  // For IDs that don't fit, we'll need to generate new ones or skip
  return null;
}

async function migrateData() {
  try {
    console.log('Starting data migration from file-based to MySQL database...');
    
    // Migrate users
    console.log('Migrating users...');
    for (const user of dbData.users) {
      try {
        // Convert ID
        const userId = convertId(user.id);
        if (!userId) {
          console.log(`  - Skipping user ${user.username} with invalid ID: ${user.id}`);
          continue;
        }
        
        // Check if user already exists
        const [existingUsers] = await pool.execute(
          'SELECT id FROM users WHERE username = ?',
          [user.username]
        );
        
        if (existingUsers.length === 0) {
          // Insert user
          await pool.execute(
            'INSERT INTO users (id, username, password, email, phone, avatar, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [
              userId,
              user.username,
              user.password, // Note: Passwords are already hashed in the file-based database
              user.email || '',
              user.phone || '',
              user.avatar || '',
              convertToMySQLDate(user.createdAt),
              convertToMySQLDate(user.updatedAt)
            ]
          );
          console.log(`  - Migrated user: ${user.username}`);
        } else {
          console.log(`  - User already exists: ${user.username}`);
        }
      } catch (error) {
        console.error(`  - Error migrating user ${user.username}:`, error.message);
      }
    }
    
    // Migrate products
    console.log('Migrating products...');
    for (const product of dbData.products) {
      try {
        // Convert ID
        const productId = convertId(product.id);
        if (!productId) {
          console.log(`  - Skipping product ${product.name} with invalid ID: ${product.id}`);
          continue;
        }
        
        // Check if product already exists
        const [existingProducts] = await pool.execute(
          'SELECT id FROM products WHERE id = ?',
          [productId]
        );
        
        if (existingProducts.length === 0) {
          // Insert product
          await pool.execute(
            'INSERT INTO products (id, name, description, price, original_price, image, images, category_id, category_name, stock, rating, review_count, tags, is_featured, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
              productId,
              product.name,
              product.description,
              product.price,
              product.originalPrice || product.original_price || null,
              product.image,
              JSON.stringify(product.images || []),
              product.categoryId || product.category_id,
              product.categoryName || product.category_name,
              product.stock,
              product.rating,
              product.reviewCount || product.review_count || 0,
              JSON.stringify(product.tags || []),
              product.isFeatured || product.is_featured ? 1 : 0,
              convertToMySQLDate(product.createdAt),
              convertToMySQLDate(product.updatedAt)
            ]
          );
          console.log(`  - Migrated product: ${product.name}`);
        } else {
          console.log(`  - Product already exists: ${product.name}`);
        }
      } catch (error) {
        console.error(`  - Error migrating product ${product.name}:`, error.message);
      }
    }
    
    // Migrate cart items
    console.log('Migrating cart items...');
    let cartItemCounter = 1;
    for (const cartItem of dbData.cartItems || []) {
      try {
        // Convert IDs
        const cartItemId = convertId(cartItem.id) || cartItemCounter++;
        const userId = convertId(cartItem.userId || cartItem.user_id);
        const productId = convertId(cartItem.productId || cartItem.product_id);
        
        if (!userId || !productId) {
          console.log(`  - Skipping cart item with invalid IDs - User: ${userId}, Product: ${productId}`);
          continue;
        }
        
        // Check if cart item already exists
        const [existingCartItems] = await pool.execute(
          'SELECT id FROM cart_items WHERE id = ?',
          [cartItemId]
        );
        
        if (existingCartItems.length === 0) {
          // Find the product to get name and image
          const [products] = await pool.execute(
            'SELECT name, image FROM products WHERE id = ?',
            [productId]
          );
          
          const productName = cartItem.productName || cartItem.product_name || (products.length > 0 ? products[0].name : '');
          const productImage = cartItem.productImage || cartItem.product_image || (products.length > 0 ? products[0].image : '');
          
          // Insert cart item
          await pool.execute(
            'INSERT INTO cart_items (id, user_id, product_id, product_name, product_image, price, quantity, selected, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
              cartItemId,
              userId,
              productId,
              productName,
              productImage,
              cartItem.price,
              cartItem.quantity,
              cartItem.selected ? 1 : 0,
              convertToMySQLDate(cartItem.createdAt),
              convertToMySQLDate(cartItem.updatedAt)
            ]
          );
          console.log(`  - Migrated cart item: ${productName}`);
        } else {
          console.log(`  - Cart item already exists: ${cartItemId}`);
        }
      } catch (error) {
        console.error(`  - Error migrating cart item:`, error.message);
      }
    }
    
    // Migrate orders
    console.log('Migrating orders...');
    let orderCounter = 100; // Start from 100 to avoid conflicts with existing IDs
    for (const order of dbData.orders || []) {
      try {
        // Convert ID
        const orderId = convertId(order.id) || orderCounter++;
        const userId = convertId(order.userId || order.user_id);
        
        if (!userId) {
          console.log(`  - Skipping order ${order.orderNumber || order.order_number} with invalid user ID: ${userId}`);
          continue;
        }
        
        // Check if order already exists
        const [existingOrders] = await pool.execute(
          'SELECT id FROM orders WHERE id = ?',
          [orderId]
        );
        
        if (existingOrders.length === 0) {
          // Insert order
          await pool.execute(
            'INSERT INTO orders (id, user_id, order_number, items, subtotal, shipping_fee, total_amount, status, shipping_address, payment_method, payment_id, tracking_number, estimated_delivery, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
              orderId,
              userId,
              order.orderNumber || order.order_number,
              JSON.stringify(order.items || []),
              order.subtotal,
              order.shippingFee || order.shipping_fee || 0,
              order.totalAmount || order.total_amount,
              order.status || 'pending',
              JSON.stringify(order.shippingAddress || order.shipping_address || {}),
              order.paymentMethod || order.payment_method || 'wechat_pay',
              order.paymentId || order.payment_id || '',
              order.trackingNumber || order.tracking_number || '',
              order.estimatedDelivery ? convertToMySQLDate(order.estimatedDelivery) : null,
              convertToMySQLDate(order.createdAt),
              convertToMySQLDate(order.updatedAt)
            ]
          );
          console.log(`  - Migrated order: ${order.orderNumber || order.order_number}`);
        } else {
          console.log(`  - Order already exists: ${order.orderNumber || order.order_number}`);
        }
      } catch (error) {
        console.error(`  - Error migrating order:`, error.message);
      }
    }
    
    console.log('Data migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error during data migration:', error);
    process.exit(1);
  }
}

migrateData();