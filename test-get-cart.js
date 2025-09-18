const axios = require('axios');

const baseURL = 'http://localhost:3000';

async function testGetCart() {
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
    
    // Now get cart items with authentication
    const response = await axios.get(baseURL + '/api/cart', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    });
    
    console.log('Get cart response:', response.data);
  } catch (error) {
    console.error('Get cart error:', error.response?.data || error.message);
  }
}

testGetCart();