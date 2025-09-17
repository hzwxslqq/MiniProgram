const express = require('express');
const { getCartItems, addItemToCart, updateCartItem, removeCartItem } = require('../../controllers/mysql/cartController');
const auth = require('../../middleware/auth');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(auth.authenticate);

// Get cart items
router.get('/', getCartItems);

// Add item to cart
router.post('/', addItemToCart);

// Update cart item
router.put('/:id', updateCartItem);

// Remove item from cart
router.delete('/:id', removeCartItem);

module.exports = router;