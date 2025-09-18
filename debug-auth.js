const axios = require('axios');

const baseURL = 'http://localhost:3000';

async function debugAuth() {
  try {
    console.log('=== Debugging Authentication ===');
    
    // Login to get a token
    const loginResponse = await axios.post(baseURL + '/api/auth/wechat-login', {
      code: 'test_code',
      userInfo: {
        nickName: 'Test User',
        avatarUrl: ''
      }
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Login response:', loginResponse.data);
    console.log('User ID:', loginResponse.data.user.id, '(type:', typeof loginResponse.data.user.id, ')');
    
    const token = loginResponse.data.token;
    const userId = loginResponse.data.user.id;
    
    // Test adding item to cart
    console.log('\n1. Adding item to cart...');
    const cartResponse = await axios.post(baseURL + '/api/cart', {
      productId: '1',
      quantity: 1
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    });
    
    console.log('Cart response:', cartResponse.data);
    
    // Test getting cart items
    console.log('\n2. Getting cart items...');
    const getCartResponse = await axios.get(baseURL + '/api/cart', {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });
    
    console.log('Get cart response:', getCartResponse.data);
    
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

debugAuth();