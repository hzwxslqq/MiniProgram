// Test script to simulate checkout page behavior
const http = require('http');

// First, let's get an authentication token
async function getAuthToken() {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      code: 'test_code',
      userInfo: {
        nickName: 'Test User',
        avatarUrl: 'http://example.com/avatar.png'
      }
    });
    
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/auth/wechat-login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };
    
    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (response.token) {
            resolve(response.token);
          } else {
            reject(new Error('Authentication failed'));
          }
        } catch (error) {
          reject(error);
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.write(postData);
    req.end();
  });
}

// Get cart items with authentication
async function getCartItems(token) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/cart',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    };
    
    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          resolve(response);
        } catch (error) {
          reject(error);
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.end();
  });
}

// Simulate checkout page behavior
async function simulateCheckout() {
  try {
    console.log('=== SIMULATING CHECKOUT PAGE BEHAVIOR ===');
    
    // Get authentication token
    console.log('1. Getting authentication token...');
    const token = await getAuthToken();
    console.log('✅ Token obtained:', token.substring(0, 20) + '...');
    
    // Get cart items
    console.log('\n2. Getting cart items...');
    const cartResponse = await getCartItems(token);
    console.log('Cart response:', cartResponse);
    
    if (cartResponse.data) {
      console.log('✅ Cart items retrieved successfully');
      console.log('Number of items:', cartResponse.data.length);
      
      // Check each item's structure
      console.log('\n=== CART ITEM STRUCTURE ANALYSIS ===');
      cartResponse.data.forEach((item, index) => {
        console.log(`Item ${index + 1}:`);
        console.log('  ID:', item.id);
        console.log('  Product ID:', item.productId);
        console.log('  Product Name:', item.productName);
        console.log('  Quantity:', item.quantity);
        console.log('  Price:', item.price);
        
        // Check for missing fields
        const requiredFields = ['id', 'productId', 'productName', 'quantity', 'price'];
        const missingFields = requiredFields.filter(field => !(field in item));
        
        if (missingFields.length > 0) {
          console.log('  ❌ MISSING FIELDS:', missingFields);
        } else {
          console.log('  ✅ ALL REQUIRED FIELDS PRESENT');
        }
      });
      
      // Simulate order creation data mapping
      console.log('\n=== SIMULATING ORDER CREATION DATA MAPPING ===');
      const orderItems = cartResponse.data.map(item => ({
        productId: item.productId,
        quantity: item.quantity
      }));
      
      console.log('Order items to be sent:', orderItems);
      
      // Check for undefined product IDs
      const itemsWithUndefinedProductId = orderItems.filter(item => !item.productId);
      if (itemsWithUndefinedProductId.length > 0) {
        console.log('❌ ITEMS WITH UNDEFINED PRODUCT ID:', itemsWithUndefinedProductId);
      } else {
        console.log('✅ ALL PRODUCT IDS ARE DEFINED');
      }
    } else {
      console.log('❌ No cart data received');
    }
  } catch (error) {
    console.error('❌ Error in simulation:', error);
  }
}

simulateCheckout();