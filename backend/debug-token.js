const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

// Debug the token to see what user ID it contains
async function debugToken() {
  try {
    // Read the database to get the admin user
    const dbPath = path.join(__dirname, 'data', 'db.json');
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    const adminUser = dbData.users[0];
    
    console.log('Admin user ID:', adminUser.id);
    console.log('Admin username:', adminUser.username);
    
    // Generate a token for the admin user
    const token = jwt.sign(
      { id: adminUser.id, username: adminUser.username },
      process.env.JWT_SECRET || 'online-store-secret-key',
      { expiresIn: '7d' }
    );
    
    console.log('Generated token:', token);
    
    // Decode the token to see what's in it
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'online-store-secret-key');
    console.log('Decoded token:', decoded);
    
    // Now let's manually check the order in the database
    const targetOrder = dbData.orders.find(order => order.orderNumber === 'ORD-20250916-294');
    console.log('Target order:', targetOrder);
    console.log('Target order userId:', targetOrder.userId);
    console.log('Target order userId type:', typeof targetOrder.userId);
    console.log('Admin user ID type:', typeof adminUser.id);
    console.log('IDs match:', targetOrder.userId == adminUser.id);
    console.log('IDs match (strict):', targetOrder.userId === adminUser.id);
  } catch (error) {
    console.error('Error debugging token:', error);
  }
}

debugToken();