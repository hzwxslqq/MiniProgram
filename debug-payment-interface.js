// Debug script to test the actual WeChat Mini-Program payment interface
// This simulates what happens in the WeChat environment

const api = {
  orders: {
    getDetail: function(orderId) {
      return new Promise((resolve, reject) => {
        // Simulate the actual API call that the WeChat Mini-Program makes
        const http = require('http');
        
        const options = {
          hostname: 'localhost',
          port: 3000,
          path: `/api/orders/${orderId}`,
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
              const response = JSON.parse(data);
              console.log('API Response:', response);
              
              // This is what the WeChat Mini-Program receives
              resolve(response);
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
  }
};

// Simulate the payment page logic
class PaymentPage {
  constructor() {
    this.data = {
      order: null,
      orderId: '',
      loading: false,
      paymentProcessing: false,
      termsAccepted: false
    };
  }
  
  // Simulate onLoad function
  onLoad(options) {
    console.log('Payment page loaded with options:', options);
    if (options.orderId) {
      this.setData({
        orderId: options.orderId
      });
      this.loadOrderDetails(options.orderId);
    }
  }
  
  // Simulate setData function
  setData(newData) {
    Object.assign(this.data, newData);
    console.log('Data updated:', this.data);
    
    // Check if order data is properly set
    if (newData.order) {
      console.log('\n=== ORDER DATA VERIFICATION ===');
      console.log('Order object keys:', Object.keys(newData.order));
      console.log('Order Number:', newData.order.orderNumber);
      console.log('Items:', newData.order.items);
      console.log('Subtotal:', newData.order.subtotal);
      console.log('Shipping Fee:', newData.order.shippingFee);
      console.log('Total Amount:', newData.order.totalAmount);
      
      // Verify all required fields are present
      const requiredFields = ['orderNumber', 'items', 'subtotal', 'shippingFee', 'totalAmount'];
      const missingFields = requiredFields.filter(field => !(field in newData.order));
      
      if (missingFields.length === 0) {
        console.log('\n✅ ALL REQUIRED FIELDS PRESENT IN ORDER DATA');
      } else {
        console.log('\n❌ MISSING FIELDS:', missingFields);
      }
    }
  }
  
  // Simulate loadOrderDetails function
  loadOrderDetails(orderId) {
    this.setData({ loading: true });
    
    // Fetch order details from the API
    api.orders.getDetail(orderId)
      .then(res => {
        console.log('\n=== API RESPONSE ANALYSIS ===');
        console.log('Full response:', res);
        console.log('Response data keys:', Object.keys(res.data));
        console.log('Order data type:', typeof res.data);
        
        this.setData({
          order: res.data,
          loading: false
        });
        
        console.log('\n=== TEMPLATE DATA MAPPING ===');
        console.log('Template would receive:');
        console.log('- order.orderNumber:', res.data.orderNumber);
        console.log('- order.items:', res.data.items);
        console.log('- order.subtotal:', res.data.subtotal);
        console.log('- order.shippingFee:', res.data.shippingFee);
        console.log('- order.totalAmount:', res.data.totalAmount);
        
        // Simulate how the WXML template would display this data
        console.log('\n=== WXML TEMPLATE DISPLAY SIMULATION ===');
        console.log('Order #{{order.orderNumber}} would display as: Order #' + res.data.orderNumber);
        console.log('{{order.subtotal}} would display as: ' + res.data.subtotal);
        console.log('{{order.shippingFee}} would display as: ' + res.data.shippingFee);
        console.log('{{order.totalAmount}} would display as: ' + res.data.totalAmount);
        console.log('Pay Now - ${{order.totalAmount}} would display as: Pay Now - $' + res.data.totalAmount);
        
        if (res.data.items && Array.isArray(res.data.items)) {
          console.log('\nItems would display as:');
          res.data.items.forEach((item, index) => {
            console.log(`  ${index + 1}. {{item.productName}}: ${item.productName}`);
            console.log(`     Quantity: {{item.quantity}}: ${item.quantity}`);
          });
        }
      })
      .catch(err => {
        console.error('Failed to load order details:', err);
        this.setData({ loading: false });
      });
  }
}

// Run the debug simulation
console.log('=== WECHAT MINI-PROGRAM PAYMENT INTERFACE DEBUG ===\n');

const paymentPage = new PaymentPage();
paymentPage.onLoad({ orderId: '1' });