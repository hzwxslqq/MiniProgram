// Test script to simulate frontend API calls
const http = require('http');

// Function to make API call
function fetchOrders() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/orders',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve(jsonData);
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
    console.log('API Response:');
    console.log('Message:', response.message);
    console.log('Number of orders:', response.data.length);
    
    // Find our test order
    const testOrder = response.data.find(order => order.orderNumber === 'ORD-20250916-109');
    console.log('Test order found:', testOrder);
    
    // Count orders by status
    const statusCounts = {};
    response.data.forEach(order => {
      statusCounts[order.status] = (statusCounts[order.status] || 0) + 1;
    });
    
    console.log('Order counts by status:', statusCounts);
  })
  .catch(error => {
    console.error('Error fetching orders:', error);
  });