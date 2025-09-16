/**
 * Script to find shipped orders in the system
 */

// Load environment variables
require('dotenv').config({ path: __dirname + '/.env' });

// Set DB_TYPE to file for testing
process.env.DB_TYPE = 'file';

const Order = require('./models/Order');

async function findShippedOrders() {
  console.log('Searching for shipped orders...');
  
  try {
    // Find all shipped orders
    const shippedOrders = await Order.find({ status: 'shipped' });
    
    console.log(`Found ${shippedOrders.length} shipped order(s):`);
    
    if (shippedOrders.length > 0) {
      shippedOrders.forEach((order, index) => {
        console.log(`\n--- Order ${index + 1} ---`);
        console.log(`ID: ${order.id}`);
        console.log(`Order Number: ${order.orderNumber}`);
        console.log(`Tracking Number: ${order.trackingNumber}`);
        console.log(`Status: ${order.status}`);
        console.log(`Created At: ${order.createdAt}`);
        console.log(`Updated At: ${order.updatedAt}`);
        
        // Show items
        console.log('Items:');
        if (order.items && Array.isArray(order.items)) {
          order.items.forEach((item, itemIndex) => {
            console.log(`  ${itemIndex + 1}. ${item.productName} (Qty: ${item.quantity})`);
          });
        }
      });
      
      // Test tracking for the first shipped order
      const firstOrder = shippedOrders[0];
      console.log(`\n--- Testing Tracking for Order ID: ${firstOrder.id} ---`);
      
      // Use the logistics module to get tracking info
      const { getTrackingInfo } = require('./utils/logistics');
      
      try {
        console.log(`Fetching tracking info for: ${firstOrder.trackingNumber}`);
        const trackingInfo = await getTrackingInfo(firstOrder.trackingNumber);
        console.log('Tracking information retrieved successfully:');
        console.log(JSON.stringify(trackingInfo, null, 2));
      } catch (trackingError) {
        console.error('Error retrieving tracking information:', trackingError.message);
      }
    } else {
      console.log('No shipped orders found in the system.');
      
      // Let's check all orders to see what we have
      const allOrders = await Order.find({});
      console.log(`\nTotal orders in system: ${allOrders.length}`);
      
      if (allOrders.length > 0) {
        allOrders.forEach((order, index) => {
          console.log(`${index + 1}. Order ${order.orderNumber} - Status: ${order.status}`);
        });
      }
    }
  } catch (error) {
    console.error('Error finding shipped orders:', error.message);
  }
}

findShippedOrders();