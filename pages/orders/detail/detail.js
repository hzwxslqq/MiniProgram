// Order detail page logic
const api = require('../../../utils/api.js');

Page({
  data: {
    order: null,
    loading: true
  },

  onLoad: function(options) {
    const orderId = options.id;
    if (orderId) {
      this.loadOrderDetail(orderId);
    } else {
      wx.showToast({
        title: 'Order ID is missing',
        icon: 'none'
      });
      wx.navigateBack();
    }
  },

  // Load order detail from API
  loadOrderDetail: function(orderId) {
    this.setData({ loading: true });
    
    api.orders.getDetail(orderId)
      .then(res => {
        console.log('Order detail response:', res);
        this.setData({
          order: res.data,
          loading: false
        });
      })
      .catch(err => {
        console.error('Failed to load order detail:', err);
        wx.showToast({
          title: 'Failed to load order: ' + (err.message || 'Unknown error'),
          icon: 'none'
        });
        this.setData({ loading: false });
      });
  },

  // Pay for pending order
  payOrder: function() {
    const order = this.data.order;
    
    wx.showModal({
      title: 'Confirm Payment',
      content: `Do you want to pay $${order.totalAmount} for order ${order.orderNumber}?`,
      success: (res) => {
        if (res.confirm) {
          // Show loading
          wx.showLoading({
            title: 'Processing payment...'
          });
          
          // Process payment via API
          api.orders.pay(order.id, {
            paymentMethod: 'wechat'
          })
            .then(res => {
              wx.hideLoading();
              wx.showToast({
                title: 'Payment successful!',
                icon: 'success'
              });
              
              // Refresh order detail
              this.loadOrderDetail(order.id);
            })
            .catch(err => {
              wx.hideLoading();
              wx.showToast({
                title: 'Payment failed: ' + (err.message || 'Unknown error'),
                icon: 'none'
              });
              console.error('Payment error:', err);
            });
        }
      }
    });
  },

  // View logistics information
  viewLogistics: function() {
    const order = this.data.order;
    if (!order.trackingNumber) {
      wx.showToast({
        title: 'No tracking information available',
        icon: 'none'
      });
      return;
    }
    
    wx.navigateTo({
      url: `/pages/orders/tracking?orderId=${order.id}`
    });
  },
  
  // Copy tracking number to clipboard
  copyTrackingNumber: function() {
    const order = this.data.order;
    if (order.trackingNumber) {
      wx.setClipboardData({
        data: order.trackingNumber,
        success: () => {
          wx.showToast({
            title: 'Tracking number copied',
            icon: 'success'
          });
        }
      });
    }
  }
});