// Home page logic
Page({
  data: {
    banners: [
      { id: 1, image: '/images/banner1.png', url: '' },
      { id: 2, image: '/images/banner2.png', url: '' },
      { id: 3, image: '/images/banner3.png', url: '' }
    ],
    categories: [
      { id: 1, name: 'Electronics', icon: '/images/icon_electronics.png' },
      { id: 2, name: 'Clothing', icon: '/images/icon_clothing.png' },
      { id: 3, name: 'Home', icon: '/images/icon_home_category.png' },
      { id: 4, name: 'Beauty', icon: '/images/icon_beauty.png' },
      { id: 5, name: 'Sports', icon: '/images/icon_sports.png' }
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
        { id: 1, name: 'Wireless Headphones', price: 129.99, originalPrice: 159.99, image: '/images/product1.png', rating: 4.5, reviewCount: 128 },
        { id: 2, name: 'Smart Watch', price: 199.99, originalPrice: 249.99, image: '/images/product2.png', rating: 4.8, reviewCount: 97 },
        { id: 3, name: 'Bluetooth Speaker', price: 79.99, originalPrice: 99.99, image: '/images/product3.png', rating: 4.3, reviewCount: 64 },
        { id: 4, name: 'Phone Case', price: 24.99, originalPrice: 34.99, image: '/images/product4.png', rating: 4.1, reviewCount: 210 },
        { id: 5, name: 'Laptop Backpack', price: 59.99, originalPrice: 79.99, image: '/images/product5.png', rating: 4.6, reviewCount: 85 },
        { id: 6, name: 'Water Bottle', price: 19.99, originalPrice: 29.99, image: '/images/product6.png', rating: 4.2, reviewCount: 142 }
      ];
      
      this.setData({
        products: products,
        featuredProducts: products.slice(0, 4),
        loading: false
      });
    }, 1000);
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

  // Handle category selection
  onCategorySelect: function(e) {
    const category = e.currentTarget.dataset.category;
    wx.showToast({
      title: 'Selected: ' + category.name,
      icon: 'none'
    });
  },

  // Add product to cart
  onAddToCart: function(e) {
    const product = e.currentTarget.dataset.product;
    
    // Simulate adding to cart
    wx.showToast({
      title: 'Added to cart',
      icon: 'success'
    });
    
    // In a real app, you would make an API call to add to cart
    // and update the cart badge in the tab bar
  },

  // Quick order
  onQuickOrder: function(e) {
    const product = e.currentTarget.dataset.product;
    
    wx.showModal({
      title: 'Confirm Order',
      content: `Do you want to order ${product.name} for $${product.price}?`,
      success: (res) => {
        if (res.confirm) {
          // Simulate order creation
          wx.showToast({
            title: 'Order placed!',
            icon: 'success'
          });
        }
      }
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