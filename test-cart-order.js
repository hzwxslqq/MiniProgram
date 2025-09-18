const axios = require('axios');

// Test the cart and order functionality
async function testCartOrderFlow() {
  try {
    const baseURL = 'http://localhost:3000';
    
    // First, let's login to get a token
    console.log('Logging in...');
    const loginResponse = await axios.post(`${baseURL}/api/auth/wechat-login`, {
      code: 'test_code',
      userInfo: {
        nickName: 'Test User',
        avatarUrl: 'https://example.com/avatar.jpg'
      }
    });
    
    const token = loginResponse.data.token;
    console.log('Login successful, token:', token);
    
    // Get cart items
    console.log('\nGetting cart items...');
    const cartResponse = await axios.get(`${baseURL}/api/cart`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('Cart items:', cartResponse.data);
    
    // If cart is empty, add an item
    if (!cartResponse.data.data || cartResponse.data.data.length === 0) {
      console.log('\nCart is empty, adding an item...');
      const addResponse = await axios.post(`${baseURL}/api/cart`, {
        productId: 1,
        quantity: 2
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Added item to cart:', addResponse.data);
      
      // Get cart items again
      const updatedCartResponse = await axios.get(`${baseURL}/api/cart`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Updated cart items:', updatedCartResponse.data);
    }
    
    // Create an order
    console.log('\nCreating order...');
    const orderResponse = await axios.post(`${baseURL}/api/orders`, {
      items: [
        {
          productId: 1,
          quantity: 2
        }
      ],
      shippingAddress: {
        name: 'Test User',
        phone: '1234567890',
        address: '123 Test Street',
        city: 'Test City',
        postalCode: '12345'
      }
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('Order created:', orderResponse.data);
    
  } catch (error) {
    console.error('Test failed:', error.response ? error.response.data : error.message);
  }
}

testCartOrderFlow();