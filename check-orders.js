const { pool } = require('./backend/utils/mysql');

async function checkOrders() {
  try {
    // Check all orders
    const [orders] = await pool.execute('SELECT * FROM orders');
    console.log('All orders:', orders);
    
    // Check all cart items
    const [cartItems] = await pool.execute('SELECT * FROM cart_items');
    console.log('All cart items:', cartItems);
    
    // Check the specific user we're testing with
    const testUserId = '1758111795112';
    const [userOrders] = await pool.execute('SELECT * FROM orders WHERE user_id = ?', [testUserId]);
    console.log('Orders for test user:', userOrders);
    
    const [userCartItems] = await pool.execute('SELECT * FROM cart_items WHERE user_id = ?', [testUserId]);
    console.log('Cart items for test user:', userCartItems);
  } catch (error) {
    console.error('Error checking database:', error);
  }
}

checkOrders();