const axios = require('axios');
const fs = require('fs');

const baseURL = 'http://localhost:3000';

async function testCartFull() {
  try {
    // First, let's login to get a token
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
    const token = loginResponse.data.token;
    console.log('Token:', token);
    
    // Add an item to the cart
    const addItemResponse = await axios.post(baseURL + '/api/cart', {
      productId: '3',
      quantity: 2
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    });
    
    console.log('Add to cart response:', addItemResponse.data);
    
    // Get cart items
    const getCartResponse = await axios.get(baseURL + '/api/cart', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    });
    
    console.log('Get cart response:', getCartResponse.data);
    
    // Check database directly
    const db = JSON.parse(fs.readFileSync('./backend/data/db.json', 'utf8'));
    console.log('Database cart items count:', db.cartItems.length);
    
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

testCartFull();