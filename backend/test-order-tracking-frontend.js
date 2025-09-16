/**
 * Script to simulate what the frontend would see for order tracking
 */

// Load environment variables
require('dotenv').config({ path: __dirname + '/.env' });

// Set DB_TYPE to file for testing
process.env.DB_TYPE = 'file';

const Order = require('./models/Order');

async function simulateFrontendTrackingView() {
  console.log('=== Simulating Frontend Tracking View ===\n');
  
  try {
    // Find the specific order that exists
    const orderId = '1758014288097'; // The order you're looking for
    const order = await Order.findById(orderId);
    
    if (!order) {
      console.log(`Order with ID ${orderId} not found.`);
      return;
    }
    
    console.log('Order Details (What would appear in frontend):');
    console.log('==========================================');
    console.log(`Order Number: ${order.orderNumber}`);
    console.log(`Status: ${order.status}`);
    console.log(`Tracking Number: ${order.trackingNumber}`);
    console.log(`Total Amount: $${order.totalAmount}`);
    console.log(`Created: ${order.createdAt}`);
    
    console.log('\nItems:');
    if (order.items && Array.isArray(order.items)) {
      order.items.forEach((item, index) => {
        console.log(`  ${index + 1}. ${item.productName}`);
        console.log(`     Qty: ${item.quantity}  Price: $${item.price}  Subtotal: $${(item.quantity * item.price).toFixed(2)}`);
      });
    }
    
    // Check if tracking is available
    if (order.status === 'shipped' && order.trackingNumber) {
      console.log('\n[Track Order] button: ENABLED');
      
      // Simulate what the tracking page would show
      console.log('\n--- Tracking Page Simulation ---');
      console.log('If you click "Track Order", you would see:');
      
      // Use the logistics module to get tracking info
      const { getTrackingInfo } = require('./utils/logistics');
      
      try {
        const trackingInfo = await getTrackingInfo(order.trackingNumber);
        console.log(`\nTracking Number: ${trackingInfo.trackingNumber}`);
        console.log(`Carrier: ${trackingInfo.carrier}`);
        console.log(`Status: ${trackingInfo.status}`);
        console.log(`Estimated Delivery: ${trackingInfo.estimatedDelivery}`);
        
        console.log('\nTracking Events:');
        trackingInfo.events.forEach((event, index) => {
          console.log(`  ${index + 1}. ${event.status}`);
          console.log(`     Location: ${event.location}`);
          console.log(`     Time: ${event.timestamp}`);
          if (event.description) {
            console.log(`     Details: ${event.description}`);
          }
          console.log('');
        });
      } catch (trackingError) {
        console.log('Tracking Error:', trackingError.message);
      }
    } else {
      console.log('\n[Track Order] button: DISABLED');
      console.log('Reason: Order is not shipped or has no tracking number');
    }
    
    console.log('\n=== Troubleshooting Frontend Issue ===');
    console.log('If you cannot see this order in the frontend:');
    console.log('1. The frontend might be using fallback/simulated data instead of real API data');
    console.log('2. There might be an authentication issue between frontend and backend');
    console.log('3. The API call might be failing and falling back to mock data');
    console.log('4. The order filtering might not be working correctly');
    
    console.log('\nTo fix this:');
    console.log('1. Check browser console for API call errors');
    console.log('2. Verify that the frontend is making requests to http://localhost:3000');
    console.log('3. Ensure proper JWT token is being sent with requests');
    console.log('4. Check that the backend server is running on port 3000');
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

simulateFrontendTrackingView();