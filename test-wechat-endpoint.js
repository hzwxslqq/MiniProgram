// Test script for WeChat authorization login endpoint
const axios = require('axios');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: './backend/.env' });

// Set environment to development to enable simulation
process.env.NODE_ENV = 'development';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'online-store-secret-key';

async function testWeChatLogin() {
  try {
    console.log('Testing WeChat authorization login endpoint...');
    console.log('JWT_SECRET:', process.env.JWT_SECRET);
    
    const response = await axios.post('http://localhost:3000/api/auth/wechat-login', {
      code: 'test_code_12345',
      userInfo: {
        nickName: 'TestUser',
        avatarUrl: 'https://example.com/avatar.png'
      }
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(response.data, null, 2));
    
    // Test with the same user again to verify update functionality
    console.log('\nTesting with the same user again...');
    const response2 = await axios.post('http://localhost:3000/api/auth/wechat-login', {
      code: 'test_code_67890',
      userInfo: {
        nickName: 'TestUser',
        avatarUrl: 'https://example.com/new-avatar.png'
      }
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Second response status:', response2.status);
    console.log('Second response data:', JSON.stringify(response2.data, null, 2));
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
}

testWeChatLogin();