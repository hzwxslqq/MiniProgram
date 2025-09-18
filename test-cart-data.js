// Test script to check cart data structure
const http = require('http');

// Test the cart API to see what data structure is returned
const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/cart',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
};

console.log('Testing cart data structure...');

const req = http.request(options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      console.log('Response status:', res.statusCode);
      console.log('Response headers:', res.headers);
      console.log('Response body:', JSON.stringify(response, null, 2));
      
      // Check if the response has the expected fields
      if (response.data) {
        console.log('\n=== CART DATA STRUCTURE ANALYSIS ===');
        console.log('Number of cart items:', response.data.length);
        
        response.data.forEach((item, index) => {
          console.log(`\nItem ${index + 1}:`);
          console.log('  ID:', item.id);
          console.log('  Product ID:', item.productId);
          console.log('  Product Name:', item.productName);
          console.log('  Product Image:', item.productImage);
          console.log('  Price:', item.price);
          console.log('  Quantity:', item.quantity);
          console.log('  Selected:', item.selected);
          
          // Check for missing fields
          const requiredFields = ['id', 'productId', 'productName', 'productImage', 'price', 'quantity'];
          const missingFields = requiredFields.filter(field => !(field in item));
          
          if (missingFields.length > 0) {
            console.log('  ❌ MISSING FIELDS:', missingFields);
          } else {
            console.log('  ✅ ALL REQUIRED FIELDS PRESENT');
          }
        });
      } else {
        console.log('❌ No data in response');
      }
    } catch (error) {
      console.error('Error parsing response:', error);
      console.log('Raw response:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('Request error:', error);
});

req.end();