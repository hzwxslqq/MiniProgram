// Login page logic
Page({
  data: {
    username: '',
    password: '',
    loading: false,
    errorMessage: ''
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

    // Simulate API call
    wx.request({
      url: 'http://localhost:3000/api/login',
      method: 'POST',
      data: {
        username: this.data.username,
        password: this.data.password
      },
      success: (res) => {
        if (res.statusCode === 200 && res.data.token) {
          // Save token
          getApp().setToken(res.data.token);
          
          // Navigate to home page
          wx.switchTab({
            url: '/pages/home/home'
          });
        } else {
          this.setData({
            errorMessage: res.data.message || 'Login failed'
          });
        }
      },
      fail: (err) => {
        this.setData({
          errorMessage: 'Network error, please try again'
        });
        console.error('Login error:', err);
      },
      complete: () => {
        this.setData({
          loading: false
        });
      }
    });
  },

  // Handle register link tap
  onRegister: function() {
    wx.navigateTo({
      url: '/pages/register/register'
    });
  }
});