// Payment page logic
const api = require('../../utils/api.js');

Page({
  data: {
    order: null,
    orderId: '',
    loading: false,
    paymentProcessing: false,
    termsAccepted: false  // Add terms acceptance
  },

  onLoad: function(options) {
    console.log('Payment page loaded with options:', options);
    if (options.orderId) {
      this.setData({
        orderId: options.orderId
      });
      this.loadOrderDetails(options.orderId);
    } else {
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
    console.log('Payment page shown. Current termsAccepted:', this.data.termsAccepted);
  },

  // Test function to manually trigger checkbox change for debugging
  testCheckboxTrigger: function() {
    console.log('Manually triggering checkbox change event');
    const mockEvent = {
      detail: {
        value: ['true']
      }
    };
    this.onTermsChange(mockEvent);
  },

  // Handle label tap to toggle checkbox
  onLabelTap: function() {
    console.log('Label tapped, toggling terms acceptance');
    const newTermsState = !this.data.termsAccepted;
    this.setData({
      termsAccepted: newTermsState
    });
    console.log('Terms accepted is now:', this.data.termsAccepted);
  },

  // Debug function to check current state
  checkState: function() {
    console.log('=== CURRENT STATE ===');
    console.log('termsAccepted:', this.data.termsAccepted);
    console.log('paymentProcessing:', this.data.paymentProcessing);
    console.log('Button disabled due to paymentProcessing:', this.data.paymentProcessing);
    console.log('Button disabled due to !termsAccepted:', !this.data.termsAccepted);
    console.log('Overall button disabled state:', this.data.paymentProcessing || !this.data.termsAccepted);
    console.log('=====================');
  },

  // Load order details
  loadOrderDetails: function(orderId) {
    this.setData({ loading: true });
    
    // Fetch order details from the API
    api.orders.getDetail(orderId)
      .then(res => {
        this.setData({
          order: res.data,
          loading: false
        });
      })
      .catch(err => {
        console.error('Failed to load order details:', err);
        wx.showToast({
          title: 'Failed to load order details',
          icon: 'none'
        });
        this.setData({ loading: false });
      });
  },

  // Handle checkbox change for terms acceptance
  onTermsChange: function(e) {
    console.log('=== PAYMENT PAGE ===');
    console.log('Payment terms checkbox changed:', e);
    console.log('Event detail:', e.detail);
    console.log('Event detail value:', e.detail.value);
    // Handle different possible value structures
    let isChecked = false;
    if (Array.isArray(e.detail.value)) {
      isChecked = e.detail.value.length > 0;
    } else if (typeof e.detail.value === 'boolean') {
      isChecked = e.detail.value;
    } else if (typeof e.detail.value === 'string') {
      isChecked = e.detail.value === 'true';
    }
    console.log('Determined isChecked value:', isChecked);
    this.setData({
      termsAccepted: isChecked
    });
    console.log('Payment terms accepted:', this.data.termsAccepted);
    // Also log the button disabled state
    console.log('Button would be disabled:', this.data.paymentProcessing || !this.data.termsAccepted);
    console.log('=====================');
  },

  // Process payment
  onPayNow: function() {
    // Add terms acceptance validation
    if (!this.data.termsAccepted) {
      wx.showToast({
        title: 'Please accept terms and conditions',
        icon: 'none'
      });
      return;
    }
    
    if (!this.data.orderId) {
      wx.showToast({
        title: 'Order not found',
        icon: 'none'
      });
      return;
    }

    this.setData({ paymentProcessing: true });
    
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
      console.log('Payment API response:', res);
      
      // Check if this is a simulation
      if (res.message && res.message.includes('simulat')) {
        wx.showToast({
          title: 'Payment Simulation',
          icon: 'none',
          duration: 2000
        });
        console.log('Payment simulation mode, proceeding with redirect');
        this.proceedWithRedirect();
      } else {
        this.proceedWithRedirect();
      }
    })
    .catch(err => {
      console.error('Payment error:', err);
      wx.showToast({
        title: 'Payment failed: ' + (err.message || 'Unknown error'),
        icon: 'none'
      });
      this.setData({ paymentProcessing: false });
    });
  },

  // Proceed with redirect after payment
  proceedWithRedirect: function() {
    wx.showToast({
      title: 'Payment successful!',
      icon: 'success'
    });
    
    // Redirect to payment success page after a short delay
    console.log('Attempting to redirect to payment success page');
    setTimeout(() => {
      console.log('Redirecting to payment success page now');
      wx.redirectTo({
        url: `/pages/payment-success/payment-success?orderId=${this.data.orderId}`
      });
    }, 1500);
  },

  // Cancel payment and go back
  onCancel: function() {
    wx.showModal({
      title: 'Cancel Payment',
      content: 'Are you sure you want to cancel the payment? You can complete it later from the orders page.',
      success: (res) => {
        if (res.confirm) {
          // Try to navigate back
          const pages = getCurrentPages();
          if (pages.length > 1) {
            // There are pages in the stack, navigate back
            wx.navigateBack();
          } else {
            // No pages in stack, redirect to orders page
            wx.redirectTo({
              url: '/pages/orders/orders'
            });
          }
        }
        // If res.cancel, do nothing (modal will close automatically)
      },
      fail: (err) => {
        console.error('Modal failed:', err);
        // Fallback navigation
        wx.navigateBack({
          fail: () => {
            // If navigateBack fails, go to orders page
            wx.redirectTo({
              url: '/pages/orders/orders',
              fail: () => {
                // If all else fails, go to home tab
                wx.switchTab({
                  url: '/pages/home/home'
                });
              }
            });
          }
        });
      }
    });
  }
});