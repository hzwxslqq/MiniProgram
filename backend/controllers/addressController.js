const UserAddress = require('../models/UserAddress');

// Get all addresses for current user
const getUserAddresses = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get user addresses
    const addresses = await UserAddress.find({ userId });
    
    res.json({
      message: 'Addresses retrieved successfully',
      data: addresses
    });
  } catch (error) {
    console.error('Get user addresses error:', error);
    res.status(500).json({ 
      message: 'Internal server error' 
    });
  }
};

// Create a new address
const createAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, phone, address, city, postalCode, isDefault } = req.body;
    
    // Validate input
    if (!name || !phone || !address || !city || !postalCode) {
      return res.status(400).json({ 
        message: 'All address fields are required' 
      });
    }
    
    // If this is set as default, unset other default addresses for this user
    if (isDefault) {
      const userAddresses = await UserAddress.find({ userId });
      for (const addr of userAddresses) {
        if (addr.isDefault) {
          addr.isDefault = false;
          await addr.save();
        }
      }
    }
    
    // Create address
    const userAddress = new UserAddress({
      userId,
      name,
      phone,
      address,
      city,
      postalCode,
      isDefault: isDefault || false
    });
    
    await userAddress.save();
    
    res.status(201).json({
      message: 'Address created successfully',
      data: userAddress
    });
  } catch (error) {
    console.error('Create address error:', error);
    res.status(500).json({ 
      message: 'Internal server error' 
    });
  }
};

// Update an existing address
const updateAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { name, phone, address, city, postalCode, isDefault } = req.body;
    
    // Get address
    const userAddress = await UserAddress.findById(id);
    if (!userAddress || userAddress.userId != userId) {  // Using loose equality to match both "1" and 1
      return res.status(404).json({ 
        message: 'Address not found or does not belong to user' 
      });
    }
    
    // If this is set as default, unset other default addresses for this user
    if (isDefault) {
      const userAddresses = await UserAddress.find({ userId });
      for (const addr of userAddresses) {
        if (addr.id !== id && addr.isDefault) {
          addr.isDefault = false;
          await addr.save();
        }
      }
    }
    
    // Update address fields
    if (name) userAddress.name = name;
    if (phone) userAddress.phone = phone;
    if (address) userAddress.address = address;
    if (city) userAddress.city = city;
    if (postalCode) userAddress.postalCode = postalCode;
    if (isDefault !== undefined) userAddress.isDefault = isDefault;
    
    await userAddress.save();
    
    res.json({
      message: 'Address updated successfully',
      data: userAddress
    });
  } catch (error) {
    console.error('Update address error:', error);
    res.status(500).json({ 
      message: 'Internal server error' 
    });
  }
};

// Delete an address
const deleteAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    // Get address
    const userAddress = await UserAddress.findById(id);
    if (!userAddress || userAddress.userId != userId) {  // Using loose equality to match both "1" and 1
      return res.status(404).json({ 
        message: 'Address not found or does not belong to user' 
      });
    }
    
    // Delete address
    await UserAddress.deleteById(id);
    
    res.json({
      message: 'Address deleted successfully'
    });
  } catch (error) {
    console.error('Delete address error:', error);
    res.status(500).json({ 
      message: 'Internal server error' 
    });
  }
};

// Set an address as default
const setDefaultAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    // Get address
    const userAddress = await UserAddress.findById(id);
    if (!userAddress || userAddress.userId != userId) {  // Using loose equality to match both "1" and 1
      return res.status(404).json({ 
        message: 'Address not found or does not belong to user' 
      });
    }
    
    // Unset other default addresses for this user
    const userAddresses = await UserAddress.find({ userId });
    for (const addr of userAddresses) {
      if (addr.id !== id && addr.isDefault) {
        addr.isDefault = false;
        await addr.save();
      }
    }
    
    // Set this address as default
    userAddress.isDefault = true;
    await userAddress.save();
    
    res.json({
      message: 'Default address set successfully',
      data: userAddress
    });
  } catch (error) {
    console.error('Set default address error:', error);
    res.status(500).json({ 
      message: 'Internal server error' 
    });
  }
};

module.exports = {
  getUserAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress
};