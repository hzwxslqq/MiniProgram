const express = require('express');
const { 
  getUserAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress
} = require('../../controllers/mysql/addressController');
const { authenticate } = require('../../middleware/auth');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Get user addresses
router.get('/', getUserAddresses);

// Create a new address
router.post('/', createAddress);

// Update an address
router.put('/:id', updateAddress);

// Delete an address
router.delete('/:id', deleteAddress);

// Set an address as default
router.put('/:id/default', setDefaultAddress);

module.exports = router;