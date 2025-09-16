// Test script to simulate frontend API call with headers like the real frontend would use
const http = require('http');

// Simulate the getHeaders function from api.js
function getHeaders() {
  // Simulate no token (like a fresh app start)
  const token = null; // This is what happens when there's no token
  const headers = {
    'Content-Type': 'application/json'
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
}

// Function to make API call like the frontend does
function fetchOrders() {
  return new Promise((resolve, reject) => {
    const headers = getHeaders();
    
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/orders',
      method: 'GET',
      headers: headers
    };

    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          console.log(`Status: ${res.statusCode}`);
          console.log(`Headers: ${JSON.stringify(res.headers)}`);
          resolve({ status: res.statusCode, data: jsonData });
        } catch (error) {
          reject(error);
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.end();
  });
}

// Test the API call
fetchOrders()
  .then(response => {
    console.log('API Call Success:');
    console.log('Status:', response.status);
    console.log('Message:', response.data.message);
    console.log('Number of orders:', response.data.data.length);
    
    // Find our test order
    const testOrder = response.data.data.find(order => order.orderNumber === 'ORD-20250916-109');
    console.log('Test order found:', testOrder ? 'Yes' : 'No');
    
    if (testOrder) {
      console.log('Test order details:', {
        orderNumber: testOrder.orderNumber,
        status: testOrder.status,
        totalAmount: testOrder.totalAmount
      });
    }
  })
  .catch(error => {
    console.error('API Call Error:', error);
  });