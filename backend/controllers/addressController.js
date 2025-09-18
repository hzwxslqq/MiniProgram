// Get all addresses for current user
const getUserAddresses = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get user addresses (handle both file and MySQL database types)
    const addresses = await global.UserAddress.find({ user_id: userId });
    
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
      const userAddresses = await global.UserAddress.find({ user_id: userId });
      for (const addr of userAddresses) {
        // Handle both file and MySQL database types
        const isDefaultField = addr.is_default !== undefined ? addr.is_default : addr.isDefault;
        if (isDefaultField) {
          // Set the correct field based on database type
          if (addr.is_default !== undefined) {
            addr.is_default = false;
          } else {
            addr.isDefault = false;
          }
          await addr.save();
        }
      }
    }
    
    // Create address (handle both file and MySQL database types)
    const userAddressData = {
      user_id: userId,
      name,
      phone,
      address,
      city,
      postal_code: postalCode,
      is_default: isDefault || false
    };
    
    // If using file database, map fields correctly
    if (global.UserAddress.name.includes('models/UserAddress')) {
      userAddressData.userId = userAddressData.user_id;
      userAddressData.postalCode = userAddressData.postal_code;
      userAddressData.isDefault = userAddressData.is_default;
      delete userAddressData.user_id;
      delete userAddressData.postal_code;
      delete userAddressData.is_default;
    }
    
    const userAddress = new global.UserAddress(userAddressData);
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
    const userAddress = await global.UserAddress.findById(id);
    if (!userAddress) {
      return res.status(404).json({ 
        message: 'Address not found' 
      });
    }
    
    // Check if address belongs to user (handle both file and MySQL database types)
    const addressUserId = userAddress.user_id !== undefined ? userAddress.user_id : userAddress.userId;
    if (addressUserId != userId) {  // Using loose equality to match both "1" and 1
      return res.status(404).json({ 
        message: 'Address not found or does not belong to user' 
      });
    }
    
    // If this is set as default, unset other default addresses for this user
    if (isDefault) {
      const userAddresses = await global.UserAddress.find({ user_id: userId });
      for (const addr of userAddresses) {
        if (addr.id !== id) {
          // Handle both file and MySQL database types
          const isDefaultField = addr.is_default !== undefined ? addr.is_default : addr.isDefault;
          if (isDefaultField) {
            // Set the correct field based on database type
            if (addr.is_default !== undefined) {
              addr.is_default = false;
            } else {
              addr.isDefault = false;
            }
            await addr.save();
          }
        }
      }
    }
    
    // Update address fields (handle both file and MySQL database types)
    if (name) userAddress.name = name;
    if (phone) userAddress.phone = phone;
    if (address) userAddress.address = address;
    if (city) userAddress.city = city;
    if (postalCode) {
      if (userAddress.postal_code !== undefined) {
        userAddress.postal_code = postalCode;
      } else {
        userAddress.postalCode = postalCode;
      }
    }
    if (isDefault !== undefined) {
      if (userAddress.is_default !== undefined) {
        userAddress.is_default = isDefault;
      } else {
        userAddress.isDefault = isDefault;
      }
    }
    
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
    const userAddress = await global.UserAddress.findById(id);
    if (!userAddress) {
      return res.status(404).json({ 
        message: 'Address not found' 
      });
    }
    
    // Check if address belongs to user (handle both file and MySQL database types)
    const addressUserId = userAddress.user_id !== undefined ? userAddress.user_id : userAddress.userId;
    if (addressUserId != userId) {  // Using loose equality to match both "1" and 1
      return res.status(404).json({ 
        message: 'Address not found or does not belong to user' 
      });
    }
    
    // Delete address
    await global.UserAddress.deleteById(id);
    
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
    const userAddress = await global.UserAddress.findById(id);
    if (!userAddress) {
      return res.status(404).json({ 
        message: 'Address not found' 
      });
    }
    
    // Check if address belongs to user (handle both file and MySQL database types)
    const addressUserId = userAddress.user_id !== undefined ? userAddress.user_id : userAddress.userId;
    if (addressUserId != userId) {  // Using loose equality to match both "1" and 1
      return res.status(404).json({ 
        message: 'Address not found or does not belong to user' 
      });
    }
    
    // Unset other default addresses for this user
    const userAddresses = await global.UserAddress.find({ user_id: userId });
    for (const addr of userAddresses) {
      if (addr.id !== id) {
        // Handle both file and MySQL database types
        const isDefaultField = addr.is_default !== undefined ? addr.is_default : addr.isDefault;
        if (isDefaultField) {
          // Set the correct field based on database type
          if (addr.is_default !== undefined) {
            addr.is_default = false;
          } else {
            addr.isDefault = false;
          }
          await addr.save();
        }
      }
    }
    
    // Set this address as default (handle both file and MySQL database types)
    if (userAddress.is_default !== undefined) {
      userAddress.is_default = true;
    } else {
      userAddress.isDefault = true;
    }
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