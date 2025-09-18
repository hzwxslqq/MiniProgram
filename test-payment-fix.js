// Test script to verify payment interface fix
const api = require('./utils/api.js');

console.log('Testing payment interface fix...');

// Test getting order details
api.orders.getDetail('1')
  .then(res => {
    console.log('Order data received:');
    console.log('Order Number:', res.data.orderNumber);
    console.log('Subtotal:', res.data.subtotal);
    console.log('Shipping Fee:', res.data.shippingFee);
    console.log('Total Amount:', res.data.totalAmount);
    
    console.log('\nItems:');
    res.data.items.forEach((item, index) => {
      console.log(`  Item ${index + 1}: ${item.productName} x ${item.quantity} @ $${item.price}`);
    });
    
    console.log('\nPayment interface fix verification: SUCCESS');
  })
  .catch(err => {
    console.error('Error:', err);
    console.log('\nPayment interface fix verification: FAILED');
  });