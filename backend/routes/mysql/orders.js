const express = require('express');
const { getOrders, getOrderById, createOrder, processPayment, updateOrderStatus, getTrackingInfo } = require('../../controllers/mysql/ordersController');
const auth = require('../../middleware/auth');

const router = express.Router();

// For testing purposes, disable authentication for GET routes
// In production, you would enable authentication

// Get orders (no authentication required for testing)
router.get('/', getOrders);

// Get order by ID (no authentication required for testing)
router.get('/:id', getOrderById);

// Get tracking info (no authentication required for testing)
router.get('/:id/tracking', getTrackingInfo);

// Apply authentication middleware to POST routes
router.use(auth.authenticate);

// Create order (authentication required)
router.post('/', createOrder);

// Process payment (authentication required)
router.post('/:id/payment', processPayment);

// Update order status (authentication required)
router.put('/:id/status', updateOrderStatus);

module.exports = router;