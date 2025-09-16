// Login page logic
const { auth } = require('../../utils/api');

Page({
  data: {
    username: '',
    password: '',
    loading: false,
    errorMessage: '',
    wechatLoading: false
  },

  // Handle username input
  onUsernameInput: function(e) {
    this.setData({
      username: e.detail.value
    });
  },

  // Handle password input
  onPasswordInput: function(e) {
    this.setData({
      password: e.detail.value
    });
  },

  // Validate form inputs
  validateForm: function() {
    if (!this.data.username) {
      this.setData({
        errorMessage: 'Please enter your username'
      });
      return false;
    }

    if (!this.data.password) {
      this.setData({
        errorMessage: 'Please enter your password'
      });
      return false;
    }

    this.setData({
      errorMessage: ''
    });
    return true;
  },

  // Handle login button tap
  onLogin: function() {
    if (!this.validateForm()) {
      return;
    }

    this.setData({
      loading: true
    });

    // Use the API utility function
    auth.login({
      username: this.data.username,
      password: this.data.password
    })
    .then((res) => {
      if (res.token) {
        // Save token
        getApp().setToken(res.token);
        
        // Navigate to home page
        wx.switchTab({
          url: '/pages/home/home'
        });
      } else {
        this.setData({
          errorMessage: res.message || 'Login failed'
        });
      }
    })
    .catch((err) => {
      this.setData({
        errorMessage: err.data?.message || 'Login failed, please try again'
      });
      console.error('Login error:', err);
    })
    .finally(() => {
      this.setData({
        loading: false
      });
    });
  },

  // Handle WeChat mobile login
  onWeChatMobileLogin: function(e) {
    if (e.detail.errMsg !== 'getPhoneNumber:ok') {
      wx.showToast({
        title: 'Authorization failed',
        icon: 'none'
      });
      return;
    }

    const encryptedData = e.detail.encryptedData;
    const iv = e.detail.iv;

    this.setData({
      wechatLoading: true
    });
    wx.login({
      success: loginRes => {
        const code = loginRes.code;

        // Call backend API to decrypt the phone number
        wx.request({
          url: 'http://localhost:3000/api/auth/wechat-mobile-login',
          method: 'POST',
          data: {
            code,
            encryptedData,
            iv
          },
          header: {
            'content-type': 'application/json'
          },
          success: res => {
            if (res.data.token) {
              // Save token and navigate to home page
              wx.setStorageSync('token', res.data.token);
              wx.switchTab({
                url: '/pages/home/home'
              });
            } else {
              wx.showToast({
                title: 'Login failed',
                icon: 'none'
              });
            }
          },
          fail: err => {
            wx.showToast({
              title: 'Network request failed',
              icon: 'none'
            });
          },
          complete: () => {
            this.setData({
              wechatLoading: false
            });
          }
        });
      },
      fail: err => {
        wx.showToast({
          title: 'Failed to get login code',
          icon: 'none'
        });
        this.setData({
          wechatLoading: false
        });
      }
    });
    // Check if user denied the authorization
    if (e.detail.errMsg === "getPhoneNumber:fail auth deny") {
      // Show explanation to user with proper text length
      wx.showModal({
        title: 'Authorization Required',
        content: 'To login with your mobile number, please authorize access in the next prompt.',
        showCancel: true,
        confirmText: 'OK',
        cancelText: 'Cancel',
        success: (res) => {
          if (res.confirm) {
            this.setData({
              errorMessage: 'Please tap the WeChat login button again and authorize access to continue.'
            });
          }
        }
      });
      return;
    }

    // Check if we don't have phone number authorization
    if (e.detail.errMsg !== "getPhoneNumber:ok") {
      this.setData({
        errorMessage: 'Unable to get phone number. Please try again or use regular login.'
      });
      
      // Show explanation to user with proper text length
      wx.showModal({
        title: 'Authorization Required',
        content: 'To login with your mobile number, please authorize access in the next prompt.',
        showCancel: true,
        confirmText: 'Retry',
        cancelText: 'Cancel'
      });
      return;
    }

    this.setData({
      wechatLoading: true,
      errorMessage: ''
    });

    // First, we need to login to WeChat to get the code
    wx.login({
      success: (loginRes) => {
        const code = loginRes.code;
        
        // Send encrypted data to backend for decryption
        auth.wechatMobileLogin({
          code: code,
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv
        })
        .then((response) => {
          if (response.token) {
            // Save token
            getApp().setToken(response.token);
            
            // Show success message
            wx.showToast({
              title: 'Login successful',
              icon: 'success',
              duration: 1500
            });
            
            // Navigate to home page after a short delay
            setTimeout(() => {
              wx.switchTab({
                url: '/pages/home/home'
              });
            }, 1500);
          } else {
            this.setData({
              errorMessage: response.message || 'WeChat login failed'
            });
          }
        })
        .catch((err) => {
          this.setData({
            errorMessage: err.data?.message || 'WeChat login failed, please try again'
          });
          console.error('WeChat login error:', err);
          
          // Show detailed error in modal for better user experience
          wx.showModal({
            title: 'Login Error',
            content: err.data?.message || 'WeChat login failed. Please check your network connection and try again.',
            showCancel: false,
            confirmText: 'OK'
          });
        })
        .finally(() => {
          this.setData({
            wechatLoading: false
          });
        });
      },
      fail: (err) => {
        this.setData({
          wechatLoading: false,
          errorMessage: 'Failed to initialize WeChat login'
        });
        console.error('WeChat login initialization failed:', err);
        
        wx.showModal({
          title: 'Login Error',
          content: 'Failed to initialize WeChat login. Please check your network connection and try again.',
          showCancel: false,
          confirmText: 'OK'
        });
      }
    });
  },

  // Handle register link tap
  onRegister: function() {
    wx.navigateTo({
      url: '/pages/register/register'
    });
  },
  
  // Handle page load
  onLoad: function() {
    // Clear any existing error messages
    this.setData({
      errorMessage: ''
    });
  }
});