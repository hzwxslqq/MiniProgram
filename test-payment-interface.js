// Test script to verify payment interface data format
const http = require('http');

// Test the backend API directly to verify data format
const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/orders/1',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
};

console.log('Testing payment interface data format...');

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
        const order = response.data;
        console.log('\n=== PAYMENT INTERFACE FIELD CHECK ===');
        console.log('orderNumber:', order.orderNumber);
        console.log('items:', order.items);
        console.log('subtotal:', order.subtotal);
        console.log('shippingFee:', order.shippingFee);
        console.log('totalAmount:', order.totalAmount);
        
        // Check if all required fields are present
        const requiredFields = ['orderNumber', 'items', 'subtotal', 'shippingFee', 'totalAmount'];
        const missingFields = requiredFields.filter(field => !(field in order));
        
        if (missingFields.length === 0) {
          console.log('\n✅ ALL REQUIRED FIELDS ARE PRESENT');
        } else {
          console.log('\n❌ MISSING FIELDS:', missingFields);
        }
        
        // Check items format
        if (order.items && Array.isArray(order.items)) {
          console.log('\n=== ITEM FORMAT CHECK ===');
          order.items.forEach((item, index) => {
            console.log(`Item ${index + 1}:`);
            console.log('  productId:', item.productId);
            console.log('  productName:', item.productName);
            console.log('  quantity:', item.quantity);
            console.log('  price:', item.price);
          });
        }
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