// Get all addresses for current user (MySQL version)
const getUserAddresses = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get user addresses from MySQL database
    const addresses = await global.UserAddress.find({ userId: userId });
    
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

// Create a new address (MySQL version)
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
      const userAddresses = await global.UserAddress.find({ userId: userId });
      for (const addr of userAddresses) {
        if (addr.isDefault) {
          addr.isDefault = false;
          await addr.save();
        }
      }
    }
    
    // Create address for MySQL database
    const userAddressData = {
      userId: userId,
      name,
      phone,
      address,
      city,
      postalCode,
      isDefault: isDefault || false
    };
    
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

// Update an existing address (MySQL version)
const updateAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { name, phone, address, city, postalCode, isDefault } = req.body;
    
    // Get address
    const userAddress = await global.UserAddress.findOne({ id: id, userId: userId });
    if (!userAddress) {
      return res.status(404).json({ 
        message: 'Address not found or does not belong to user' 
      });
    }
    
    // If this is set as default, unset other default addresses for this user
    if (isDefault) {
      const userAddresses = await global.UserAddress.find({ userId: userId });
      for (const addr of userAddresses) {
        if (addr.id !== parseInt(id) && addr.isDefault) {
          addr.isDefault = false;
          await addr.save();
        }
      }
    }
    
    // Update address fields for MySQL database
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

// Delete an address (MySQL version)
const deleteAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    // Get address
    const userAddress = await global.UserAddress.findOne({ id: id, userId: userId });
    if (!userAddress) {
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

// Set an address as default (MySQL version)
const setDefaultAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    // Get address
    const userAddress = await global.UserAddress.findOne({ id: id, userId: userId });
    if (!userAddress) {
      return res.status(404).json({ 
        message: 'Address not found or does not belong to user' 
      });
    }
    
    // Unset other default addresses for this user
    const userAddresses = await global.UserAddress.find({ userId: userId });
    for (const addr of userAddresses) {
      if (addr.id !== parseInt(id) && addr.isDefault) {
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