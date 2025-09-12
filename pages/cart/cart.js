// Cart page logic
Page({
  data: {
    cartItems: [],
    selectedItems: [],
    totalPrice: 0,
    selectAllIcon: 'circle',
    isEditing: false,
    loading: false
  },

  onLoad: function() {
    this.loadCartItems();
  },

  onShow: function() {
    // Refresh cart when page shows
    this.loadCartItems();
  },

  // Load cart items from API
  loadCartItems: function() {
    this.setData({ loading: true });
    
    // Simulate API call
    setTimeout(() => {
      const cartItems = [
        { id: 1, productId: 1, name: 'Wireless Headphones', image: '/images/product1.png', price: 129.99, quantity: 1, selected: true },
        { id: 2, productId: 3, name: 'Bluetooth Speaker', image: '/images/product3.png', price: 79.99, quantity: 2, selected: true }
      ];
      
      const selectedItems = cartItems.filter(item => item.selected);
      const totalPrice = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const allSelected = cartItems.length > 0 && cartItems.every(item => item.selected);
      const selectAllIcon = allSelected ? 'success' : 'circle';
      
      this.setData({
        cartItems: cartItems,
        selectedItems: selectedItems,
        totalPrice: totalPrice.toFixed(2),
        selectAllIcon: selectAllIcon,
        loading: false
      });
    }, 500);
  },

  // Toggle item selection
  toggleItemSelection: function(e) {
    const itemId = e.currentTarget.dataset.id;
    const cartItems = this.data.cartItems.map(item => {
      if (item.id === itemId) {
        return { ...item, selected: !item.selected };
      }
      return item;
    });
    
    const selectedItems = cartItems.filter(item => item.selected);
    const totalPrice = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const allSelected = cartItems.length > 0 && cartItems.every(item => item.selected);
    const selectAllIcon = allSelected ? 'success' : 'circle';
    
    this.setData({
      cartItems: cartItems,
      selectedItems: selectedItems,
      totalPrice: totalPrice.toFixed(2),
      selectAllIcon: selectAllIcon
    });
  },

  // Select all items
  selectAll: function() {
    const allSelected = this.data.cartItems.length > 0 && this.data.cartItems.every(item => item.selected);
    const cartItems = this.data.cartItems.map(item => ({
      ...item,
      selected: !allSelected
    }));
    
    const selectedItems = cartItems.filter(item => item.selected);
    const totalPrice = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const selectAllIcon = !allSelected ? 'success' : 'circle';
    
    this.setData({
      cartItems: cartItems,
      selectedItems: selectedItems,
      totalPrice: totalPrice.toFixed(2),
      selectAllIcon: selectAllIcon
    });
  },

  // Increase quantity
  increaseQuantity: function(e) {
    const itemId = e.currentTarget.dataset.id;
    const cartItems = this.data.cartItems.map(item => {
      if (item.id === itemId) {
        return { ...item, quantity: item.quantity + 1 };
      }
      return item;
    });
    
    const selectedItems = cartItems.filter(item => item.selected);
    const totalPrice = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    this.setData({
      cartItems: cartItems,
      selectedItems: selectedItems,
      totalPrice: totalPrice.toFixed(2)
    });
  },

  // Decrease quantity
  decreaseQuantity: function(e) {
    const itemId = e.currentTarget.dataset.id;
    const cartItems = this.data.cartItems.map(item => {
      if (item.id === itemId && item.quantity > 1) {
        return { ...item, quantity: item.quantity - 1 };
      }
      return item;
    });
    
    const selectedItems = cartItems.filter(item => item.selected);
    const totalPrice = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    this.setData({
      cartItems: cartItems,
      selectedItems: selectedItems,
      totalPrice: totalPrice.toFixed(2)
    });
  },

  // Remove item from cart
  removeItem: function(e) {
    const itemId = e.currentTarget.dataset.id;
    
    wx.showModal({
      title: 'Remove Item',
      content: 'Are you sure you want to remove this item from your cart?',
      success: (res) => {
        if (res.confirm) {
          const cartItems = this.data.cartItems.filter(item => item.id !== itemId);
          const selectedItems = cartItems.filter(item => item.selected);
          const totalPrice = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
          const allSelected = cartItems.length > 0 && cartItems.every(item => item.selected);
          const selectAllIcon = allSelected ? 'success' : 'circle';
          
          this.setData({
            cartItems: cartItems,
            selectedItems: selectedItems,
            totalPrice: totalPrice.toFixed(2),
            selectAllIcon: selectAllIcon
          });
          
          wx.showToast({
            title: 'Item removed',
            icon: 'success'
          });
        }
      }
    });
  },

  // Toggle edit mode
  toggleEditMode: function() {
    this.setData({
      isEditing: !this.data.isEditing
    });
  },

  // Proceed to checkout
  onCheckout: function() {
    if (this.data.selectedItems.length === 0) {
      wx.showToast({
        title: 'Please select items to checkout',
        icon: 'none'
      });
      return;
    }
    
    // Navigate to checkout page
    wx.navigateTo({
      url: '/pages/checkout/checkout?total=' + this.data.totalPrice
    });
  }
});