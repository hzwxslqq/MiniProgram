// Login page logic
const { auth } = require('../../utils/api');

Page({
  data: {
    username: '',
    password: '',
    loading: false,
    errorMessage: '',
    wechatLoading: false,
    wechatAuthLoading: false
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

  // Handle WeChat authorization login
  onWeChatAuthLogin: function() {
    console.log('Starting WeChat authorization login process');
    
    this.setData({
      wechatAuthLoading: true,
      errorMessage: ''
    });

    // Get user profile information FIRST (must be direct response to user tap)
    console.log('Requesting user profile information');
    wx.getUserProfile({
      desc: '用于完善会员资料', // Declaration for obtaining user profile
      success: (profileRes) => {
        console.log('WeChat getUserProfile success:', profileRes);
        const userInfo = profileRes.userInfo;
        
        // Validate user info
        if (!userInfo) {
          this.setData({
            wechatAuthLoading: false,
            errorMessage: 'Failed to get user profile information'
          });
          return;
        }
        
        // Now get the WeChat login code
        wx.login({
          success: (loginRes) => {
            console.log('WeChat login success, code received:', loginRes.code);
            const code = loginRes.code;
            
            // Check if code is valid
            if (!code) {
              this.setData({
                wechatAuthLoading: false,
                errorMessage: 'Failed to get WeChat authorization code'
              });
              return;
            }
            
            console.log('Sending user info to backend:', { code, userInfo });
            
            // Send to backend using API utility
            auth.wechatLogin({
              code: code,
              userInfo: userInfo
            })
            .then((response) => {
              console.log('Backend wechatLogin response:', response);
              // Handle both cloud function and HTTP API responses
              const token = response.token || (response.result && response.result.token);
              const user = response.user || (response.result && response.result.user);
              
              if (token) {
                // Save token
                getApp().setToken(token);
                
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
                  errorMessage: response.message || response.error || 'WeChat login failed'
                });
              }
            })
            .catch((err) => {
              console.error('WeChat login error:', err);
              this.setData({
                errorMessage: err.data?.message || err.message || 'WeChat login failed, please try again'
              });
            })
            .finally(() => {
              this.setData({
                wechatAuthLoading: false
              });
            });
          },
          fail: (err) => {
            console.error('WeChat login initialization failed:', err);
            this.setData({
              wechatAuthLoading: false,
              errorMessage: 'Failed to initialize WeChat login: ' + (err.errMsg || err.message || 'Unknown error')
            });
          }
        });
      },
      fail: (err) => {
        console.error('WeChat getUserProfile failed:', err);
        // User denied authorization or other error
        if (err.errMsg && err.errMsg.includes('auth deny')) {
          this.setData({
            errorMessage: 'Please authorize to login with WeChat. Tap the button again and allow profile access.'
          });
        } else if (err.errMsg && err.errMsg.includes('auth cancel')) {
          this.setData({
            errorMessage: 'You cancelled the WeChat authorization. Please tap the button again to continue.'
          });
        } else if (err.errMsg && err.errMsg.includes('getUserProfile:fail')) {
          this.setData({
            errorMessage: 'Failed to get WeChat profile. Please make sure you are using the latest version of WeChat and try again.'
          });
        } else {
          this.setData({
            errorMessage: 'Failed to get WeChat profile: ' + (err.errMsg || err.message || 'Unknown error')
          });
        }
        this.setData({
          wechatAuthLoading: false
        });
      }
    });
  },

  // Handle WeChat mobile login
  onWeChatMobileLogin: function(e) {
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