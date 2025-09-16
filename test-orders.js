// Test script to check order filtering
const fs = require('fs');

// Read the database file
const dbContent = fs.readFileSync('c:\\02WorkSpace\\SourceCode\\MimiProgram\\backend\\data\\db.json', 'utf8');
const db = JSON.parse(dbContent);

// Get all orders
const orders = db.orders;

// Filter orders with status 'paid'
const paidOrders = orders.filter(order => order.status === 'paid');

// Filter orders with status 'pending'
const pendingOrders = orders.filter(order => order.status === 'pending');

// Filter orders with status 'shipped'
const shippedOrders = orders.filter(order => order.status === 'shipped');

// Filter orders with status 'delivered'
const deliveredOrders = orders.filter(order => order.status === 'delivered');

console.log('Total orders:', orders.length);
console.log('Paid orders:', paidOrders.length);
console.log('Pending orders:', pendingOrders.length);
console.log('Shipped orders:', shippedOrders.length);
console.log('Delivered orders:', deliveredOrders.length);

// Check a specific order
const testOrder = orders.find(order => order.orderNumber === 'ORD-20250916-109');
console.log('Test order:', testOrder);