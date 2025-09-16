// Home page logic
const api = require('../../utils/api.js');

Page({
  data: {
    banners: [
      { id: 1, image: '/images/banner1.png', url: '' },
      { id: 2, image: '/images/banner2.png', url: '' },
      { id: 3, image: '/images/banner3.png', url: '' }
    ],
    products: [],
    featuredProducts: [],
    searchQuery: '',
    loading: false
  },

  onLoad: function() {
    this.loadProducts();
  },

  // Load products from API
  loadProducts: function() {
    this.setData({ loading: true });
    
    // Simulate API call
    setTimeout(() => {
      const products = [
        { id: '1', name: 'Wireless Headphones', price: 129.99, originalPrice: 159.99, image: '/images/product1.png', rating: 4.5, reviewCount: 128 },
        { id: '2', name: 'Smart Watch', price: 199.99, originalPrice: 249.99, image: '/images/product2.png', rating: 4.8, reviewCount: 97 },
        { id: '3', name: 'Bluetooth Speaker', price: 79.99, originalPrice: 99.99, image: '/images/product3.png', rating: 4.3, reviewCount: 64 },
        { id: '4', name: 'Phone Case', price: 24.99, originalPrice: 34.99, image: '/images/product4.png', rating: 4.1, reviewCount: 210 },
        { id: '5', name: 'Laptop Backpack', price: 59.99, originalPrice: 79.99, image: '/images/product5.png', rating: 4.6, reviewCount: 85 },
        { id: '6', name: 'Water Bottle', price: 19.99, originalPrice: 29.99, image: '/images/product6.png', rating: 4.2, reviewCount: 142 }
      ];
      
      this.setData({
        products: products,
        featuredProducts: products.slice(0, 4),
        loading: false
      });
    }, 1000);
  },

  // Handle image loading errors
  onImageError: function(e) {
    console.log('Image load error for product:', e.currentTarget.dataset.productId);
    // Could implement fallback image logic here
  },

  // Handle search input
  onSearchInput: function(e) {
    this.setData({
      searchQuery: e.detail.value
    });
  },

  // Handle search submission
  onSearch: function() {
    if (this.data.searchQuery) {
      wx.showToast({
        title: 'Searching for: ' + this.data.searchQuery,
        icon: 'none'
      });
    }
  },

  // Add product to cart
  onAddToCart: function(e) {
    const product = e.currentTarget.dataset.product;
    
    // Add to cart via API
    api.cart.addItem({
      productId: product.id,
      quantity: 1
    }).then(res => {
      wx.showToast({
        title: 'Added to cart',
        icon: 'success'
      });
      
      // Update cart badge in tab bar (if implemented)
      // this.updateCartBadge();
    }).catch(err => {
      wx.showToast({
        title: 'Failed to add to cart',
        icon: 'none'
      });
      console.error('Add to cart error:', err);
    });
  },

  // Quick order (Buy Now) - Fixed to follow proper checkout flow
  onQuickOrder: function(e) {
    const product = e.currentTarget.dataset.product;
    
    wx.showLoading({
      title: 'Adding to cart...'
    });
    
    // Add product to cart first
    api.cart.addItem({
      productId: product.id,
      quantity: 1
    })
      .then(res => {
        wx.hideLoading();
        // Navigate to checkout page
        wx.navigateTo({
          url: `/pages/checkout/checkout?total=${product.price}`
        });
      })
      .catch(err => {
        wx.hideLoading();
        console.error('Add to cart error:', err);
        
        // Provide user-friendly error messages
        let errorMessage = 'Failed to add product to cart';
        if (err.status === 401) {
          errorMessage = 'Please login first';
        } else if (err.status === 400) {
          errorMessage = 'Invalid product data';
        } else if (err.status === 500) {
          errorMessage = 'Server error';
        } else if (err.message) {
          errorMessage = err.message;
        }
        
        wx.showToast({
          title: errorMessage,
          icon: 'none',
          duration: 3000
        });
      });
  },

  // Navigate to product detail
  onViewProduct: function(e) {
    const product = e.currentTarget.dataset.product;
    wx.navigateTo({
      url: `/pages/product/detail?id=${product.id}`
    });
  }
});