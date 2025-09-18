// Login page logic
const { auth } = require('../../utils/api');

Page({
  data: {
    wechatAuthLoading: false,
    errorMessage: ''
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
  
  // Handle page load
  onLoad: function() {
    // Clear any existing error messages
    this.setData({
      errorMessage: ''
    });
  }
});