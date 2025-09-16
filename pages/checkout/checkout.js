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
    console.log('Checkout page loaded. Initial termsAccepted:', this.data.termsAccepted);
    console.log('Initial data:', this.data);
    // Load cart items and calculate total
    this.loadCartItems();
    if (options.total) {
      this.setData({
        totalPrice: parseFloat(options.total)
      });
    }
    
    // Load user addresses
    this.loadUserAddresses();
    
    console.log('Data after onLoad:', this.data);
  },

  onShow: function() {
    console.log('Checkout page shown. Current termsAccepted:', this.data.termsAccepted);
  },

  // Handle label tap to toggle checkbox
  onLabelTap: function() {
    console.log('Label tapped, toggling terms acceptance');
    const newTermsState = !this.data.termsAccepted;
    this.setData({
      termsAccepted: newTermsState
    });
    console.log('Terms accepted is now:', this.data.termsAccepted);
  },

  // Test function to manually trigger checkbox change for debugging
  testCheckboxTrigger: function() {
    console.log('Manually triggering checkbox change event');
    const mockEvent = {
      detail: {
        value: ['true']
      }
    };
    this.onTermsChange(mockEvent);
  },

  // Load cart items from API
  loadCartItems: function() {
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
        
        this.setData({
          cartItems: cartItems
        });
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
        // Don't show error toast as this is not critical
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
        selectedAddressName: ''
      });
    }
  },
  
  // Handle checkbox change for terms acceptance
  onTermsChange: function(e) {
    console.log('=== CHECKOUT PAGE ===');
    console.log('onTermsChange function called with event:', e);
    console.log('Event detail:', e.detail);
    console.log('Event detail value:', e.detail.value);
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
    console.log('Terms checkbox changed. Checked:', isChecked, 'Value:', e.detail.value);
    this.setData({
      termsAccepted: isChecked  // Use actual checkbox state
    });
    console.log('Terms accepted is now:', this.data.termsAccepted);
    console.log('=====================');
  },

  // Place order
  onPlaceOrder: function() {
    if (!this.validateForm()) {
      return;
    }

    this.setData({ loading: true });
    
    // Create order
    const orderData = {
      items: this.data.cartItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity
      })),
      shippingAddress: this.data.shippingAddress
    };

    api.orders.create(orderData)
      .then(res => {
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
  },
});