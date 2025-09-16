const axios = require('axios');

// Test creating an order
const createTestOrder = async () => {
  try {
    const response = await axios.post('http://localhost:3000/api/orders', {
      items: [
        {
          productId: '1',
          quantity: 1
        }
      ],
      shippingAddress: {
        name: 'Test Customer',
        phone: '123456789',
        address: '123 Test St',
        city: 'Test City',
        postalCode: '12345'
      }
    });
    
    console.log('Order created successfully:', response.data);
    
    // Process payment for the order
    const orderId = response.data.data.id;
    const paymentResponse = await axios.post(`http://localhost:3000/api/orders/${orderId}/payment`, {
      paymentMethod: 'wechat'
    });
    
    console.log('Payment processed successfully:', paymentResponse.data);
  } catch (error) {
    console.error('Error creating order:', error.response ? error.response.data : error.message);
  }
};

createTestOrder();