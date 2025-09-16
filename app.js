// Application logic
App({
  globalData: {
    userInfo: null,
    token: null
  },
  
  onLaunch: function () {
    // Application launch initialization
    console.log('App launched');
    
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