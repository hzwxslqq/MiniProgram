// API request utilities
const BASE_URL = 'http://localhost:3000';

// Check if we're running in WeChat Mini-Program environment with properly configured cloud
const isWeChatEnvironment = () => {
  return typeof wx !== 'undefined' && wx.cloud && wx.cloud.init;
};

// Common headers
const getHeaders = () => {
  const token = getApp().getToken();
  const headers = {
    'Content-Type': 'application/json'
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

// Generic HTTP request function
const httpRequest = (options) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: BASE_URL + options.url,
      method: options.method || 'GET',
      data: options.data || {},
      header: {
        ...getHeaders(),
        ...options.header
      },
      success: (res) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data);
        } else {
          // Handle different error status codes
          let error = {
            status: res.statusCode,
            data: res.data
          };
          
          // Provide more descriptive error messages
          switch (res.statusCode) {
            case 400:
              error.message = 'Bad Request: ' + (res.data?.message || 'Invalid request');
              break;
            case 401:
              error.message = 'Unauthorized: ' + (res.data?.message || 'Authentication required');
              break;
            case 403:
              error.message = 'Forbidden: ' + (res.data?.message || 'Access denied');
              break;
            case 404:
              error.message = 'Not Found: ' + (res.data?.message || 'Resource not found');
              break;
            case 500:
              error.message = 'Server Error: ' + (res.data?.message || 'Internal server error');
              break;
            default:
              error.message = 'Request failed with status ' + res.statusCode + ': ' + (res.data?.message || 'Unknown error');
          }
          
          reject(error);
        }
      },
      fail: (err) => {
        // Handle network errors
        let error = {
          message: 'Network error: ' + (err.errMsg || 'Failed to connect to server')
        };
        reject(error);
      }
    });
  });
};

// Generic cloud function call
const callCloudFunction = (functionName, data = {}) => {
  return new Promise((resolve, reject) => {
    if (!isWeChatEnvironment()) {
      reject(new Error('Cloud functions can only be called in WeChat environment with cloud development properly configured'));
      return;
    }
    
    wx.cloud.callFunction({
      name: functionName,
      data: data,
      success: res => {
        if (res.result && res.result.success) {
          resolve(res.result);
        } else {
          reject(new Error(res.result?.error || 'Cloud function call failed'));
        }
      },
      fail: err => {
        console.error(`Cloud function ${functionName} failed:`, err);
        reject(new Error(`Cloud function ${functionName} failed: ${err.errMsg}`));
      }
    });
  });
};

// Generic request function that uses either HTTP or cloud functions
const request = (options) => {
  // Use cloud functions if available and properly configured, otherwise use HTTP
  if (isWeChatEnvironment() && options.useCloud !== false) {
    // Map HTTP endpoints to cloud function names
    const endpointMap = {
      '/api/auth/login': 'login',
      '/api/auth/wechat-login': 'wechatLogin',
      '/api/products': 'getProducts',
      '/api/cart': 'addToCart',
      '/api/orders': 'createOrder'
    };
    
    const functionName = endpointMap[options.url];
    if (functionName) {
      return callCloudFunction(functionName, options.data)
        .catch((error) => {
          // Fallback to HTTP if cloud function fails
          console.warn(`Cloud function ${functionName} failed, falling back to HTTP:`, error.message);
          return httpRequest(options);
        });
    }
  }
  
  // Fallback to HTTP request
  return httpRequest(options);
};

// Authentication APIs
const auth = {
  login: (data) => {
    if (isWeChatEnvironment()) {
      // For WeChat login, we can use the login cloud function
      return callCloudFunction('login', data)
        .catch((error) => {
          // Fallback to HTTP if cloud function fails
          console.warn('Cloud function login failed, falling back to HTTP:', error.message);
          return httpRequest({
            url: '/api/auth/login',
            method: 'POST',
            data: data
          });
        });
    } else {
      // For regular login, use HTTP
      return httpRequest({
        url: '/api/auth/login',
        method: 'POST',
        data: data
      });
    }
  },
  
  // WeChat authorization login
  wechatLogin: (data) => {
    if (isWeChatEnvironment()) {
      // For WeChat authorization login, we can use the wechatLogin cloud function
      return callCloudFunction('wechatLogin', data)
        .then((result) => {
          // Cloud function returns success flag and token directly
          if (result.success) {
            return Promise.resolve({
              token: result.token,
              user: result.user
            });
          } else {
            return Promise.reject(new Error(result.error || 'WeChat login failed'));
          }
        })
        .catch((error) => {
          // Fallback to HTTP if cloud function fails
          console.warn('Cloud function wechatLogin failed, falling back to HTTP:', error.message);
          return httpRequest({
            url: '/api/auth/wechat-login',
            method: 'POST',
            data: data
          });
        });
    } else {
      // For regular WeChat login, use HTTP
      return httpRequest({
        url: '/api/auth/wechat-login',
        method: 'POST',
        data: data
      });
    }
  },
  
  register: (data) => {
    return httpRequest({
      url: '/api/auth/register',
      method: 'POST',
      data: data
    });
  },
  
  // WeChat mobile login
  wechatMobileLogin: (data) => {
    return httpRequest({
      url: '/api/auth/wechat-mobile-login',
      method: 'POST',
      data: data
    });
  }
};

