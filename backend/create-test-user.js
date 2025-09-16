const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

// Create a new user with a known password
async function createTestUser() {
  const password = 'admin123';
  const saltRounds = 10;
  
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    
    console.log('Generated hash for "admin123":', hash);
    
    // Read existing database
    const dbPath = path.join(__dirname, 'data', 'db.json');
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Update the admin user with the new hash
    dbData.users[0].password = hash;
    
    // Write back to database
    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
    
    console.log('Updated admin user password hash in database');
    
    // Test the new hash
    const isMatch = await bcrypt.compare(password, hash);
    console.log('New hash matches password:', isMatch);
  } catch (error) {
    console.error('Error creating test user:', error);
  }
}

createTestUser();