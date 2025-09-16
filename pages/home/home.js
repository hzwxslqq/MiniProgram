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

  // Quick order (Buy Now)
  onQuickOrder: function(e) {
    const product = e.currentTarget.dataset.product;
    
    // First, try to get user's default address
    api.addresses.getList()
      .then(res => {
        let shippingAddress = {
          name: 'Customer',
          phone: '123456789',
          address: '123 Main St',
          city: 'City',
          postalCode: '12345'
        };
        
        // Use default address if available
        const defaultAddress = res.data.find(addr => addr.isDefault);
        if (defaultAddress) {
          shippingAddress = {
            name: defaultAddress.name,
            phone: defaultAddress.phone,
            address: defaultAddress.address,
            city: defaultAddress.city,
            postalCode: defaultAddress.postalCode
          };
        }
        
        // Create order directly
        const orderData = {
          items: [{
            productId: product.id,
            quantity: 1
          }],
          shippingAddress: shippingAddress
        };
    
        // Show loading
        wx.showLoading({
          title: 'Processing order...'
        });
        
        // Create order via API
        return api.orders.create(orderData);
      })
      .then(res => {
        const orderId = res.data.id;
        
        // Process payment
        return api.orders.pay(orderId, {
          paymentMethod: 'wechat'
        });
      })
      .then(res => {
        wx.hideLoading();
        wx.showToast({
          title: 'Order placed successfully!',
          icon: 'success'
        });
        
        // Redirect to orders page after a short delay
        setTimeout(() => {
          wx.navigateTo({
            url: '/pages/orders/orders'
          });
        }, 1500);
      })
      .catch(err => {
        wx.hideLoading();
        wx.showToast({
          title: 'Order failed: ' + (err.message || 'Unknown error'),
          icon: 'none'
        });
        console.error('Quick order error:', err);
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