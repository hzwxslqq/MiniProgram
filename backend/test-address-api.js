// Test script for address API endpoints
const axios = require('axios');

// Base URL for the API
const BASE_URL = 'http://localhost:3000';

// Test user credentials (using default admin user)
const TEST_USER = {
  username: 'admin',
  password: 'admin123'
};

// Test address data
const TEST_ADDRESS = {
  name: 'Test User',
  phone: '9876543210',
  address: '456 Test Street',
  city: 'Test City',
  postalCode: '54321',
  isDefault: false
};

// Updated address data
const UPDATED_ADDRESS = {
  name: 'Updated Test User',
  phone: '1111111111',
  address: '789 Updated Street',
  city: 'Updated City',
  postalCode: '99999',
  isDefault: true
};

let authToken = '';
let testAddressId = '';

// Function to login and get auth token
async function login() {
  try {
    console.log('Logging in...');
    const response = await axios.post(`${BASE_URL}/api/auth/login`, TEST_USER);
    authToken = response.data.token;
    console.log('Login successful. Token:', authToken.substring(0, 20) + '...');
    return true;
  } catch (error) {
    console.error('Login failed:', error.response?.data || error.message);
    return false;
  }
}

// Function to get user addresses
async function getUserAddresses() {
  try {
    console.log('Getting user addresses...');
    const response = await axios.get(`${BASE_URL}/api/user/addresses`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    console.log('Get addresses successful. Count:', response.data.data.length);
    console.log('Addresses:', response.data.data);
    return response.data.data;
  } catch (error) {
    console.error('Get addresses failed:', error.response?.data || error.message);
    return null;
  }
}

// Function to create a new address
async function createAddress() {
  try {
    console.log('Creating new address...');
    const response = await axios.post(`${BASE_URL}/api/user/addresses`, TEST_ADDRESS, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    testAddressId = response.data.data.id;
    console.log('Create address successful. ID:', testAddressId);
    console.log('Created address:', response.data.data);
    return true;
  } catch (error) {
    console.error('Create address failed:', error.response?.data || error.message);
    return false;
  }
}

// Function to update an address
async function updateAddress() {
  try {
    console.log('Updating address...');
    const response = await axios.put(`${BASE_URL}/api/user/addresses/${testAddressId}`, UPDATED_ADDRESS, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    console.log('Update address successful.');
    console.log('Updated address:', response.data.data);
    return true;
  } catch (error) {
    console.error('Update address failed:', error.response?.data || error.message);
    return false;
  }
}

// Function to set an address as default
async function setDefaultAddress() {
  try {
    console.log('Setting address as default...');
    const response = await axios.put(`${BASE_URL}/api/user/addresses/${testAddressId}/default`, {}, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    console.log('Set default address successful.');
    console.log('Default address:', response.data.data);
    return true;
  } catch (error) {
    console.error('Set default address failed:', error.response?.data || error.message);
    return false;
  }
}

// Function to delete an address
async function deleteAddress() {
  try {
    console.log('Deleting address...');
    const response = await axios.delete(`${BASE_URL}/api/user/addresses/${testAddressId}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    console.log('Delete address successful.');
    console.log('Response:', response.data);
    return true;
  } catch (error) {
    console.error('Delete address failed:', error.response?.data || error.message);
    return false;
  }
}

// Main test function
async function runTests() {
  console.log('Starting address API tests...\n');
  
  // Login first
  if (!(await login())) {
    console.log('Cannot proceed with tests without authentication.');
    return;
  }
  
  console.log('\n--- Test 1: Get initial addresses ---');
  await getUserAddresses();
  
  console.log('\n--- Test 2: Create new address ---');
  if (!(await createAddress())) {
    console.log('Cannot proceed with remaining tests.');
    return;
  }
  
  console.log('\n--- Test 3: Get addresses after creation ---');
  await getUserAddresses();
  
  console.log('\n--- Test 4: Update address ---');
  if (!(await updateAddress())) {
    console.log('Cannot proceed with remaining tests.');
    return;
  }
  
  console.log('\n--- Test 5: Set address as default ---');
  await setDefaultAddress();
  
  console.log('\n--- Test 6: Get addresses after update ---');
  await getUserAddresses();
  
  console.log('\n--- Test 7: Delete address ---');
  if (!(await deleteAddress())) {
    console.log('Failed to delete test address.');
  }
  
  console.log('\n--- Test 8: Get addresses after deletion ---');
  await getUserAddresses();
  
  console.log('\nAll tests completed.');
}

// Run the tests
runTests().catch(error => {
  console.error('Test execution failed:', error);
});