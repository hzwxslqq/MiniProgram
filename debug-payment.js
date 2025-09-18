const axios = require('axios');
const { pool } = require('./backend/utils/mysql');

const baseURL = 'http://localhost:3000';

async function debugPayment() {
  try {
    console.log('=== Debugging Payment Process ===');
    
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
    console.log('Logged in as user:', userId, '(type:', typeof userId, ')');
    
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
    
    // Check cart items before order
    const [cartBeforeOrder] = await pool.execute('SELECT * FROM cart_items WHERE user_id = ?', [userId]);
    console.log('Cart items before order:', cartBeforeOrder.length);
    console.log('Cart items details:', cartBeforeOrder.map(item => ({ id: item.id, user_id: item.user_id, product_id: item.product_id })));
    
    // Create order
    console.log('\n2. Creating order...');
    // Get cart items from the API to make sure we have the right format
    const cartResponse = await axios.get(baseURL + '/api/cart', {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });
    
    console.log('Cart API response:', cartResponse.data);
    
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
    
    // Check what orders exist in the database
    const [allOrders] = await pool.execute('SELECT * FROM orders');
    console.log('All orders in database:', allOrders);
    
    // Check what orders exist for this user
    const [userOrders] = await pool.execute('SELECT * FROM orders WHERE user_id = ?', [userId]);
    console.log('Orders for user:', userOrders);
    
    // Check cart items after order creation
    const [cartAfterOrder] = await pool.execute('SELECT * FROM cart_items WHERE user_id = ?', [userId]);
    console.log('Cart items after order creation:', cartAfterOrder.length);
    
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
    
    console.log('Payment response:', paymentResponse.data);
    
    // Check cart items after payment
    const [cartAfterPayment] = await pool.execute('SELECT * FROM cart_items WHERE user_id = ?', [userId]);
    console.log('Cart items after payment:', cartAfterPayment.length);
    console.log('Cart items details after payment:', cartAfterPayment.map(item => ({ id: item.id, user_id: item.user_id, product_id: item.product_id })));
    
    if (cartAfterPayment.length === 0) {
      console.log('\n✅ SUCCESS: Cart items properly cleared after payment!');
    } else {
      console.log('\n❌ FAILED: Cart items not cleared after payment');
    }
    
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    }
  }
}

debugPayment();