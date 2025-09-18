const axios = require('axios');

const baseURL = 'http://localhost:3000';

async function debugUser() {
  try {
    console.log('=== Debugging User Creation ===');
    
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
    console.log('User ID:', loginResponse.data.user.id, 'Type:', typeof loginResponse.data.user.id);
    
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

debugUser();