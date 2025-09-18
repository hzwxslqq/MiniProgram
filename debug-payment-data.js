// Debug script to check actual API response structure
const api = require('./utils/api.js');

// Mock getting order details to see actual data structure
console.log('Debugging payment data structure...');

// Simulate what the payment page does
const orderId = '1'; // Test with a known order ID

console.log('This script would normally make an API call to:');
console.log(`GET http://localhost:3000/api/orders/${orderId}`);
console.log('');
console.log('Expected response structure should include:');
console.log('- orderNumber (or order_number)');
console.log('- items array with productName, quantity, price');
console.log('- subtotal');
console.log('- shippingFee (or shipping_fee)');
console.log('- totalAmount (or total_amount)');
console.log('');
console.log('The issue is likely in the data mapping between backend response and frontend display.');