// Payment page logic with detailed debugging for WeChat Mini-Program
const api = require('../../utils/api.js');

Page({
  data: {
    order: null,
    orderId: '',
    loading: false,
    paymentProcessing: false,
    termsAccepted: false,
    debugInfo: ''  // Added for debugging
  },

  onLoad: function(options) {
    console.log('=== PAYMENT PAGE DETAILED DEBUG ===');
    console.log('1. Page loaded with options:', options);
    
    // Add extensive debugging
    this.setData({
      debugInfo: 'Page loaded with options: ' + JSON.stringify(options)
    });
    
    if (options.orderId) {
      console.log('2. Setting orderId in data:', options.orderId);
      this.setData({
        orderId: options.orderId,
        debugInfo: this.data.debugInfo + '\nOrderId set: ' + options.orderId
      });
      console.log('3. Current data after setting orderId:', this.data);
      this.loadOrderDetails(options.orderId);
    } else {
      console.log('❌ 2. NO ORDER ID PROVIDED');
      this.setData({
        debugInfo: this.data.debugInfo + '\n❌ NO ORDER ID PROVIDED'
      });
      wx.showToast({
        title: 'Order not found',
        icon: 'none'
      });
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    }
  },

  onShow: function() {
    console.log('4. Payment page shown. Current termsAccepted:', this.data.termsAccepted);
  },

  // Enhanced debugging function
  checkState: function() {
    console.log('=== CURRENT STATE ===');
    const stateInfo = {
      termsAccepted: this.data.termsAccepted,
      paymentProcessing: this.data.paymentProcessing,
      orderId: this.data.orderId,
      loading: this.data.loading,
      order: this.data.order ? {
        orderNumber: this.data.order.orderNumber,
        subtotal: this.data.order.subtotal,
        shippingFee: this.data.order.shippingFee,
        totalAmount: this.data.order.totalAmount,
        items: this.data.order.items
      } : null
    };
    
    console.log('State info:', stateInfo);
    
    // Update debug info display
    this.setData({
      debugInfo: this.data.debugInfo + '\n\n=== CURRENT STATE ===\n' + JSON.stringify(stateInfo, null, 2)
    });
  },

  // Load order details with enhanced debugging
  loadOrderDetails: function(orderId) {
    console.log('5. Starting to load order details for orderId:', orderId);
    this.setData({ 
      loading: true,
      debugInfo: this.data.debugInfo + '\nLoading order details for: ' + orderId
    });
    console.log('6. Set loading to true, current data:', this.data);
    
    // Fetch order details from the API
    console.log('7. Calling api.orders.getDetail with orderId:', orderId);
    api.orders.getDetail(orderId)
      .then(res => {
        console.log('=== API RESPONSE RECEIVED ===');
        console.log('8. Full response:', res);
        
        if (res && res.data) {
          console.log('9. Setting order data in page state');
          
          // Log the data before setting it
          const orderData = res.data;
          console.log('Order data to be set:', orderData);
          
          this.setData({
            order: orderData,
            loading: false,
            debugInfo: this.data.debugInfo + '\n\n=== ORDER DATA RECEIVED ===\n' + JSON.stringify(orderData, null, 2)
          });
          
          console.log('10. Data after setting order:', this.data);
          console.log('11. Order data verification:');
          console.log('- order.orderNumber:', orderData.orderNumber);
          console.log('- order.subtotal:', orderData.subtotal);
          console.log('- order.shippingFee:', orderData.shippingFee);
          console.log('- order.totalAmount:', orderData.totalAmount);
          console.log('- order.items:', orderData.items);
        } else {
          console.log('❌ 9. INVALID RESPONSE DATA');
          this.setData({ 
            loading: false,
            debugInfo: this.data.debugInfo + '\n❌ INVALID RESPONSE DATA'
          });
        }
      })
      .catch(err => {
        console.error('=== API ERROR ===');
        console.error('12. Failed to load order details:', err);
        
        this.setData({ 
          loading: false,
          debugInfo: this.data.debugInfo + '\n❌ API ERROR: ' + JSON.stringify(err)
        });
        
        wx.showToast({
          title: 'Failed to load order details',
          icon: 'none'
        });
      });
  },

  // Process payment
  onPayNow: function() {
    console.log('13. Pay Now button clicked');
    
    // Add terms acceptance validation
    if (!this.data.termsAccepted) {
      console.log('14. Terms not accepted');
      this.setData({
        debugInfo: this.data.debugInfo + '\nTerms not accepted'
      });
      wx.showToast({
        title: 'Please accept terms and conditions',
        icon: 'none'
      });
      return;
    }
    
    if (!this.data.orderId) {
      console.log('14. No order ID');
      this.setData({
        debugInfo: this.data.debugInfo + '\nNo order ID'
      });
      wx.showToast({
        title: 'Order not found',
        icon: 'none'
      });
      return;
    }

    console.log('14. Processing payment for orderId:', this.data.orderId);
    this.setData({ 
      paymentProcessing: true,
      debugInfo: this.data.debugInfo + '\nProcessing payment for: ' + this.data.orderId
    });
    
    // Show processing message
    wx.showToast({
      title: 'Processing payment...',
      icon: 'loading',
      duration: 2000
    });
    
    // Process payment via API
    api.orders.pay(this.data.orderId, {
      paymentMethod: 'wechat'
    })
    .then(res => {
      console.log('15. Payment API response:', res);
      this.setData({
        debugInfo: this.data.debugInfo + '\nPayment response: ' + JSON.stringify(res)
      });
      
      this.proceedWithRedirect();
    })
    .catch(err => {
      console.error('15. Payment error:', err);
      this.setData({ 
        paymentProcessing: false,
        debugInfo: this.data.debugInfo + '\nPayment error: ' + JSON.stringify(err)
      });
      wx.showToast({
        title: 'Payment failed: ' + (err.message || 'Unknown error'),
        icon: 'none'
      });
    });
  },

  // Proceed with redirect after payment
  proceedWithRedirect: function() {
    console.log('16. Proceeding with redirect');
    wx.showToast({
      title: 'Payment successful!',
      icon: 'success'
    });
    
    this.setData({
      debugInfo: this.data.debugInfo + '\nRedirecting to success page'
    });
    
    // Redirect to payment success page after a short delay
    setTimeout(() => {
      console.log('17. Redirecting to payment success page now');
      wx.redirectTo({
        url: `/pages/payment-success/payment-success?orderId=${this.data.orderId}`
      });
    }, 1500);
  },

  // Cancel payment and go back
  onCancel: function() {
    console.log('13. Cancel button clicked');
    this.setData({
      debugInfo: this.data.debugInfo + '\nCancel button clicked'
    });
    
    wx.showModal({
      title: 'Cancel Payment',
      content: 'Are you sure you want to cancel the payment? You can complete it later from the orders page.',
      success: (res) => {
        if (res.confirm) {
          console.log('14. User confirmed cancel');
          this.setData({
            debugInfo: this.data.debugInfo + '\nUser confirmed cancel'
          });
          wx.navigateBack();
        }
      }
    });
  }
});