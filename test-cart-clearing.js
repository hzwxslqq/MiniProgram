const axios = require('axios');
const fs = require('fs');

const baseURL = 'http://localhost:3000';

async function testCartClearing() {
  try {
    console.log('=== Testing Cart Clearing After Payment ===');
    
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
    
    const token = loginResponse.data.token;
    const userId = loginResponse.data.user.id;
    console.log('Logged in as user:', userId);
    
    // Add items to cart
    console.log('\n1. Adding items to cart...');
    await axios.post(baseURL + '/api/cart', {
      productId: '1',
      quantity: 1
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    });
    
    await axios.post(baseURL + '/api/cart', {
      productId: '2',
      quantity: 2
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    });
    
    // Check cart items
    const cartResponse = await axios.get(baseURL + '/api/cart', {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });
    
    console.log('Cart items before order:', cartResponse.data.data.length);
    
    // Create order
    console.log('\n2. Creating order...');
    const orderResponse = await axios.post(baseURL + '/api/orders', {
      items: cartResponse.data.data.map(item => ({
        productId: item.productId,
        quantity: item.quantity
      })),
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
    
    // Check cart items after order creation (should still be there)
    const cartAfterOrderResponse = await axios.get(baseURL + '/api/cart', {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });
    
    console.log('Cart items after order creation:', cartAfterOrderResponse.data.data.length);
    
    // Process payment
    console.log('\n3. Processing payment...');
    const paymentResponse = await axios.post(`${baseURL}/api/orders/${orderId}/payment`, {
      paymentMethod: 'wechat'
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    });
    
    console.log('Payment processed:', paymentResponse.data.data.status);
    
    // Check cart items after payment (should be cleared)
    const cartAfterPaymentResponse = await axios.get(baseURL + '/api/cart', {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });
    
    console.log('Cart items after payment:', cartAfterPaymentResponse.data.data.length);
    
    // Check database directly
    const db = JSON.parse(fs.readFileSync('./backend/data/db.json', 'utf8'));
    const userCartItems = db.cartItems.filter(item => item.userId === userId);
    console.log('Database cart items for user:', userCartItems.length);
    
    if (cartAfterPaymentResponse.data.data.length === 0 && userCartItems.length === 0) {
      console.log('\n✅ SUCCESS: Cart items properly cleared after payment!');
    } else {
      console.log('\n❌ FAILED: Cart items not cleared after payment');
    }
    
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

testCartClearing();