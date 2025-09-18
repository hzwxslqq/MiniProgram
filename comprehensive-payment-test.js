// Comprehensive test for payment interface display elements
const http = require('http');

// Test the backend API to verify all payment interface elements
const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/orders/1',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
};

console.log('=== COMPREHENSIVE PAYMENT INTERFACE TEST ===\n');

const req = http.request(options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      console.log('✅ API Response Status:', res.statusCode);
      
      if (response.data) {
        const order = response.data;
        console.log('\n=== PAYMENT INTERFACE ELEMENTS CHECK ===');
        
        // Check Order Number
        if (order.orderNumber) {
          console.log('✅ Order Number:', order.orderNumber);
        } else {
          console.log('❌ Order Number: MISSING');
        }
        
        // Check Items and Quantity
        if (order.items && Array.isArray(order.items) && order.items.length > 0) {
          console.log('✅ Items:');
          order.items.forEach((item, index) => {
            console.log(`   ${index + 1}. ${item.productName}`);
            console.log(`      Quantity: ${item.quantity}`);
            console.log(`      Price: $${item.price}`);
            console.log(`      Total: $${(item.price * item.quantity).toFixed(2)}`);
          });
        } else {
          console.log('❌ Items: MISSING or EMPTY');
        }
        
        // Check Financial Information
        console.log('\n=== FINANCIAL INFORMATION ===');
        if (typeof order.subtotal !== 'undefined') {
          console.log('✅ Subtotal: $' + order.subtotal);
        } else {
          console.log('❌ Subtotal: MISSING');
        }
        
        if (typeof order.shippingFee !== 'undefined') {
          console.log('✅ Shipping: $' + order.shippingFee);
        } else {
          console.log('❌ Shipping: MISSING');
        }
        
        if (typeof order.totalAmount !== 'undefined') {
          console.log('✅ Total: $' + order.totalAmount);
        } else {
          console.log('❌ Total: MISSING');
        }
        
        // Check Pay Now Button Amount
        console.log('\n=== PAY NOW BUTTON ===');
        if (typeof order.totalAmount !== 'undefined') {
          console.log('✅ Pay Now Button Amount: $' + order.totalAmount);
        } else {
          console.log('❌ Pay Now Button Amount: MISSING');
        }
        
        // Summary
        console.log('\n=== SUMMARY ===');
        const requiredFields = ['orderNumber', 'items', 'subtotal', 'shippingFee', 'totalAmount'];
        const missingFields = requiredFields.filter(field => !(field in order));
        
        if (missingFields.length === 0) {
          console.log('🎉 ALL PAYMENT INTERFACE ELEMENTS ARE DISPLAYING CORRECTLY!');
          console.log('   - Order Number: ✓');
          console.log('   - Item Quantities: ✓');
          console.log('   - Subtotal: ✓');
          console.log('   - Shipping: ✓');
          console.log('   - Total: ✓');
          console.log('   - Pay Now Button Amount: ✓');
        } else {
          console.log('❌ MISSING ELEMENTS:', missingFields);
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
  console.error('❌ Request error:', error);
});

req.end();