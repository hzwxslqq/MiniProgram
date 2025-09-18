const axios = require('axios');
const { pool } = require('./backend/utils/mysql');

const baseURL = 'http://localhost:3000';

async function testFixes() {
  try {
    console.log('=== Testing Fixes ===');
    
    // Test 1: User creation and address persistence
    console.log('\n1. Testing user creation and address persistence...');
    
    // Login to get a token
    const loginResponse = await axios.post(baseURL + '/api/auth/wechat-login', {
      code: 'test_code',
      userInfo: {
        nickName: 'Test User ' + Date.now(),
        avatarUrl: ''
      }
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    const token = loginResponse.data.token;
    const userId = loginResponse.data.user.id;
    console.log('Logged in as user:', userId, '(type:', typeof userId, ')');
    
    // Add an address
    const addressResponse = await axios.post(baseURL + '/api/user/addresses', {
      name: 'Test Customer',
      phone: '123456789',
      address: '123 Test St',
      city: 'Test City',
      postalCode: '12345',
      isDefault: true
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    });
    
    console.log('Address created with ID:', addressResponse.data.data.id);
    
    // Get addresses
    const getAddressesResponse = await axios.get(baseURL + '/api/user/addresses', {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });
    
    console.log('Addresses retrieved:', getAddressesResponse.data.data.length);
    
    // Test 2: Payment processing
    console.log('\n2. Testing payment processing...');
    
    // Add items to cart
    await axios.post(baseURL + '/api/cart', {
      productId: '1',
      quantity: 1
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    });
    
    // Create order
    const orderResponse = await axios.post(baseURL + '/api/orders', {
      items: [{
        productId: '1',
        quantity: 1
      }],
      shippingAddress: {
        name: 'Test Customer',
        phone: '123456789',
        address: '123 Test St',
        city: 'Test City',
        postalCode: '12345'
      }
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    });
    
    const orderId = orderResponse.data.data.id;
    console.log('Order created:', orderId);
    
    // Process payment
    const paymentResponse = await axios.post(`${baseURL}/api/orders/${orderId}/payment`, {
      paymentMethod: 'wechat'
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    });
    
    console.log('Payment processed:', paymentResponse.data.message);
    
    if (paymentResponse.data.message.includes('successful')) {
      console.log('✅ Both fixes are working correctly!');
    } else {
      console.log('❌ Payment processing still has issues');
    }
    
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

testFixes();