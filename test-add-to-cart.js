// Test script to add an item to cart
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

// Add item to cart
async function addToCart(token, productId, quantity) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      productId: productId,
      quantity: quantity
    });
    
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/cart',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
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
    
    req.write(postData);
    req.end();
  });
}

// Test the process
async function testAddToCart() {
  try {
    console.log('=== TESTING ADD TO CART ===');
    
    // Get authentication token
    console.log('1. Getting authentication token...');
    const token = await getAuthToken();
    console.log('✅ Token obtained:', token.substring(0, 20) + '...');
    
    // Add item to cart
    console.log('\n2. Adding item to cart...');
    const productId = '1'; // Wireless Headphones
    const quantity = 1;
    
    const response = await addToCart(token, productId, quantity);
    console.log('Add to cart response:', response);
    
    if (response && response.data) {
      console.log('✅ Item added to cart successfully');
      console.log('Item details:');
      console.log('  ID:', response.data.id);
      console.log('  Product ID:', response.data.productId);
      console.log('  Product Name:', response.data.productName);
      console.log('  Quantity:', response.data.quantity);
      console.log('  Price:', response.data.price);
    } else {
      console.log('❌ Failed to add item to cart');
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testAddToCart();