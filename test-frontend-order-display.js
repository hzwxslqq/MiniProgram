// Test script to verify order interface data transformation
const fs = require('fs');

// Mock API response data (simulating what the backend might return)
const mockApiResponse = {
  data: [
    {
      id: 1,
      order_number: 'ORD-20230101-001',
      status: 'delivered',
      total_amount: 129.99,
      items: [
        {
          product_name: 'Wireless Headphones',
          product_image: '/images/product1.png',
          price: 129.99,
          quantity: 1
        }
      ],
      tracking_number: 'TRK123456789',
      estimated_delivery: '2023-01-15',
      created_at: '2023-01-01T10:00:00Z'
    },
    {
      id: 2,
      orderNumber: 'ORD-20230102-002',
      status: 'shipped',
      totalAmount: 239.97,
      items: [
        {
          name: 'Bluetooth Speaker',
          image: '/images/product3.png',
          price: 79.99,
          quantity: 2
        },
        {
          name: 'Phone Case',
          image: '/images/product4.png',
          price: 24.99,
          quantity: 1
        }
      ],
      trackingNumber: 'TRK987654321',
      estimatedDelivery: '2023-01-20',
      createdAt: '2023-01-02T14:30:00Z'
    }
  ]
};

// Simulate the data transformation logic from orders.js
function transformOrderData(apiResponse) {
  return apiResponse.data.map(order => {
    // Ensure we're working with the correct data structure
    const orderData = order.data || order;
    
    return {
      id: orderData.id,
      orderNumber: orderData.order_number || orderData.orderNumber,
      status: orderData.status,
      statusText: getStatusText(orderData.status),
      totalAmount: orderData.total_amount !== undefined ? orderData.total_amount : orderData.totalAmount,
      items: Array.isArray(orderData.items) ? orderData.items.map((item, index) => {
        // Handle both database and frontend item structures
        const itemData = item.data || item;
        return {
          id: `${orderData.id}-${index}`, // Use unique id for list rendering
          name: itemData.product_name || itemData.productName || itemData.name,
          image: itemData.product_image || itemData.productImage || itemData.image || '/images/default-product.png',
          price: itemData.price,
          quantity: itemData.quantity
        };
      }) : [],
      trackingNumber: orderData.tracking_number || orderData.trackingNumber || '',
      estimatedDelivery: orderData.estimated_delivery || orderData.estimatedDelivery || '',
      createdAt: formatDate(orderData.created_at || orderData.createdAt)
    };
  });
}

// Format date for display
function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString();
}

// Get status text based on status
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

// Test the transformation
console.log('Testing order data transformation...');
const transformedData = transformOrderData(mockApiResponse);

console.log('Transformed order data:');
transformedData.forEach((order, index) => {
  console.log(`\nOrder ${index + 1}:`);
  console.log(`  ID: ${order.id}`);
  console.log(`  Order Number: ${order.orderNumber}`);
  console.log(`  Status: ${order.status} (${order.statusText})`);
  console.log(`  Total Amount: $${order.totalAmount}`);
  console.log(`  Created At: ${order.createdAt}`);
  console.log(`  Tracking Number: ${order.trackingNumber}`);
  console.log(`  Estimated Delivery: ${order.estimatedDelivery}`);
  console.log(`  Items:`);
  order.items.forEach((item, itemIndex) => {
    console.log(`    ${itemIndex + 1}. ${item.name} - $${item.price} x ${item.quantity}`);
  });
});

console.log('\nTest completed successfully!');