// API request utilities
const BASE_URL = 'http://localhost:3000';

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

// Generic request function
const request = (options) => {
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
          reject(res);
        }
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
};

// Authentication APIs
const auth = {
  login: (data) => {
    return request({
      url: '/api/login',
      method: 'POST',
      data: data
    });
  },
  
  register: (data) => {
    return request({
      url: '/api/register',
      method: 'POST',
      data: data
    });
  }
};

// Product APIs
const products = {
  getList: (params) => {
    return request({
      url: '/api/products',
      method: 'GET',
      data: params
    });
  },
  
  getDetail: (id) => {
    return request({
      url: `/api/products/${id}`,
      method: 'GET'
    });
  },
  
  getCategories: () => {
    return request({
      url: '/api/categories',
      method: 'GET'
    });
  }
};

// Cart APIs
const cart = {
  getList: () => {
    return request({
      url: '/api/cart',
      method: 'GET'
    });
  },
  
  addItem: (data) => {
    return request({
      url: '/api/cart',
      method: 'POST',
      data: data
    });
  },
  
  updateItem: (id, data) => {
    return request({
      url: `/api/cart/${id}`,
      method: 'PUT',
      data: data
    });
  },
  
  removeItem: (id) => {
    return request({
      url: `/api/cart/${id}`,
      method: 'DELETE'
    });
  }
};

// Order APIs
const orders = {
  create: (data) => {
    return request({
      url: '/api/orders',
      method: 'POST',
      data: data
    });
  },
  
  getList: () => {
    return request({
      url: '/api/orders',
      method: 'GET'
    });
  },
  
  getDetail: (id) => {
    return request({
      url: `/api/orders/${id}`,
      method: 'GET'
    });
  },
  
  pay: (id, data) => {
    return request({
      url: `/api/orders/${id}/payment`,
      method: 'POST',
      data: data
    });
  },
  
  getTracking: (id) => {
    return request({
      url: `/api/orders/${id}/tracking`,
      method: 'GET'
    });
  }
};

module.exports = {
  request,
  auth,
  products,
  cart,
  orders
};