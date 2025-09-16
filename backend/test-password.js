const bcrypt = require('bcryptjs');

// Test the password hash
async function testPassword() {
  const hash = '$2a$10$8K1p/a0dhrxiowP.dnkgNORTWgdEDHn5L2/xjpEWuC.QQv4rKO9jO';
  const password = 'admin123';
  
  console.log('Testing password:', password);
  console.log('Against hash:', hash);
  
  try {
    const isMatch = await bcrypt.compare(password, hash);
    console.log('Password matches:', isMatch);
    
    // Also test with a wrong password
    const isMatchWrong = await bcrypt.compare('wrongpassword', hash);
    console.log('Wrong password matches:', isMatchWrong);
  } catch (error) {
    console.error('Error comparing passwords:', error);
  }
}

testPassword();