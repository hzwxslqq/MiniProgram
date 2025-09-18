// Checkout page logic
const api = require('../../utils/api.js');

Page({
  data: {
    cartItems: [],
    totalPrice: 0,
    userAddresses: [],
    selectedAddressId: '',
    selectedAddressIndex: -1,
    selectedAddressName: '',
    shippingAddress: {
      name: '',
      phone: '',
      address: '',
      city: '',
      postalCode: ''
    },
    paymentMethod: 'wechat',
    termsAccepted: false,
    loading: false
  },

  onLoad: function(options) {
    // Load cart items and calculate total
    this.loadCartItems();
    if (options.total) {
      this.setData({
        totalPrice: parseFloat(options.total)
      });
    }
    
    // Load user addresses
    this.loadUserAddresses();
  },

  onShow: function() {
  },

  // Handle label tap to toggle checkbox
  onLabelTap: function() {
    const newTermsState = !this.data.termsAccepted;
    this.setData({
      termsAccepted: newTermsState
    });
  },

  // Test function to manually trigger checkbox change for debugging
  testCheckboxTrigger: function() {
    const mockEvent = {
      detail: {
        value: ['true']
      }
    };
    this.onTermsChange(mockEvent);
  },

  // Manual refresh function for debugging
  refreshCart: function() {
    console.log('Manually refreshing cart items...');
    this.loadCartItems();
  },

  // Load cart items from API
  loadCartItems: function() {
    console.log('=== LOADING CART ITEMS ===');
    api.cart.getList()
      .then(res => {
        console.log('Cart items response:', res);
        
        // Check if response has data
        if (!res || !res.data || !Array.isArray(res.data)) {
          console.error('Invalid cart items response format');
          return;
        }
        
        console.log('Raw cart items from API:', res.data);
        
        // Transform API response to match expected format
        const cartItems = res.data.map(item => {
          console.log('Processing cart item:', item);
          
          // Log each field to see what's available
          console.log('Available fields in item:', Object.keys(item));
          console.log('item.id:', item.id);
          console.log('item.productId:', item.productId);
          console.log('item.product_id:', item.product_id);
          console.log('item.productName:', item.productName);
          console.log('item.product_name:', item.product_name);
          
          return {
            id: item.id,
            productId: item.productId,  // This should be the correct field
            name: item.productName,
            image: item.productImage,
            price: item.price,
            quantity: item.quantity,
            selected: item.selected !== undefined ? item.selected : true // Default to selected if not specified
          };
        });
        
        console.log('Transformed cart items:', cartItems);
        
        // Validate that all items have productId
        for (let i = 0; i < cartItems.length; i++) {
          if (!cartItems[i].productId) {
            console.error(`Cart item ${i} missing productId after transformation:`, cartItems[i]);
          }
        }
        
        // Calculate total price
        let totalPrice = 0;
        cartItems.forEach(item => {
          totalPrice += item.price * item.quantity;
        });
        
        this.setData({
          cartItems: cartItems,
          totalPrice: totalPrice
        });
        
        console.log('Cart items loaded successfully');
        console.log('Final cart items in data:', this.data.cartItems);
      })
      .catch(err => {
        console.error('Failed to load cart items:', err);
        wx.showToast({
          title: 'Failed to load cart items',
          icon: 'none'
        });
      });
  },
  
  // Load user addresses from API
  loadUserAddresses: function() {
    api.addresses.getList()
      .then(res => {
        this.setData({
          userAddresses: res.data
        });
        
        // Set default address if available
        const defaultAddressIndex = res.data.findIndex(addr => addr.isDefault);
        if (defaultAddressIndex >= 0) {
          const defaultAddress = res.data[defaultAddressIndex];
          this.setData({
            selectedAddressIndex: defaultAddressIndex,
            selectedAddressId: defaultAddress.id,
            selectedAddressName: defaultAddress.name,
            shippingAddress: {
              name: defaultAddress.name,
              phone: defaultAddress.phone,
              address: defaultAddress.address,
              city: defaultAddress.city,
              postalCode: defaultAddress.postalCode
            }
          });
        } else {
          // Reset selected address if no default found
          this.setData({
            selectedAddressIndex: -1,
            selectedAddressId: '',
            selectedAddressName: ''
          });
        }
      })
      .catch(err => {
        console.error('Failed to load addresses:', err);
        wx.showToast({
          title: 'Failed to load addresses: ' + (err.message || 'Unknown error'),
          icon: 'none',
          duration: 3000
        });
      });
  },

  // Handle form input changes
  onInputChange: function(e) {
    const field = e.currentTarget.dataset.field;
    const value = e.detail.value;
    
    if (field.startsWith('shippingAddress.')) {
      const addressField = field.split('.')[1];
      this.setData({
        [`shippingAddress.${addressField}`]: value
      });
    } else {
      this.setData({
        [field]: value
      });
    }
  },
  
  // Handle address selection
  onAddressChange: function(e) {
    const selectedIndex = e.detail.value;
    const selectedAddress = this.data.userAddresses[selectedIndex];
    
    if (selectedAddress) {
      this.setData({
        selectedAddressIndex: selectedIndex,
        selectedAddressId: selectedAddress.id,
        selectedAddressName: selectedAddress.name,
        shippingAddress: {
          name: selectedAddress.name,
          phone: selectedAddress.phone,
          address: selectedAddress.address,
          city: selectedAddress.city,
          postalCode: selectedAddress.postalCode
        }
      });
    } else {
      // Clear the selected address
      this.setData({
        selectedAddressIndex: -1,
        selectedAddressId: '',
        selectedAddressName: '',
        shippingAddress: {
          name: '',
          phone: '',
          address: '',
          city: '',
          postalCode: ''
        }
      });
    }
  },
  
  // Handle checkbox change for terms acceptance
  onTermsChange: function(e) {
    // For checkboxes, value is an array. If checked, it's ['true'], otherwise []
    // Handle different possible value structures
    let isChecked = false;
    if (Array.isArray(e.detail.value)) {
      isChecked = e.detail.value.length > 0;
    } else if (typeof e.detail.value === 'boolean') {
      isChecked = e.detail.value;
    } else if (typeof e.detail.value === 'string') {
      isChecked = e.detail.value === 'true';
    }
    this.setData({
      termsAccepted: isChecked  // Use actual checkbox state
    });
  },

  // Place order
  onPlaceOrder: function() {
    console.log('=== PLACE ORDER DEBUG ===');
    console.log('Current cart items:', this.data.cartItems);
    
    // Check if cart items are loaded
    if (!this.data.cartItems) {
      console.error('Cart items not loaded yet');
      wx.showToast({
        title: 'Please wait, loading cart items...',
        icon: 'none'
      });
      // Try to load cart items again
      this.loadCartItems();
      return;
    }
    
    // Check if cart items array exists and has items
    if (!Array.isArray(this.data.cartItems) || this.data.cartItems.length === 0) {
      console.error('No cart items found or cart items is not an array');
      wx.showToast({
        title: 'Cart is empty',
        icon: 'none'
      });
      // Try to load cart items again
      this.loadCartItems();
      return;
    }
    
    // Deep validation of cart items
    let hasInvalidItems = false;
    const validatedCartItems = [];
    
    for (let i = 0; i < this.data.cartItems.length; i++) {
      const item = this.data.cartItems[i];
      console.log(`Item ${i + 1}:`, item);
      
      // Validate that all required fields exist
      if (!item.hasOwnProperty('id') || !item.hasOwnProperty('productId') || 
          !item.hasOwnProperty('name') || !item.hasOwnProperty('quantity')) {
        console.error(`Item ${i + 1} missing required fields:`, item);
        hasInvalidItems = true;
        continue;
      }
      
      // Validate that productId is valid
      if (!item.productId || item.productId === 'undefined' || item.productId === 'null') {
        console.error(`Item ${i + 1} has invalid productId:`, item.productId);
        hasInvalidItems = true;
        continue;
      }
      
      // Add to validated items
      validatedCartItems.push({
        id: item.id,
        productId: item.productId,
        name: item.name,
        image: item.image,
        price: item.price,
        quantity: item.quantity,
        selected: item.selected
      });
    }
    
    if (hasInvalidItems) {
      wx.showToast({
        title: 'Invalid cart items, please refresh',
        icon: 'none'
      });
      // Try to reload cart items
      this.loadCartItems();
      return;
    }
    
    // Use validated cart items
    const cartItems = validatedCartItems;
    
    if (!this.validateForm()) {
      return;
    }

    this.setData({ loading: true });
    
    // Create order
    const orderData = {
      items: cartItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity
      })),
      shippingAddress: this.data.shippingAddress
    };
    
    console.log('Order data being sent:', orderData);
    
    // Validate order data before sending
    if (!orderData.items || orderData.items.length === 0) {
      console.error('No items in order data');
      wx.showToast({
        title: 'No items to order',
        icon: 'none'
      });
      this.setData({ loading: false });
      return;
    }
    
    // Check that all items have valid product IDs
    for (let i = 0; i < orderData.items.length; i++) {
      const item = orderData.items[i];
      if (!item.productId || item.productId === 'undefined' || item.productId === 'null') {
        console.error(`Order item ${i + 1} is missing or has invalid productId:`, item);
        wx.showToast({
          title: 'Invalid item in cart',
          icon: 'none'
        });
        this.setData({ loading: false });
        return;
      }
    }

    api.orders.create(orderData)
      .then(res => {
        console.log('Order creation successful:', res);
        // Redirect to payment page with order ID
        wx.redirectTo({
          url: `/pages/payment/payment?orderId=${res.data.id}`
        });
      })
      .catch(err => {
        console.error('Order creation failed:', err);
        wx.showToast({
          title: 'Order failed: ' + (err.message || 'Unknown error'),
          icon: 'none'
        });
        this.setData({ loading: false });
      });
  },

  // Validate form inputs
  validateForm: function() {
    const address = this.data.shippingAddress;
    
    if (!address.name || !address.phone || !address.address || 
        !address.city || !address.postalCode) {
      wx.showToast({
        title: 'Please fill all address fields',
        icon: 'none'
      });
      return false;
    }

    if (!this.data.termsAccepted) {
      wx.showToast({
        title: 'Please accept terms and conditions',
        icon: 'none'
      });
      return false;
    }

    // Check if cart has items
    if (!this.data.cartItems || this.data.cartItems.length === 0) {
      wx.showToast({
        title: 'No items in cart',
        icon: 'none'
      });
      return false;
    }

    return true;
  }
});