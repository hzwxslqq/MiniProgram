// Test script to check order filtering logic
const orders = [
  { id: 1, orderNumber: 'ORD-20250916-109', status: 'paid', totalAmount: 129.99 },
  { id: 2, orderNumber: 'ORD-20250916-110', status: 'shipped', totalAmount: 129.99 },
  { id: 3, orderNumber: 'ORD-20250916-111', status: 'delivered', totalAmount: 129.99 },
  { id: 4, orderNumber: 'ORD-20250916-112', status: 'pending', totalAmount: 129.99 }
];

// Filter function similar to the one in orders.js
function filterOrders(orders, tab) {
  console.log('Filtering orders, tab:', tab);
  console.log('All orders:', orders);
  if (tab === 'all') {
    console.log('Returning all orders');
    return orders;
  }
  // Make sure we're comparing strings
  const filtered = orders.filter(order => order.status.toString() === tab.toString());
  console.log('Filtered orders:', filtered);
  return filtered;
}

console.log('Testing filter with "all" tab:');
const allOrders = filterOrders(orders, 'all');
console.log('Result:', allOrders);

console.log('\nTesting filter with "paid" tab:');
const paidOrders = filterOrders(orders, 'paid');
console.log('Result:', paidOrders);

console.log('\nTesting filter with "shipped" tab:');
const shippedOrders = filterOrders(orders, 'shipped');
console.log('Result:', shippedOrders);

console.log('\nTesting filter with "delivered" tab:');
const deliveredOrders = filterOrders(orders, 'delivered');
console.log('Result:', deliveredOrders);

console.log('\nTesting filter with "pending" tab:');
const pendingOrders = filterOrders(orders, 'pending');
console.log('Result:', pendingOrders);