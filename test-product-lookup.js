// Test product lookup functionality
const { pool } = require('./backend/utils/mysql');
const Product = require('./backend/models/mysql/Product');

async function testProductLookup() {
  try {
    console.log('=== TESTING PRODUCT LOOKUP ===');
    
    // Test 1: Check if we can connect to the database
    console.log('1. Testing database connection...');
    const [rows] = await pool.execute('SELECT COUNT(*) as count FROM products');
    console.log('Product count in database:', rows[0].count);
    
    // Test 2: Try to find product with ID 1
    console.log('\n2. Looking up product with ID 1...');
    const product = await Product.findById('1');
    console.log('Product found:', product);
    
    if (product) {
      console.log('Product details:');
      console.log('  ID:', product.id);
      console.log('  Name:', product.name);
      console.log('  Price:', product.price);
      console.log('  Type of price:', typeof product.price);
    } else {
      console.log('❌ No product found with ID 1');
      
      // Let's see what products are actually in the database
      console.log('\n3. Checking all products in database...');
      const [allProducts] = await pool.execute('SELECT * FROM products');
      console.log('All products:', allProducts);
    }
    
    // Close the connection
    await pool.end();
  } catch (error) {
    console.error('❌ Error during product lookup test:', error);
  }
}

testProductLookup();