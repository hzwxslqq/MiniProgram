const Order = require('./models/Order');

// Test the Order.find method directly
async function testDirectOrder() {
  try {
    console.log('Testing Order.find method directly...');
    
    // Test with string userId
    const orders1 = await Order.find({ userId: '1' });
    console.log('Orders with userId "1":', orders1.length);
    
    // Test with number userId
    const orders2 = await Order.find({ userId: 1 });
    console.log('Orders with userId 1:', orders2.length);
    
    // Test getting all orders and filtering manually
    const allOrders = await Order.find({});
    console.log('Total orders:', allOrders.length);
    
    // Filter manually with loose equality
    const userOrders = allOrders.filter(order => order.userId == '1');
    console.log('User orders (loose equality):', userOrders.length);
    
    // Check if our target order is in the results
    const targetOrder = allOrders.find(order => order.orderNumber === 'ORD-20250916-294');
    console.log('Target order:', targetOrder ? 'Found' : 'Not found');
    if (targetOrder) {
      console.log('Target order userId:', targetOrder.userId);
      console.log('Target order userId type:', typeof targetOrder.userId);
    }
  } catch (error) {
    console.error('Error testing Order.find:', error);
  }
}

testDirectOrder();