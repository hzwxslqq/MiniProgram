/**
 * Complete test script for order creation, payment processing, and tracking with Yunda Express
 */

// Load environment variables
require('dotenv').config({ path: __dirname + '/.env' });

// Set DB_TYPE to file for testing
process.env.DB_TYPE = 'file';

const Order = require('./models/Order');

async function testCompleteOrderFlow() {
  console.log('=== Testing Complete Order Flow with Yunda Express ===\n');
  
  try {
    // Step 1: Create a test order
    console.log('Step 1: Creating test order...');
    const testOrder = new Order({
      userId: 1, // Assuming user ID 1 exists
      items: [
        {
          productId: 1,
          productName: 'Wireless Headphones',
          productImage: '/images/product1.png',
          price: 129.99,
          quantity: 1
        },
        {
          productId: 2,
          productName: 'Phone Case',
          productImage: '/images/product2.png',
          price: 24.99,
          quantity: 2
        }
      ],
      subtotal: 179.97,
      shippingFee: 5.99,
      totalAmount: 185.96,
      status: 'pending',
      shippingAddress: {
        fullName: 'John Doe',
        address: '456 Main Street',
        city: 'Shanghai',
        postalCode: '200000',
        country: 'China'
      },
      paymentMethod: 'wechat_pay'
    });
    
    // Save the order
    await testOrder.save();
    console.log('✓ Order created successfully');
    console.log('  Order ID:', testOrder.id);
    console.log('  Order Number:', testOrder.orderNumber);
    console.log('  Status:', testOrder.status);
    console.log('');
    
    // Step 2: Process payment and assign tracking number
    console.log('Step 2: Processing payment...');
    testOrder.status = 'paid';
    testOrder.paymentId = `PAY-${Date.now()}`;
    
    // Generate a proper Yunda tracking number (12-15 digits)
    const timestamp = Date.now().toString();
    // Take last 13 digits to ensure it's within the 12-15 digit range
    testOrder.trackingNumber = timestamp.substring(Math.max(0, timestamp.length - 13));
    testOrder.estimatedDelivery = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000); // 3 days from now
    
    await testOrder.save();
    console.log('✓ Payment processed successfully');
    console.log('  Payment ID:', testOrder.paymentId);
    console.log('  Tracking Number:', testOrder.trackingNumber);
    console.log('  Estimated Delivery:', testOrder.estimatedDelivery.toISOString().split('T')[0]);
    console.log('');
    
    // Step 3: Mark order as shipped
    console.log('Step 3: Marking order as shipped...');
    testOrder.status = 'shipped';
    
    // Ensure tracking number follows Yunda format
    if (!/^\d{12,15}$/.test(testOrder.trackingNumber)) {
      const timestamp = Date.now().toString();
      testOrder.trackingNumber = timestamp.substring(Math.max(0, timestamp.length - 13));
    }
    
    await testOrder.save();
    console.log('✓ Order marked as shipped');
    console.log('  Status:', testOrder.status);
    console.log('  Tracking Number:', testOrder.trackingNumber);
    console.log('');
    
    // Step 4: Test tracking information retrieval
    console.log('Step 4: Testing tracking information retrieval...');
    
    // Test direct logistics module call
    const { getTrackingInfo } = require('./utils/logistics');
    
    try {
      const trackingInfo = await getTrackingInfo(testOrder.trackingNumber);
      console.log('✓ Tracking information retrieved successfully via logistics module');
      console.log('  Carrier:', trackingInfo.carrier);
      console.log('  Status:', trackingInfo.status);
      console.log('  Events count:', trackingInfo.events.length);
      console.log('');
      
      // Show first event as example
      if (trackingInfo.events.length > 0) {
        console.log('  Latest tracking event:');
        console.log('    Status:', trackingInfo.events[0].status);
        console.log('    Location:', trackingInfo.events[0].location);
        console.log('    Timestamp:', trackingInfo.events[0].timestamp);
      }
    } catch (trackingError) {
      console.error('✗ Error retrieving tracking information:', trackingError.message);
    }
    
    // Step 5: Test controller function
    console.log('\nStep 5: Testing controller tracking function...');
    
    // Use the main order controller since we're using file-based database
    const { getTrackingInfo: controllerGetTrackingInfo } = require('./controllers/orderController');
    
    // Mock request and response objects
    const mockReq = {
      user: { id: 1 },
      params: { id: testOrder.id }
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
      console.log('✓ Controller tracking function executed successfully');
      console.log('  Response Status:', controllerResponse.statusCode);
      console.log('  Message:', controllerResponse.data.message);
      console.log('  Carrier:', controllerResponse.data.data.carrier);
      console.log('  Tracking Number:', controllerResponse.data.data.trackingNumber);
      console.log('  Events count:', controllerResponse.data.data.events.length);
    } else {
      console.log('✗ Controller did not return a response');
    }
    
    console.log('\n=== Test Completed Successfully ===');
    
  } catch (error) {
    console.error('Error in test:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

testCompleteOrderFlow();