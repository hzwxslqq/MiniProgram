/**
 * Script to test tracking with a specific order
 */

// Load environment variables
require('dotenv').config({ path: __dirname + '/.env' });

// Set DB_TYPE to file for testing
process.env.DB_TYPE = 'file';

const Order = require('./models/Order');

async function testTrackingWithOrder(orderId) {
  console.log(`Testing tracking for order ID: ${orderId}`);
  
  try {
    // Find the specific order
    const order = await Order.findById(orderId);
    
    if (!order) {
      console.log(`Order with ID ${orderId} not found.`);
      return;
    }
    
    console.log('Order details:');
    console.log(`  Order Number: ${order.orderNumber}`);
    console.log(`  Status: ${order.status}`);
    console.log(`  Tracking Number: ${order.trackingNumber}`);
    
    if (!order.trackingNumber) {
      console.log('No tracking number found for this order.');
      return;
    }
    
    // Test tracking information retrieval
    console.log(`\nFetching tracking info for: ${order.trackingNumber}`);
    
    // Use the logistics module to get tracking info
    const { getTrackingInfo } = require('./utils/logistics');
    
    try {
      const trackingInfo = await getTrackingInfo(order.trackingNumber);
      console.log('Tracking information retrieved successfully:');
      console.log(JSON.stringify(trackingInfo, null, 2));
      
      // Also test through the controller
      console.log('\n--- Testing through controller ---');
      const { getTrackingInfo: controllerGetTrackingInfo } = require('./controllers/orderController');
      
      // Mock request and response objects
      const mockReq = {
        user: { id: order.userId || 1 },
        params: { id: order.id }
      };
      
      let controllerResponse = null;
      const mockRes = {
        status: function(code) {
          this.statusCode = code;
          return this;
        },
        json: function(data) {
          controllerResponse = { statusCode: this.statusCode, data: data };
        }
      };
      
      // Call the controller function
      await controllerGetTrackingInfo(mockReq, mockRes);
      
      if (controllerResponse) {
        console.log('Controller response:');
        console.log(`  Status: ${controllerResponse.statusCode}`);
        console.log(`  Message: ${controllerResponse.data.message}`);
        if (controllerResponse.data.data) {
          console.log(`  Carrier: ${controllerResponse.data.data.carrier}`);
          console.log(`  Tracking Number: ${controllerResponse.data.data.trackingNumber}`);
          console.log(`  Status: ${controllerResponse.data.data.status}`);
          console.log(`  Events count: ${controllerResponse.data.data.events.length}`);
        }
      }
    } catch (trackingError) {
      console.error('Error retrieving tracking information:', trackingError.message);
    }
  } catch (error) {
    console.error('Error finding order:', error.message);
  }
}

// Get order ID from command line arguments or use the latest one with valid tracking number
const orderId = process.argv[2] || '1758014288097'; // Using the last order we created
testTrackingWithOrder(orderId);