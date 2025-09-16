// Payment Success page logic
const api = require('../../utils/api.js');

Page({
  data: {
    order: null,
    orderId: '',
    loading: false
  },

  onLoad: function(options) {
    console.log('Payment success page loaded with options:', options);
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
      // Redirect to home page after a short delay
      setTimeout(() => {
        wx.switchTab({
          url: '/pages/home/home'
        });
      }, 2000);
    }
  },

  // Load order details
  loadOrderDetails: function(orderId) {
    this.setData({ loading: true });
    
    // Fetch order details from the API
    api.orders.getDetail(orderId)
      .then(res => {
        console.log('Order details loaded:', res);
        if (res && res.data) {
          this.setData({
            order: res.data,
            loading: false
          });
        } else {
          throw new Error('Invalid order data');
        }
      })
      .catch(err => {
        console.error('Failed to load order details:', err);
        wx.showToast({
          title: 'Failed to load order details',
          icon: 'none'
        });
        this.setData({ loading: false });
        // Redirect to orders page after a short delay
        setTimeout(() => {
          wx.switchTab({
            url: '/pages/orders/orders'
          });
        }, 2000);
      });
  },

  // View order details
  onViewOrderDetails: function() {
    if (this.data.orderId) {
      wx.navigateTo({
        url: `/pages/orders/detail?id=${this.data.orderId}`
      });
    } else {
      wx.showToast({
        title: 'Order ID not available',
        icon: 'none'
      });
    }
  },

  // Return to home page
  onReturnHome: function() {
    wx.switchTab({
      url: '/pages/home/home'
    });
  },

  // View all orders
  onViewOrders: function() {
    wx.switchTab({
      url: '/pages/orders/orders'
    });
  }
});