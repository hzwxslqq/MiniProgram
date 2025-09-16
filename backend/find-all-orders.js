/**
 * Script to find all orders in the system
 */

// Load environment variables
require('dotenv').config({ path: __dirname + '/.env' });

// Set DB_TYPE to file for testing
process.env.DB_TYPE = 'file';

const Order = require('./models/Order');

async function findAllOrders() {
  console.log('Searching for all orders...');
  
  try {
    // Find all orders
    const allOrders = await Order.find({});
    
    console.log(`Found ${allOrders.length} order(s):`);
    
    if (allOrders.length > 0) {
      allOrders.forEach((order, index) => {
        console.log(`\n--- Order ${index + 1} ---`);
        console.log(`ID: ${order.id}`);
        console.log(`Order Number: ${order.orderNumber}`);
        console.log(`Status: ${order.status}`);
        console.log(`Tracking Number: ${order.trackingNumber || 'None'}`);
        console.log(`User ID: ${order.userId}`);
        console.log(`Created At: ${order.createdAt}`);
        console.log(`Updated At: ${order.updatedAt}`);
        
        // Show items
        console.log('Items:');
        if (order.items && Array.isArray(order.items)) {
          order.items.forEach((item, itemIndex) => {
            console.log(`  ${itemIndex + 1}. ${item.productName} (Qty: ${item.quantity}, Price: $${item.price})`);
          });
        }
        
        console.log(`Total Amount: $${order.totalAmount}`);
      });
    } else {
      console.log('No orders found in the system.');
    }
    
    // Let's also check if there are any data files
    console.log('\n--- Checking data files ---');
    const fs = require('fs');
    const path = require('path');
    
    const dataDir = path.join(__dirname, 'data');
    if (fs.existsSync(dataDir)) {
      const files = fs.readdirSync(dataDir);
      console.log('Data files found:', files);
      
      files.forEach(file => {
        if (file === 'orders.json') {
          const ordersData = JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf8'));
          console.log(`\nOrders in ${file}:`, ordersData);
        }
      });
    } else {
      console.log('No data directory found.');
    }
  } catch (error) {
    console.error('Error finding orders:', error.message);
  }
}

findAllOrders();