const fs = require('fs');
const path = require('path');
const User = require('./models/User');

// Read database directly
const readDB = () => {
  const dbPath = path.join(__dirname, 'data', 'db.json');
  if (!fs.existsSync(dbPath)) {
    return {};
  }
  
  const data = fs.readFileSync(dbPath, 'utf8');
  return JSON.parse(data);
};

async function debugLogin() {
  console.log('Reading database...');
  const dbData = readDB();
  console.log('Users in database:', dbData.users);
  
  if (dbData.users && dbData.users.length > 0) {
    const user = new User(dbData.users[0]);
    console.log('First user object:', user);
    
    console.log('Checking password...');
    try {
      const isPasswordValid = await user.comparePassword('admin123');
      console.log('Password valid:', isPasswordValid);
    } catch (error) {
      console.error('Password check error:', error);
    }
  } else {
    console.log('No users found in database');
  }
}

debugLogin();