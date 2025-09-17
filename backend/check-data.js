const { pool } = require('./utils/mysql');

async function checkData() {
  try {
    const [userRows] = await pool.execute('SELECT COUNT(*) as count FROM users');
    console.log('Users in MySQL:', userRows[0].count);
    
    const [productRows] = await pool.execute('SELECT COUNT(*) as count FROM products');
    console.log('Products in MySQL:', productRows[0].count);
    
    const [cartRows] = await pool.execute('SELECT COUNT(*) as count FROM cart_items');
    console.log('Cart items in MySQL:', cartRows[0].count);
    
    const [orderRows] = await pool.execute('SELECT COUNT(*) as count FROM orders');
    console.log('Orders in MySQL:', orderRows[0].count);
    
    process.exit(0);
  } catch (error) {
    console.error('Error checking data:', error);
    process.exit(1);
  }
}

checkData();