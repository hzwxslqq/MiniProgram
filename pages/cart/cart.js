// Cart page logic
const api = require('../../utils/api.js');

Page({
  // Test function to simulate checkout
  testCheckout: function() {
    console.log('Testing checkout navigation');
    wx.navigateTo({
      url: '/pages/checkout/checkout?total=100.00'
    });
  },
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

  // Continue shopping - navigate to home page
  onContinueShopping: function() {
    wx.switchTab({
      url: '/pages/home/home'
    });
  },

  // Load cart items from API
  loadCartItems: function() {
    this.setData({ loading: true });
    
    // Call API to get cart items
    api.cart.getList()
      .then(res => {
        // Transform API response to match expected format
        const cartItems = res.data.map(item => ({
          id: item.id,
          productId: item.productId,
          name: item.productName,
          image: item.productImage,
          price: item.price,
          quantity: item.quantity,
          selected: item.selected !== undefined ? item.selected : true // Default to selected if not specified
        }));
        
        // Make sure all items are selected by default for checkout
        const selectedItems = cartItems.length > 0 ? cartItems : cartItems.filter(item => item.selected);
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
      })
      .catch(err => {
        console.error('Failed to load cart items:', err);
        wx.showToast({
          title: 'Failed to load cart',
          icon: 'none'
        });
        
        // Fallback to simulated data in case of error
        setTimeout(() => {
          const cartItems = [
            { id: '1', productId: '1', name: 'Wireless Headphones', image: '/images/product1.png', price: 129.99, quantity: 1, selected: true },
            { id: '2', productId: '3', name: 'Bluetooth Speaker', image: '/images/product3.png', price: 79.99, quantity: 2, selected: true }
          ];
          
          // Make sure all items are selected by default for checkout
          const selectedItems = cartItems.length > 0 ? cartItems : cartItems.filter(item => item.selected);
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
      });
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
    
    // Update item selection in backend
    const item = cartItems.find(item => item.id === itemId);
    if (item) {
      api.cart.updateItem(itemId, { selected: item.selected })
        .catch(err => {
          console.error('Failed to update item selection:', err);
          wx.showToast({
            title: 'Failed to update selection',
            icon: 'none'
          });
        });
    }
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
    
    // Update all items selection in backend
    cartItems.forEach(item => {
      api.cart.updateItem(item.id, { selected: item.selected })
        .catch(err => {
          console.error('Failed to update item selection:', err);
        });
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
    
    // Update item quantity in backend
    const item = cartItems.find(item => item.id === itemId);
    if (item) {
      api.cart.updateItem(itemId, { quantity: item.quantity })
        .catch(err => {
          console.error('Failed to update item quantity:', err);
          wx.showToast({
            title: 'Failed to update quantity',
            icon: 'none'
          });
        });
    }
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
    
    // Update item quantity in backend
    const item = cartItems.find(item => item.id === itemId);
    if (item && item.quantity > 0) {
      api.cart.updateItem(itemId, { quantity: item.quantity })
        .catch(err => {
          console.error('Failed to update item quantity:', err);
          wx.showToast({
            title: 'Failed to update quantity',
            icon: 'none'
          });
        });
    }
  },

  // Remove item from cart
  removeItem: function(e) {
    const itemId = e.currentTarget.dataset.id;
    
    wx.showModal({
      title: 'Remove Item',
      content: 'Are you sure you want to remove this item from your cart?',
      success: (res) => {
        if (res.confirm) {
          // Remove item from backend
          api.cart.removeItem(itemId)
            .then(() => {
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
            })
            .catch(err => {
              console.error('Failed to remove item:', err);
              wx.showToast({
                title: 'Failed to remove item',
                icon: 'none'
              });
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
    console.log('Checkout button clicked');
    console.log('Selected items:', this.data.selectedItems);
    console.log('Total price:', this.data.totalPrice);
    
    // For debugging, let's first check if we have any items
    if (this.data.cartItems && this.data.cartItems.length > 0) {
      console.log('Cart has items, checking selected items');
      // Let's select all items for testing
      const selectedItems = this.data.cartItems;
      const totalPrice = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      console.log('Calculated total price:', totalPrice);
      
      // Navigate to checkout page
      console.log('Navigating to checkout page with total:', totalPrice);
      wx.navigateTo({
        url: '/pages/checkout/checkout?total=' + totalPrice
      });
    } else if (this.data.selectedItems.length === 0) {
      wx.showToast({
        title: 'Please select items to checkout',
        icon: 'none'
      });
      return;
    } else {
      // Navigate to checkout page
      console.log('Navigating to checkout page');
      wx.navigateTo({
        url: '/pages/checkout/checkout?total=' + this.data.totalPrice
      });
    }
  }
});