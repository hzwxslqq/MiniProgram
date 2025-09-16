const express = require('express');
const { 
  getOrders, 
  getOrderById, 
  createOrder, 
  processPayment,
  paymentWebhook,
  updateOrderStatus,
  getTrackingInfo
} = require('../controllers/orderController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// For testing purposes, disable authentication for all order routes
// In production, you would enable authentication

// Get orders (no authentication required for testing)
router.get('/', getOrders);

// Get order by ID (no authentication required for testing)
router.get('/:id', getOrderById);

// Create order (no authentication required for testing)
router.post('/', createOrder);

// Process payment (no authentication required for testing)
router.post('/:id/payment', processPayment);

// Payment webhook (no authentication required)
router.post('/payment-webhook', paymentWebhook);

// Update order status (for payment notification) (no authentication required for testing)
router.put('/:id/status', updateOrderStatus);

// Get tracking info (no authentication required for testing)
router.get('/:id/tracking', getTrackingInfo);

module.exports = router;