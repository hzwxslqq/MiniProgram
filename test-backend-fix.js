// Test script to verify backend fix for payment interface
const http = require('http');

console.log('Testing backend fix for payment interface...');

// Test getting order details directly via HTTP
const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/orders/1',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
};

const req = http.request(options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Raw response data:', data);
    try {
      const response = JSON.parse(data);
      console.log('Response status:', res.statusCode);
      console.log('Order data received:');
      
      if (response.data) {
        console.log('Order Number:', response.data.orderNumber);
        console.log('Subtotal:', response.data.subtotal);
        console.log('Shipping Fee:', response.data.shippingFee);
        console.log('Total Amount:', response.data.totalAmount);
        
        console.log('\nItems:');
        if (response.data.items) {
          response.data.items.forEach((item, index) => {
            console.log(`  Item ${index + 1}: ${item.productName} x ${item.quantity} @ $${item.price}`);
          });
        }
        
        // Check if all required fields are present
        const hasOrderNumber = response.data.orderNumber !== undefined;
        const hasSubtotal = response.data.subtotal !== undefined;
        const hasShippingFee = response.data.shippingFee !== undefined;
        const hasTotalAmount = response.data.totalAmount !== undefined;
        const hasItems = response.data.items !== undefined;
        
        if (hasOrderNumber && hasSubtotal && hasShippingFee && hasTotalAmount && hasItems) {
          console.log('\nPayment interface fix verification: SUCCESS');
        } else {
          console.log('\nPayment interface fix verification: FAILED');
          console.log('Missing fields:');
          if (!hasOrderNumber) console.log('  - orderNumber');
          if (!hasSubtotal) console.log('  - subtotal');
          if (!hasShippingFee) console.log('  - shippingFee');
          if (!hasTotalAmount) console.log('  - totalAmount');
          if (!hasItems) console.log('  - items');
        }
      } else {
        console.log('No data in response');
        console.log('\nPayment interface fix verification: FAILED');
      }
    } catch (error) {
      console.error('Error parsing response:', error);
      console.log('\nPayment interface fix verification: FAILED');
    }
  });
});

req.on('error', (error) => {
  console.error('Request error:', error);
  console.log('\nPayment interface fix verification: FAILED');
});

req.end();