const axios = require('axios');

// Test the tracking API
async function testTrackingAPI() {
  try {
    console.log('Testing tracking API...');
    
    // Login with admin credentials
    const loginResponse = await axios.post('http://localhost:3000/api/auth/login', {
      username: 'admin',
      password: 'admin123'
    });
    
    console.log('Login successful, token received');
    const token = loginResponse.data.token;
    
    // Get the target order first
    const ordersResponse = await axios.get('http://localhost:3000/api/orders', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const targetOrder = ordersResponse.data.data.find(order => order.orderNumber === 'ORD-20250916-294');
    
    if (!targetOrder) {
      console.log('Target order not found');
      return;
    }
    
    console.log('Target order found:', targetOrder.orderNumber);
    console.log('Order status:', targetOrder.status);
    console.log('Tracking number:', targetOrder.trackingNumber);
    
    // Test the tracking API
    console.log('\nTesting tracking info retrieval...');
    const trackingResponse = await axios.get(`http://localhost:3000/api/orders/${targetOrder.id}/tracking`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('Tracking API response:', trackingResponse.data);
  } catch (error) {
    console.error('Error testing tracking API:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testTrackingAPI();