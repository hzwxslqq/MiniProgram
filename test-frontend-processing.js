// Test script to simulate frontend data processing
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
        // Note: We're not including Authorization header like the frontend would
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

// Simulate the formatDate function from orders.js
function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString();
}

// Simulate the getStatusText function from orders.js
function getStatusText(status) {
  switch (status) {
    case 'pending': return 'Pending Payment';
    case 'paid': return 'Paid';
    case 'shipped': return 'Shipped';
    case 'delivered': return 'Delivered';
    case 'cancelled': return 'Cancelled';
    default: return 'Unknown';
  }
}

// Simulate the filterOrders function from orders.js
function filterOrders(orders, tab) {
  console.log('Filtering orders, tab:', tab);
  console.log('All orders:', orders);
  if (tab === 'all') {
    console.log('Returning all orders');
    return orders;
  }
  // Make sure we're comparing strings
  const filtered = orders.filter(order => order.status.toString() === tab.toString());
  console.log('Filtered orders:', filtered);
  return filtered;
}

// Simulate the data transformation from orders.js
function transformOrders(apiOrders) {
  return apiOrders.map(order => ({
    id: order.id,
    orderNumber: order.orderNumber,
    status: order.status,
    statusText: getStatusText(order.status),
    totalAmount: order.totalAmount,
    items: order.items.map((item, index) => ({
      id: index, // Use index as id for list rendering
      name: item.productName,
      image: item.productImage,
      price: item.price,
      quantity: item.quantity
    })),
    trackingNumber: order.trackingNumber || '',
    estimatedDelivery: order.estimatedDelivery || '',
    createdAt: formatDate(order.createdAt)
  }));
}

// Test the complete frontend processing
fetchOrders()
  .then(response => {
    console.log('API Response:');
    console.log('Message:', response.message);
    console.log('Number of orders:', response.data.length);
    
    // Transform the data like the frontend does
    const transformedOrders = transformOrders(response.data);
    console.log('Transformed orders count:', transformedOrders.length);
    
    // Find our test order in transformed data
    const testOrder = transformedOrders.find(order => order.orderNumber === 'ORD-20250916-109');
    console.log('Test order in transformed data:', testOrder);
    
    // Filter orders like the frontend does (default tab is 'all')
    const filteredOrders = filterOrders(transformedOrders, 'all');
    console.log('Filtered orders count:', filteredOrders.length);
    
    // Check if our test order is in the filtered data
    const testOrderInFiltered = filteredOrders.find(order => order.orderNumber === 'ORD-20250916-109');
    console.log('Test order in filtered data:', testOrderInFiltered);
  })
  .catch(error => {
    console.error('Error fetching orders:', error);
  });