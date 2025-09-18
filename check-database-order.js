// Script to check the actual order data in the database
const { pool } = require('./backend/utils/mysql');

async function checkOrderData() {
  try {
    console.log('=== CHECKING ORDER DATA IN DATABASE ===');
    
    // Query the order with ID 1
    const [rows] = await pool.execute('SELECT * FROM orders WHERE id = ?', [1]);
    
    if (rows.length > 0) {
      const order = rows[0];
      console.log('Raw order data from database:');
      console.log('ID:', order.id);
      console.log('Order Number:', order.order_number);
      console.log('Items (raw):', order.items);
      console.log('Items (parsed):', typeof order.items === 'string' ? JSON.parse(order.items) : order.items);
      console.log('Subtotal:', order.subtotal);
      console.log('Shipping Fee:', order.shipping_fee);
      console.log('Total Amount:', order.total_amount);
      
      // Parse items to see the structure
      const parsedItems = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
      console.log('\nParsed items structure:');
      parsedItems.forEach((item, index) => {
        console.log(`Item ${index + 1}:`);
        console.log('  Product ID:', item.productId);
        console.log('  Product ID type:', typeof item.productId);
        console.log('  Product Name:', item.productName);
        console.log('  Quantity:', item.quantity);
        console.log('  Quantity type:', typeof item.quantity);
        console.log('  Price:', item.price);
        console.log('  Price type:', typeof item.price);
      });
    } else {
      console.log('No order found with ID 1');
    }
    
    // Close the connection
    await pool.end();
  } catch (error) {
    console.error('Error checking order data:', error);
  }
}

checkOrderData();