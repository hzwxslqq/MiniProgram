// Test script for WeChat authorization login
const axios = require('axios');

// Test data
const testData = {
  code: 'test_code_12345',
  userInfo: {
    nickName: 'TestUser',
    avatarUrl: 'https://example.com/avatar.png'
  }
};

// Test the WeChat login endpoint
async function testWeChatLogin() {
  try {
    console.log('Testing WeChat authorization login...');
    
    const response = await axios.post('http://localhost:3000/api/auth/wechat-login', testData);
    
    console.log('Response:', response.data);
    
    if (response.data.token) {
      console.log('✅ WeChat login successful!');
      console.log('Token:', response.data.token);
    } else {
      console.log('❌ Login failed:', response.data.message);
    }
  } catch (error) {
    console.error('❌ Error during WeChat login test:', error.response?.data || error.message);
  }
}

// Run the test
testWeChatLogin();