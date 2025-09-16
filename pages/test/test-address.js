// Test page for address management functionality
const api = require('../../utils/api.js');

Page({
  data: {
    testResults: [],
    loading: false
  },

  onLoad: function() {
    // Run tests when page loads
    this.runTests();
  },

  // Add test result to display
  addTestResult: function(description, success, details = '') {
    const result = {
      description: description,
      success: success,
      details: details,
      timestamp: new Date().toLocaleTimeString()
    };
    
    this.setData({
      testResults: [...this.data.testResults, result]
    });
    
    console.log(`${success ? 'PASS' : 'FAIL'}: ${description}`, details);
  },

  // Run all tests
  runTests: function() {
    this.setData({ loading: true });
    this.setData({ testResults: [] });
    
    wx.showToast({
      title: 'Running tests...',
      icon: 'loading'
    });
    
    // Run tests sequentially
    this.testGetAddresses()
      .then(() => this.testCreateAddress())
      .then(() => this.testGetAddressesAfterCreate())
      .then(() => this.testUpdateAddress())
      .then(() => this.testSetDefaultAddress())
      .then(() => this.testGetAddressesAfterUpdate())
      .then(() => this.testDeleteAddress())
      .then(() => this.testGetAddressesAfterDelete())
      .catch(error => {
        console.error('Test execution error:', error);
        this.addTestResult('Test execution', false, error.message);
      })
      .finally(() => {
        this.setData({ loading: false });
        wx.hideToast();
        wx.showToast({
          title: 'Tests completed',
          icon: 'success'
        });
      });
  },

  // Test 1: Get user addresses
  testGetAddresses: function() {
    return api.addresses.getList()
      .then(res => {
        this.addTestResult('Get user addresses', true, `Found ${res.data.length} addresses`);
        return res.data;
      })
      .catch(err => {
        this.addTestResult('Get user addresses', false, err.message);
        throw err;
      });
  },

  // Test 2: Create a new address
  testCreateAddress: function() {
    const testAddress = {
      name: 'Test User',
      phone: '9876543210',
      address: '456 Test Street',
      city: 'Test City',
      postalCode: '54321',
      isDefault: false
    };
    
    return api.addresses.create(testAddress)
      .then(res => {
        this.addTestResult('Create new address', true, `Created address ID: ${res.data.id}`);
        this.setData({ testAddressId: res.data.id });
        return res.data;
      })
      .catch(err => {
        this.addTestResult('Create new address', false, err.message);
        throw err;
      });
  },

  // Test 3: Get addresses after creation
  testGetAddressesAfterCreate: function() {
    return api.addresses.getList()
      .then(res => {
        this.addTestResult('Get addresses after create', true, `Found ${res.data.length} addresses`);
        return res.data;
      })
      .catch(err => {
        this.addTestResult('Get addresses after create', false, err.message);
        throw err;
      });
  },

  // Test 4: Update an address
  testUpdateAddress: function() {
    const updatedAddress = {
      name: 'Updated Test User',
      phone: '1111111111',
      address: '789 Updated Street',
      city: 'Updated City',
      postalCode: '99999',
      isDefault: true
    };
    
    const addressId = this.data.testAddressId;
    if (!addressId) {
      this.addTestResult('Update address', false, 'No address ID available');
      return Promise.reject(new Error('No address ID available'));
    }
    
    return api.addresses.update(addressId, updatedAddress)
      .then(res => {
        this.addTestResult('Update address', true, `Updated address ID: ${res.data.id}`);
        return res.data;
      })
      .catch(err => {
        this.addTestResult('Update address', false, err.message);
        throw err;
      });
  },

  // Test 5: Set address as default
  testSetDefaultAddress: function() {
    const addressId = this.data.testAddressId;
    if (!addressId) {
      this.addTestResult('Set default address', false, 'No address ID available');
      return Promise.reject(new Error('No address ID available'));
    }
    
    return api.addresses.setDefault(addressId)
      .then(res => {
        this.addTestResult('Set default address', true, `Set address ID ${res.data.id} as default`);
        return res.data;
      })
      .catch(err => {
        this.addTestResult('Set default address', false, err.message);
        throw err;
      });
  },

  // Test 6: Get addresses after update
  testGetAddressesAfterUpdate: function() {
    return api.addresses.getList()
      .then(res => {
        this.addTestResult('Get addresses after update', true, `Found ${res.data.length} addresses`);
        return res.data;
      })
      .catch(err => {
        this.addTestResult('Get addresses after update', false, err.message);
        throw err;
      });
  },

  // Test 7: Delete an address
  testDeleteAddress: function() {
    const addressId = this.data.testAddressId;
    if (!addressId) {
      this.addTestResult('Delete address', false, 'No address ID available');
      return Promise.reject(new Error('No address ID available'));
    }
    
    return api.addresses.delete(addressId)
      .then(res => {
        this.addTestResult('Delete address', true, `Deleted address ID: ${addressId}`);
        return res;
      })
      .catch(err => {
        this.addTestResult('Delete address', false, err.message);
        throw err;
      });
  },

  // Test 8: Get addresses after deletion
  testGetAddressesAfterDelete: function() {
    return api.addresses.getList()
      .then(res => {
        this.addTestResult('Get addresses after delete', true, `Found ${res.data.length} addresses`);
        return res.data;
      })
      .catch(err => {
        this.addTestResult('Get addresses after delete', false, err.message);
        throw err;
      });
  },

  // Clear test results
  clearResults: function() {
    this.setData({ testResults: [] });
  }
});