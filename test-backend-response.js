// Test the exact backend response format
const axios = require('axios');

async function testBackendResponse() {
  try {
    const baseURL = 'http://localhost:3000';
    
    // Login
    console.log('1. Logging in...');
    const loginResponse = await axios.post(`${baseURL}/api/auth/wechat-login`, {
      code: 'test_code',
      userInfo: {
        nickName: 'Test User',
        avatarUrl: 'https://example.com/avatar.jpg'
      }
    });
    
    const token = loginResponse.data.token;
    console.log('   Token:', token);
    
    // Add item to cart
    console.log('\n2. Adding item to cart...');
    await axios.post(`${baseURL}/api/cart`, {
      productId: 1,
      quantity: 2
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    // Get cart items
    console.log('\n3. Getting cart items...');
    const cartResponse = await axios.get(`${baseURL}/api/cart`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('   Cart response structure:');
    console.log('   - message:', cartResponse.data.message);
    console.log('   - data type:', typeof cartResponse.data.data);
    console.log('   - data length:', cartResponse.data.data.length);
    
    if (cartResponse.data.data && cartResponse.data.data.length > 0) {
      const firstItem = cartResponse.data.data[0];
      console.log('   - First item keys:', Object.keys(firstItem));
      console.log('   - First item:', firstItem);
      
      // Check specific fields
      console.log('   - firstItem.id:', firstItem.id);
      console.log('   - firstItem.productId:', firstItem.productId);
      console.log('   - firstItem.product_id:', firstItem.product_id);
      console.log('   - firstItem.productName:', firstItem.productName);
      console.log('   - firstItem.product_name:', firstItem.product_name);
    }
    
  } catch (error) {
    console.error('ERROR:', error.response ? error.response.data : error.message);
  }
}

testBackendResponse();