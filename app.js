// Application logic
App({
  globalData: {
    userInfo: null,
    token: null
  },
  
  onLaunch: function () {
    // Application launch initialization
    console.log('App launched');
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
  },
  
  getToken: function() {
    if (this.globalData.token) {
      return this.globalData.token;
    }
    return wx.getStorageSync('token');
  },
  
  clearToken: function() {
    this.globalData.token = null;
    wx.removeStorageSync('token');
  }
})