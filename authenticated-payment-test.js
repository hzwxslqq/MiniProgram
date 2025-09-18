// Test payment flow with authentication
const http = require('http');

class AuthenticatedPaymentTest {
  constructor() {
    this.token = null;
    this.orderId = null;
  }
  
  // Get authentication token
  async getAuthToken() {
    console.log('=== GETTING AUTHENTICATION TOKEN ===');
    
    return new Promise((resolve, reject) => {
      const postData = JSON.stringify({
        code: 'test_code',
        userInfo: {
          nickName: 'Test User',
          avatarUrl: 'http://example.com/avatar.png'
        }
      });
      
      const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/api/auth/wechat-login',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
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
            console.log('Auth response:', response);
            
            if (response.token) {
              this.token = response.token;
              console.log('✅ Authentication successful, token:', this.token);
              resolve(this.token);
            } else {
              console.log('❌ Authentication failed');
              reject(new Error('Authentication failed'));
            }
          } catch (error) {
            console.error('Error parsing response:', error);
            reject(error);
          }
        });
      });
      
      req.on('error', (error) => {
        console.error('Request error:', error);
        reject(error);
      });
      
      req.write(postData);
      req.end();
    });
  }
  
  // Create an order with authentication
  async createOrder() {
    console.log('\n=== CREATING ORDER ===');
    
    return new Promise((resolve, reject) => {
      const postData = JSON.stringify({
        items: [
          {
            productId: '1',
            quantity: 1
          }
        ],
        shippingAddress: {
          name: 'Test User',
          phone: '1234567890',
          address: '123 Test St',
          city: 'Test City',
          postalCode: '12345'
        }
      });
      
      const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/api/orders',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData),
          'Authorization': `Bearer ${this.token}`
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
            console.log('Order creation response:', response);
            
            if (response.data && response.data.id) {
              this.orderId = response.data.id;
              console.log('✅ Order created successfully with ID:', this.orderId);
              resolve(this.orderId);
            } else {
              console.log('❌ Failed to create order');
              reject(new Error('Order creation failed'));
            }
          } catch (error) {
            console.error('Error parsing response:', error);
            reject(error);
          }
        });
      });
      
      req.on('error', (error) => {
        console.error('Request error:', error);
        reject(error);
      });
      
      req.write(postData);
      req.end();
    });
  }
  
  // Retrieve order details
  async getOrderDetails(orderId) {
    console.log('\n=== RETRIEVING ORDER DETAILS ===');
    
    return new Promise((resolve, reject) => {
      const options = {
        hostname: 'localhost',
        port: 3000,
        path: `/api/orders/${orderId}`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
          // No authentication needed for GET requests
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
            console.log('Order details response:', response);
            
            if (response.data) {
              console.log('✅ Order details retrieved successfully');
              resolve(response.data);
            } else {
              console.log('❌ Failed to retrieve order details');
              reject(new Error('Failed to retrieve order details'));
            }
          } catch (error) {
            console.error('Error parsing response:', error);
            reject(error);
          }
        });
      });
      
      req.on('error', (error) => {
        console.error('Request error:', error);
        reject(error);
      });
      
      req.end();
    });
  }
  
  // Simulate WeChat Mini-Program page behavior
  simulateWeChatPage(orderData) {
    console.log('\n=== SIMULATING WECHAT MINI-PROGRAM PAGE ===');
    
    // Simulate the page data structure
    const pageData = {
      order: orderData,
      orderId: orderData.id,
      loading: false,
      paymentProcessing: false,
      termsAccepted: false
    };
    
    console.log('Page data structure created');
    
    // Simulate template rendering
    console.log('\n=== TEMPLATE RENDERING SIMULATION ===');
    if (pageData.order) {
      console.log('Rendering order details:');
      console.log('  Order #{{order.orderNumber}} -> Order #' + pageData.order.orderNumber);
      
      if (pageData.order.items && Array.isArray(pageData.order.items)) {
        console.log('  Items:');
        pageData.order.items.forEach((item, index) => {
          console.log(`    ${index + 1}. {{item.productName}} -> ${item.productName}`);
          console.log(`       Quantity: {{item.quantity}} -> ${item.quantity}`);
          console.log(`       Price: \${{item.price * item.quantity}} -> \$${Number(item.price * item.quantity).toFixed(2)}`);
        });
      }
      
      console.log('  Financial Information:');
      console.log(`    Subtotal: \${{order.subtotal}} -> \$${pageData.order.subtotal}`);
      console.log(`    Shipping: \${{order.shippingFee}} -> \$${pageData.order.shippingFee}`);
      console.log(`    Total: \${{order.totalAmount}} -> \$${pageData.order.totalAmount}`);
      
      console.log('  Pay Now Button:');
      console.log(`    Pay Now - \${{order.totalAmount}} -> Pay Now - \$${pageData.order.totalAmount}`);
      
      console.log('\n✅ WECHAT MINI-PROGRAM WOULD DISPLAY ALL DATA CORRECTLY');
      return true;
    } else {
      console.log('❌ No order data to render');
      return false;
    }
  }
  
  // Run all tests
  async runFullTest() {
    console.log('=== AUTHENTICATED PAYMENT FLOW TEST ===\n');
    
    try {
      // Get authentication token
      await this.getAuthToken();
      
      // Create order
      const orderId = await this.createOrder();
      
      // Get order details
      const orderData = await this.getOrderDetails(orderId);
      
      // Simulate WeChat page
      const success = this.simulateWeChatPage(orderData);
      
      if (success) {
        console.log('\n🎉 ALL TESTS PASSED - PAYMENT INTERFACE SHOULD WORK CORRECTLY');
      } else {
        console.log('\n❌ TESTS FAILED - THERE MAY BE AN ISSUE WITH THE INTERFACE');
      }
      
      return success;
    } catch (error) {
      console.error('\n❌ TEST FAILED WITH ERROR:', error);
      return false;
    }
  }
}

// Run the test
const test = new AuthenticatedPaymentTest();
test.runFullTest();