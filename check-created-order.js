// Check the recently created order to see what's in the database
const { pool } = require('./backend/utils/mysql');

async function checkCreatedOrder() {
  try {
    console.log('=== CHECKING RECENTLY CREATED ORDER ===');
    
    // Get the most recent order
    const [rows] = await pool.execute('SELECT * FROM orders ORDER BY id DESC LIMIT 1');
    
    if (rows.length > 0) {
      const order = rows[0];
      console.log('Most recent order:');
      console.log('ID:', order.id);
      console.log('Order Number:', order.order_number);
      console.log('Items (raw):', order.items);
      console.log('Subtotal:', order.subtotal);
      console.log('Shipping Fee:', order.shipping_fee);
      console.log('Total Amount:', order.total_amount);
      
      // Parse items to see the structure
      const parsedItems = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
      console.log('\nParsed items:');
      console.log(parsedItems);
      
      if (parsedItems && Array.isArray(parsedItems)) {
        parsedItems.forEach((item, index) => {
          console.log(`Item ${index + 1}:`);
          console.log('  Product ID:', item.productId);
          console.log('  Product Name:', item.productName);
          console.log('  Quantity:', item.quantity);
          console.log('  Price:', item.price);
          console.log('  Price type:', typeof item.price);
        });
      }
    } else {
      console.log('No orders found');
    }
    
    // Close the connection
    await pool.end();
  } catch (error) {
    console.error('Error checking order:', error);
  }
}

checkCreatedOrder();