const CartItem = require('../models/CartItem');
const Product = require('../models/Product');

// Get cart items
const getCartItems = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get cart items
    const cartItems = await CartItem.find({ userId }).populate('productId', 'name image price');
    
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
    let cartItem = await CartItem.findOne({ userId, productId });
    
    if (cartItem) {
      // Update quantity
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      // Add new item
      cartItem = new CartItem({
        userId,
        productId,
        productName: product.name,
        productImage: product.image,
        price: product.price,
        quantity
      });
      await cartItem.save();
    }
    
    // Populate product details
    await cartItem.populate('productId', 'name image price');
    
    res.status(201).json({
      message: 'Item added to cart successfully',
      data: cartItem
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
    const cartItem = await CartItem.findOne({ _id: id, userId });
    if (!cartItem) {
      return res.status(404).json({ 
        message: 'Cart item not found or does not belong to user' 
      });
    }
    
    // Update item
    if (quantity !== undefined) cartItem.quantity = quantity;
    if (selected !== undefined) cartItem.selected = selected;
    
    await cartItem.save();
    
    // Populate product details
    await cartItem.populate('productId', 'name image price');
    
    res.json({
      message: 'Cart item updated successfully',
      data: cartItem
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
    const cartItem = await CartItem.findOneAndDelete({ _id: id, userId });
    if (!cartItem) {
      return res.status(404).json({ 
        message: 'Cart item not found or does not belong to user' 
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