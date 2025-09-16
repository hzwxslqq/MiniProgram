// Address management page logic
const api = require('../../utils/api.js');

Page({
  data: {
    addresses: [],
    showAddForm: false,
    showEditForm: false,
    currentAddress: null,
    formData: {
      name: '',
      phone: '',
      address: '',
      city: '',
      postalCode: '',
      isDefault: false
    },
    loading: false
  },

  onLoad: function() {
    this.loadAddresses();
  },

  // Load user addresses from API
  loadAddresses: function() {
    this.setData({ loading: true });
    
    api.addresses.getList()
      .then(res => {
        this.setData({
          addresses: res.data,
          loading: false
        });
      })
      .catch(err => {
        console.error('Failed to load addresses:', err);
        wx.showToast({
          title: 'Failed to load addresses',
          icon: 'none'
        });
        this.setData({ loading: false });
      });
  },

  // Toggle add form visibility
  toggleAddForm: function() {
    this.setData({
      showAddForm: !this.data.showAddForm,
      showEditForm: false,
      currentAddress: null,
      formData: {
        name: '',
        phone: '',
        address: '',
        city: '',
        postalCode: '',
        isDefault: false
      }
    });
  },

  // Toggle edit form visibility
  toggleEditForm: function(e) {
    const address = e.currentTarget.dataset.address;
    
    this.setData({
      showEditForm: !this.data.showEditForm,
      showAddForm: false,
      currentAddress: address,
      formData: {
        name: address.name,
        phone: address.phone,
        address: address.address,
        city: address.city,
        postalCode: address.postalCode,
        isDefault: address.isDefault
      }
    });
  },

  // Handle form input changes
  onInputChange: function(e) {
    const field = e.currentTarget.dataset.field;
    const value = e.detail.value;
    
    this.setData({
      [`formData.${field}`]: value
    });
  },

  // Handle checkbox change for default address
  onDefaultChange: function(e) {
    const isChecked = e.detail.value.length > 0;
    this.setData({
      'formData.isDefault': isChecked
    });
  },

  // Add new address
  onAddAddress: function() {
    if (!this.validateForm()) {
      return;
    }

    this.setData({ loading: true });
    
    api.addresses.create(this.data.formData)
      .then(res => {
        wx.showToast({
          title: 'Address added successfully',
          icon: 'success'
        });
        
        this.setData({
          showAddForm: false,
          formData: {
            name: '',
            phone: '',
            address: '',
            city: '',
            postalCode: '',
            isDefault: false
          }
        });
        
        // Reload addresses
        this.loadAddresses();
      })
      .catch(err => {
        console.error('Failed to add address:', err);
        wx.showToast({
          title: 'Failed to add address: ' + (err.message || 'Unknown error'),
          icon: 'none'
          });
        this.setData({ loading: false });
      });
  },

  // Update existing address
  onUpdateAddress: function() {
    if (!this.validateForm()) {
      return;
    }

    this.setData({ loading: true });
    
    const addressId = this.data.currentAddress.id;
    
    api.addresses.update(addressId, this.data.formData)
      .then(res => {
        wx.showToast({
          title: 'Address updated successfully',
          icon: 'success'
        });
        
        this.setData({
          showEditForm: false,
          currentAddress: null,
          formData: {
            name: '',
            phone: '',
            address: '',
            city: '',
            postalCode: '',
            isDefault: false
          }
        });
        
        // Reload addresses
        this.loadAddresses();
      })
      .catch(err => {
        console.error('Failed to update address:', err);
        wx.showToast({
          title: 'Failed to update address: ' + (err.message || 'Unknown error'),
          icon: 'none'
        });
        this.setData({ loading: false });
      });
  },

  // Delete address
  onDeleteAddress: function(e) {
    const address = e.currentTarget.dataset.address;
    
    wx.showModal({
      title: 'Confirm Delete',
      content: 'Are you sure you want to delete this address?',
      success: (res) => {
        if (res.confirm) {
          api.addresses.delete(address.id)
            .then(() => {
              wx.showToast({
                title: 'Address deleted',
                icon: 'success'
              });
              
              // Reload addresses
              this.loadAddresses();
            })
            .catch(err => {
              console.error('Failed to delete address:', err);
              wx.showToast({
                title: 'Failed to delete address',
                icon: 'none'
              });
            });
        }
      }
    });
  },

  // Set address as default
  onSetDefault: function(e) {
    const address = e.currentTarget.dataset.address;
    
    api.addresses.setDefault(address.id)
      .then(res => {
        wx.showToast({
          title: 'Default address set',
          icon: 'success'
        });
        
        // Reload addresses
        this.loadAddresses();
      })
      .catch(err => {
        console.error('Failed to set default address:', err);
        wx.showToast({
          title: 'Failed to set default address',
          icon: 'none'
        });
      });
  },

  // Validate form inputs
  validateForm: function() {
    const formData = this.data.formData;
    
    if (!formData.name || !formData.phone || !formData.address || 
        !formData.city || !formData.postalCode) {
      wx.showToast({
        title: 'Please fill all fields',
        icon: 'none'
      });
      return false;
    }

    return true;
  }
});