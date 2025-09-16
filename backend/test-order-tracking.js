/**
 * Test script for order creation and tracking with Yunda Express
 */

// Load environment variables
require('dotenv').config({ path: __dirname + '/.env' });

// Set DB_TYPE to file for testing
process.env.DB_TYPE = 'file';

const Order = require('./models/Order');

async function testOrderTracking() {
  console.log('Testing order creation and tracking with Yunda Express...');
  
  try {
    // Create a test order
    console.log('Creating test order...');
    const testOrder = new Order({
      userId: 1, // Assuming user ID 1 exists
      items: [
        {
          productId: 1,
          productName: 'Test Product',
          productImage: '/images/test-product.png',
          price: 29.99,
          quantity: 2
        }
      ],
      subtotal: 59.98,
      shippingFee: 5.99,
      totalAmount: 65.97,
      status: 'pending',
      shippingAddress: {
        fullName: 'Test User',
        address: '123 Test Street',
        city: 'Test City',
        postalCode: '12345',
        country: 'Test Country'
      },
      paymentMethod: 'wechat_pay'
    });
    
    // Save the order
    const saved = await testOrder.save();
    if (!saved) {
      throw new Error('Failed to save order');
    }
    
    console.log('Order created successfully with ID:', testOrder.id);
    console.log('Order number:', testOrder.order_number);
    
    // Process payment to assign tracking number
    console.log('Processing payment...');
    testOrder.status = 'paid';
    testOrder.paymentId = `PAY-${Date.now()}`;
    // Generate a proper Yunda tracking number (12-15 digits)
    const timestamp = Date.now().toString();
    // Take last 13 digits to ensure it's within the 12-15 digit range
    testOrder.trackingNumber = timestamp.substring(Math.max(0, timestamp.length - 13));
    testOrder.estimatedDelivery = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000); // 3 days from now
    
    const paymentProcessed = await testOrder.save();
    if (!paymentProcessed) {
      throw new Error('Failed to process payment');
    }
    
    console.log('Payment processed successfully');
    console.log('Tracking number assigned:', testOrder.tracking_number);
    
    // Mark order as shipped
    console.log('Marking order as shipped...');
    testOrder.status = 'shipped';
    
    // Ensure tracking number follows Yunda format
    if (!/^\d{12,15}$/.test(testOrder.trackingNumber)) {
      const timestamp = Date.now().toString();
      testOrder.trackingNumber = timestamp.substring(Math.max(0, timestamp.length - 13));
    }
    
    const shipped = await testOrder.save();
    if (!shipped) {
      throw new Error('Failed to mark order as shipped');
    }
    
    console.log('Order marked as shipped');
    
    // Test tracking information retrieval
    console.log('Testing tracking information retrieval...');
    const { getTrackingInfo } = require('./utils/logistics');
    
    try {
      const trackingInfo = await getTrackingInfo(testOrder.tracking_number);
      console.log('Tracking information retrieved successfully:');
      console.log(JSON.stringify(trackingInfo, null, 2));
    } catch (trackingError) {
      console.error('Error retrieving tracking information:', trackingError.message);
      
      // Show what we have in the order
      console.log('Order tracking number:', testOrder.tracking_number);
      console.log('Order status:', testOrder.status);
    }
    
    // Test the controller function directly
    console.log('Testing controller tracking function...');
    // Use the main order controller since we're using file-based database
    const { getTrackingInfo: controllerGetTrackingInfo } = require('./controllers/orderController');
    
    // Mock request and response objects
    const mockReq = {
      user: { id: 1 },
      params: { id: testOrder.id }
    };
    
    const mockRes = {
      status: function(code) {
        this.statusCode = code;
        return this;
      },
      json: function(data) {
        this.data = data;
        console.log('Controller response status:', this.statusCode);
        console.log('Controller response data:', JSON.stringify(data, null, 2));
      }
    };
    
    // Call the controller function
    await controllerGetTrackingInfo(mockReq, mockRes);
    
  } catch (error) {
    console.error('Error in test:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

testOrderTracking();