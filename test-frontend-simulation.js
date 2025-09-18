// Simulate the frontend checkout process to identify where the issue occurs
const axios = require('axios');

async function simulateFrontendProcess() {
  try {
    const baseURL = 'http://localhost:3000';
    
    // Login
    console.log('1. Logging in...');
    const loginResponse = await axios.post(`${baseURL}/api/auth/wechat-login`, {
      code: 'test_code',
      userInfo: {
        nickName: 'Test User',
        avatarUrl: 'https://example.com/avatar.jpg'
      }
    });
    
    const token = loginResponse.data.token;
    console.log('   Token:', token);
    
    // Add item to cart
    console.log('\n2. Adding item to cart...');
    await axios.post(`${baseURL}/api/cart`, {
      productId: 1,
      quantity: 2
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    // Get cart items (simulating what the frontend does)
    console.log('\n3. Getting cart items...');
    const cartResponse = await axios.get(`${baseURL}/api/cart`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('   Cart response:', JSON.stringify(cartResponse.data, null, 2));
    
    // Simulate frontend transformation of cart items
    console.log('\n4. Simulating frontend cart item transformation...');
    const frontendCartItems = cartResponse.data.data.map(item => {
      return {
        id: item.id,
        productId: item.productId,  // This is what the frontend expects
        name: item.productName,
        image: item.productImage,
        price: item.price,
        quantity: item.quantity,
        selected: item.selected !== undefined ? item.selected : true
      };
    });
    
    console.log('   Frontend cart items:', JSON.stringify(frontendCartItems, null, 2));
    
    // Validate that all items have productId
    console.log('\n5. Validating cart items...');
    for (let i = 0; i < frontendCartItems.length; i++) {
      const item = frontendCartItems[i];
      if (!item.productId) {
        console.error(`   ERROR: Item ${i} missing productId:`, item);
        throw new Error(`Item ${i} missing productId`);
      }
      console.log(`   Item ${i} has productId: ${item.productId}`);
    }
    
    // Create order (simulating what the frontend sends)
    console.log('\n6. Creating order...');
    const orderData = {
      items: frontendCartItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity
      })),
      shippingAddress: {
        name: 'Test User',
        phone: '1234567890',
        address: '123 Test Street',
        city: 'Test City',
        postalCode: '12345'
      }
    };
    
    console.log('   Order data being sent:', JSON.stringify(orderData, null, 2));
    
    const orderResponse = await axios.post(`${baseURL}/api/orders`, orderData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('\n7. Order created successfully:', JSON.stringify(orderResponse.data, null, 2));
    
  } catch (error) {
    console.error('\nERROR:', error.response ? error.response.data : error.message);
  }
}

simulateFrontendProcess();