const CartItem = require('../../models/mysql/CartItem');
const Product = require('../../models/mysql/Product');

// Get cart items
const getCartItems = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get cart items
    const cartItems = await CartItem.find({ user_id: userId });
    
    // Format the cart items to match frontend expectations (camelCase fields)
    const formattedCartItems = cartItems.map(item => ({
      id: item.id,
      userId: item.user_id,
      productId: item.product_id,
      productName: item.product_name,
      productImage: item.product_image,
      price: item.price,
      quantity: item.quantity,
      selected: item.selected,
      createdAt: item.created_at,
      updatedAt: item.updated_at
    }));
    
    res.json({
      message: 'Cart items retrieved successfully',
      data: formattedCartItems
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
    let cartItem = await CartItem.findOne({ user_id: userId, product_id: productId });
    
    if (cartItem) {
      // Update quantity
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      // Add new item
      cartItem = new CartItem({
        user_id: userId,
        product_id: productId,
        product_name: product.name,
        product_image: product.image,
        price: product.price,
        quantity,
        selected: true  // Add the missing selected field
      });
      await cartItem.save();
    }
    
    res.status(201).json({
      message: 'Item added to cart successfully',
      data: {
        id: cartItem.id,
        userId: cartItem.user_id,
        productId: cartItem.product_id,
        productName: cartItem.product_name,
        productImage: cartItem.product_image,
        price: cartItem.price,
        quantity: cartItem.quantity,
        selected: cartItem.selected,
        createdAt: cartItem.created_at,
        updatedAt: cartItem.updated_at
      }
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
    const cartItem = await CartItem.findOne({ id, user_id: userId });
    if (!cartItem) {
      return res.status(404).json({ 
        message: 'Cart item not found or does not belong to user' 
      });
    }
    
    // Update item
    if (quantity !== undefined) cartItem.quantity = quantity;
    if (selected !== undefined) cartItem.selected = selected;
    
    await cartItem.save();
    
    res.json({
      message: 'Cart item updated successfully',
      data: {
        id: cartItem.id,
        userId: cartItem.user_id,
        productId: cartItem.product_id,
        productName: cartItem.product_name,
        productImage: cartItem.product_image,
        price: cartItem.price,
        quantity: cartItem.quantity,
        selected: cartItem.selected,
        createdAt: cartItem.created_at,
        updatedAt: cartItem.updated_at
      }
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
    const cartItem = await CartItem.findOneAndDelete({ id, user_id: userId });
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