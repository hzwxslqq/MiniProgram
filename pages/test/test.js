// Test page for WeChat functionality
Page({
  data: {
    message: 'Testing WeChat functionality'
  },

  // Test navigation to checkout page
  onNavigateToCheckout: function() {
    wx.navigateTo({
      url: '/pages/checkout/checkout?total=100.00'
    });
  },
  
  // Test navigation to payment page
  onNavigateToPayment: function() {
    wx.navigateTo({
      url: '/pages/payment/payment?orderId=12345'
    });
  },

  onWeChatLogin: function() {
    wx.login({
      success: function(res) {
        console.log('WeChat login success:', res);
        if (res.code) {
          console.log('Login code:', res.code);
        } else {
          console.log('Login failed!');
        }
      },
      fail: function(err) {
        console.log('WeChat login failed:', err);
      }
    });
  },

  onGetPhoneNumber: function(e) {
    console.log('Get phone number result:', e);
    if (e.detail.errMsg === "getPhoneNumber:ok") {
      console.log('Encrypted data:', e.detail.encryptedData);
      console.log('IV:', e.detail.iv);
    } else {
      console.log('Failed to get phone number:', e.detail.errMsg);
    }
  }
});