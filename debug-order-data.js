// Debug script to check actual order data structure
const fs = require('fs');
const path = require('path');

// Read the database file directly
const dbPath = path.join(__dirname, 'backend', 'data', 'db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// Get the first order
const order = db.orders[0];
console.log('Order data structure:');
console.log(JSON.stringify(order, null, 2));

console.log('\nOrder items structure:');
order.items.forEach((item, index) => {
  console.log(`Item ${index + 1}:`);
  console.log(`  productName: ${item.productName}`);
  console.log(`  quantity: ${item.quantity}`);
  console.log(`  price: ${item.price}`);
  console.log(`  productImage: ${item.productImage}`);
});

console.log('\nOrder financial data:');
console.log(`  subtotal: ${order.subtotal}`);
console.log(`  shippingFee: ${order.shippingFee}`);
console.log(`  totalAmount: ${order.totalAmount}`);
console.log(`  orderNumber: ${order.orderNumber}`);