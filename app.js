// Application logic
App({
  globalData: {
    userInfo: null,
    token: null
  },
  
  onLaunch: function () {
    // Application launch initialization
    console.log('App launched');
    
    // Initialize cloud development if available and properly configured
    if (wx.cloud) {
      // Replace 'your-env-id' with your actual cloud environment ID
      const cloudEnvId = 'your-env-id'; // e.g., 'a1b2c3d4-5e6f-7g8h-9i0j-k1l2m3n4o5p6'
      
      if (cloudEnvId && cloudEnvId !== 'your-env-id') {
        wx.cloud.init({
          env: cloudEnvId,
          traceUser: true
        });
        console.log('Cloud development initialized with env:', cloudEnvId);
      } else {
        console.log('Cloud development not initialized - no valid environment ID provided');
      }
    }
    
    // Try to load token from storage
    const token = wx.getStorageSync('token');
    if (token) {
      this.globalData.token = token;
      console.log('Loaded token from storage');
    }
  },
  
  onShow: function () {
    // Application shown
    console.log('App shown');
  },
  
  onHide: function () {
    // Application hidden
    console.log('App hidden');
  },
  
  // Global methods
  setToken: function(token) {
    this.globalData.token = token;
    wx.setStorageSync('token', token);
    console.log('Token set in storage');
  },
  
  getToken: function() {
    if (this.globalData.token) {
      return this.globalData.token;
    }
    const token = wx.getStorageSync('token');
    if (token) {
      this.globalData.token = token;
    }
    return token;
  },
  
  clearToken: function() {
    this.globalData.token = null;
    wx.removeStorageSync('token');
    console.log('Token cleared from storage');
  }
})