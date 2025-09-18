// Test script for user registration
const axios = require('axios');

async function testRegistration() {
  try {
    console.log('Testing user registration...');
    
    const response = await axios.post('http://localhost:3000/api/auth/register', {
      username: 'testuser' + Date.now(),
      email: 'testuser' + Date.now() + '@example.com',
      password: 'testpassword123'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(response.data, null, 2));
    
    if (response.data.token) {
      console.log('✅ Registration successful!');
      console.log('Token:', response.data.token);
    } else {
      console.log('❌ Registration failed:', response.data.message);
    }
  } catch (error) {
    console.error('❌ Error during registration test:', error.response?.data || error.message);
  }
}

// Run the test
testRegistration();