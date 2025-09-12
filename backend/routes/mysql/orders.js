const express = require('express');
const { getOrders, getOrderById, createOrder, processPayment, updateOrderStatus, getTrackingInfo } = require('../../controllers/mysql/ordersController');
const auth = require('../../middleware/auth');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(auth);

// Get orders
router.get('/', getOrders);

// Get order by ID
router.get('/:id', getOrderById);

// Create order
router.post('/', createOrder);

// Process payment
router.post('/:id/payment', processPayment);

// Update order status
router.put('/:id/status', updateOrderStatus);

// Get logistics tracking info
router.get('/:id/tracking', getTrackingInfo);

module.exports = router;