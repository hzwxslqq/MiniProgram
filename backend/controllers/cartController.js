const CartItem = require('../models/CartItem');
const Product = require('../models/Product');

// Get cart items
const getCartItems = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get cart items
    const cartItems = await CartItem.findByUserId(userId);
    
    res.json({
      message: 'Cart items retrieved successfully',
      data: cartItems
    });
  } catch (error) {
    console.error('Get cart items error:', error);
    res.status(500).json({ 
      message: 'Internal server error' 
    });
  }
};

// Add item to cart
const addItemToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity = 1 } = req.body;
    
    // Validate input
    if (!productId) {
      return res.status(400).json({ 
        message: 'Product ID is required' 
      });
    }
    
    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ 
        message: 'Product not found' 
      });
    }
    
    // Check if item already in cart
    let cartItem = await CartItem.findByUserIdAndProductId(userId, productId);
    
    if (cartItem) {
      // Update quantity
      const newQuantity = cartItem.quantity + quantity;
      cartItem = await CartItem.update(cartItem.id, { 
        quantity: newQuantity,
        updatedAt: new Date()
      });
    } else {
      // Add new item
      cartItem = await CartItem.create({
        userId,
        productId,
        productName: product.name,
        productImage: product.image,
        price: product.price,
        quantity
      });
    }
    
    res.status(201).json({
      message: 'Item added to cart successfully',
      data: cartItem.toObject()
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ 
      message: 'Internal server error' 
    });
  }
};

// Update cart item
const updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { quantity, selected } = req.body;
    
    // Validate input
    if (quantity !== undefined && quantity <= 0) {
      return res.status(400).json({ 
        message: 'Quantity must be greater than 0' 
      });
    }
    
    // Check if item exists and belongs to user
    const cartItem = await CartItem.findById(id);
    if (!cartItem) {
      return res.status(404).json({ 
        message: 'Cart item not found' 
      });
    }
    
    if (cartItem.userId !== userId) {
      return res.status(403).json({ 
        message: 'Forbidden' 
      });
    }
    
    // Update item
    const updateData = {};
    if (quantity !== undefined) updateData.quantity = quantity;
    if (selected !== undefined) updateData.selected = selected;
    
    const updatedItem = await CartItem.update(id, updateData);
    
    res.json({
      message: 'Cart item updated successfully',
      data: updatedItem.toObject()
    });
  } catch (error) {
    console.error('Update cart item error:', error);
    res.status(500).json({ 
      message: 'Internal server error' 
    });
  }
};

// Remove item from cart
const removeCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    // Check if item exists and belongs to user
    const cartItem = await CartItem.findById(id);
    if (!cartItem) {
      return res.status(404).json({ 
        message: 'Cart item not found' 
      });
    }
    
    if (cartItem.userId !== userId) {
      return res.status(403).json({ 
        message: 'Forbidden' 
      });
    }
    
    // Remove item
    const result = await CartItem.delete(id);
    if (!result) {
      return res.status(500).json({ 
        message: 'Failed to remove item' 
      });
    }
    
    res.json({
      message: 'Item removed from cart successfully'
    });
  } catch (error) {
    console.error('Remove cart item error:', error);
    res.status(500).json({ 
      message: 'Internal server error' 
    });
  }
};

module.exports = {
  getCartItems,
  addItemToCart,
  updateCartItem,
  removeCartItem
};