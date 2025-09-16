const axios = require('axios');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

// Test the orders API with authentication
async function testOrdersAPI() {
  try {
    console.log('Testing orders API with authentication...');
    
    // First, let's login to get a token
    // Read the database to get the admin user
    const dbPath = path.join(__dirname, 'data', 'db.json');
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    const adminUser = dbData.users[0];
    
    console.log('Admin user:', adminUser.username);
    
    // Login with admin credentials
    const loginResponse = await axios.post('http://localhost:3000/api/auth/login', {
      username: 'admin',
      password: 'admin123'
    });
    
    console.log('Login successful, token received');
    const token = loginResponse.data.token;
    
    // Now test the orders API with the token
    const response = await axios.get('http://localhost:3000/api/orders', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('Orders API response status:', response.status);
    console.log('Number of orders:', response.data.data.length);
    
    // Check if our specific order is in the response
    const orders = response.data.data;
    const targetOrder = orders.find(order => order.orderNumber === 'ORD-20250916-294');
    
    if (targetOrder) {
      console.log('Found target order:', targetOrder);
    } else {
      console.log('Target order not found in API response');
      console.log('All orders:', orders.map(o => o.orderNumber));
    }
    
    // Test getting a specific order
    if (targetOrder) {
      console.log('\nTesting specific order retrieval...');
      const orderResponse = await axios.get(`http://localhost:3000/api/orders/${targetOrder.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Specific order response:', orderResponse.data);
    }
  } catch (error) {
    console.error('Error testing orders API:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testOrdersAPI();