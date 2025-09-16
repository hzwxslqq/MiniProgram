// Tracking page logic
const api = require('../../utils/api.js');

Page({
  data: {
    orderId: '',
    trackingInfo: null,
    loading: true,
    error: null,
    refreshInterval: null,
    isTrackingActive: false
  },

  onLoad: function(options) {
    console.log('Tracking page loaded with options:', options);
    if (options.orderId) {
      this.setData({
        orderId: options.orderId
      });
      this.loadTrackingInfo(options.orderId);
      // Start auto-refresh for active tracking
      this.startTracking();
    } else {
      this.setData({
        loading: false,
        error: 'No order ID provided'
      });
      wx.showToast({
        title: 'Order ID not found',
        icon: 'none'
      });
    }
  },

  onUnload: function() {
    // Clear refresh interval when page is unloaded
    this.stopTracking();
  },

  // Load tracking information from API
  loadTrackingInfo: function(orderId) {
    console.log('Loading tracking info for order:', orderId);
    this.setData({ loading: true, error: null });
    
    // Fetch tracking info from API
    api.orders.getTracking(orderId)
      .then(res => {
        console.log('Tracking API response:', res);
        const trackingInfo = res.data;
        
        // Format timestamps for display
        if (trackingInfo.events) {
          trackingInfo.events = trackingInfo.events.map(event => {
            return {
              ...event,
              formattedTimestamp: this.formatDate(event.timestamp)
            };
          });
        }
        
        this.setData({
          trackingInfo: trackingInfo,
          loading: false
        });

        // Check if tracking should continue
        if (trackingInfo.status !== 'Delivered') {
          this.setData({ isTrackingActive: true });
        } else {
          this.stopTracking();
        }
      })
      .catch(err => {
        console.error('Failed to load tracking info:', err);
        this.setData({
          loading: false,
          error: err.message || 'Failed to load tracking information'
        });
        wx.showToast({
          title: 'Failed to load tracking info',
          icon: 'none'
        });
      });
  },

  // Format date for display
  formatDate: function(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString();
  },

  // Start real-time tracking
  startTracking: function() {
    // Clear any existing interval
    this.stopTracking();
    
    // Set up interval to refresh tracking info every 30 seconds
    const interval = setInterval(() => {
      if (this.data.orderId && this.data.isTrackingActive) {
        this.loadTrackingInfo(this.data.orderId);
      }
    }, 30000); // 30 seconds
    
    this.setData({ refreshInterval: interval });
  },

  // Stop real-time tracking
  stopTracking: function() {
    if (this.data.refreshInterval) {
      clearInterval(this.data.refreshInterval);
      this.setData({ refreshInterval: null });
    }
  },

  // Refresh tracking information
  refreshTracking: function() {
    if (this.data.orderId) {
      this.loadTrackingInfo(this.data.orderId);
    }
  },

  // Toggle auto-refresh
  toggleTracking: function() {
    if (this.data.refreshInterval) {
      this.stopTracking();
      wx.showToast({
        title: 'Auto-refresh disabled',
        icon: 'none'
      });
    } else {
      this.startTracking();
      wx.showToast({
        title: 'Auto-refresh enabled',
        icon: 'success'
      });
    }
  },

  // Go back to orders page
  goBack: function() {
    wx.navigateBack({
      delta: 1
    });
  }
});