// Product APIs
const products = {
  getList: (params) => {
    if (isWeChatEnvironment()) {
      // Use cloud function for WeChat environment
      return callCloudFunction('getProducts', params)
        .catch((error) => {
          // Fallback to HTTP if cloud function fails
          console.warn('Cloud function getProducts failed, falling back to HTTP:', error.message);
          return httpRequest({
            url: '/api/products',
            method: 'GET',
            data: params
          });
        });
    } else {
      // Use HTTP for non-WeChat environment
      return httpRequest({
        url: '/api/products',
        method: 'GET',
        data: params
      });
    }
  },
  
  getDetail: (id) => {
    return httpRequest({
      url: `/api/products/${id}`,
      method: 'GET'
    });
  },
  
  getCategories: () => {
    return httpRequest({
      url: '/api/products/categories',
      method: 'GET'
    });
  }
};

// Cart APIs
const cart = {
  getList: () => {
    return httpRequest({
      url: '/api/cart',
      method: 'GET'
    });
  },
  
  addItem: (data) => {
    if (isWeChatEnvironment()) {
      // Use cloud function for WeChat environment
      return callCloudFunction('addToCart', data)
        .catch((error) => {
          // Fallback to HTTP if cloud function fails
          console.warn('Cloud function addToCart failed, falling back to HTTP:', error.message);
          return httpRequest({
            url: '/api/cart',
            method: 'POST',
            data: data
          });
        });
    } else {
      // Use HTTP for non-WeChat environment
      return httpRequest({
        url: '/api/cart',
        method: 'POST',
        data: data
      });
    }
  },
  
  updateItem: (id, data) => {
    return httpRequest({
      url: `/api/cart/${id}`,
      method: 'PUT',
      data: data
    });
  },
  
  removeItem: (id) => {
    return httpRequest({
      url: `/api/cart/${id}`,
      method: 'DELETE'
    });
  }
};

// Order APIs
const orders = {
  create: (data) => {
    if (isWeChatEnvironment()) {
      // Use cloud function for WeChat environment
      return callCloudFunction('createOrder', data)
        .catch((error) => {
          // Fallback to HTTP if cloud function fails
          console.warn('Cloud function createOrder failed, falling back to HTTP:', error.message);
          return httpRequest({
            url: '/api/orders',
            method: 'POST',
            data: data
          });
        });
    } else {
      // Use HTTP for non-WeChat environment
      return httpRequest({
        url: '/api/orders',
        method: 'POST',
        data: data
      });
    }
  },
  
  getList: () => {
    return httpRequest({
      url: '/api/orders',
      method: 'GET'
    });
  },
  
  getDetail: (id) => {
    return httpRequest({
      url: `/api/orders/${id}`,
      method: 'GET'
    });
  },
  
  pay: (id, data) => {
    return httpRequest({
      url: `/api/orders/${id}/payment`,
      method: 'POST',
      data: data
    });
  },
  
  getTracking: (id) => {
    return httpRequest({
      url: `/api/orders/${id}/tracking`,
      method: 'GET'
    });
  }
};

// Address APIs
const addresses = {
  getList: () => {
    return httpRequest({
      url: '/api/user/addresses',
      method: 'GET'
    });
  },
  
  create: (data) => {
    return httpRequest({
      url: '/api/user/addresses',
      method: 'POST',
      data: data
    });
  },
  
  update: (id, data) => {
    return httpRequest({
      url: `/api/user/addresses/${id}`,
      method: 'PUT',
      data: data
    });
  },
  
  delete: (id) => {
    return httpRequest({
      url: `/api/user/addresses/${id}`,
      method: 'DELETE'
    });
  },
  
  setDefault: (id) => {
    return httpRequest({
      url: `/api/user/addresses/${id}/default`,
      method: 'PUT'
    });
  }
};

module.exports = {
  request,
  auth,
  products,
  cart,
  orders,
  addresses
};