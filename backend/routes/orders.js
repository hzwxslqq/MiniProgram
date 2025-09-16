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

// Apply authentication middleware to all routes except webhook
router.use((req, res, next) => {
  // Skip authentication for webhook endpoint
  if (req.path === '/payment-webhook') {
    return next();
  }
  authenticate(req, res, next);
});

// Get orders
router.get('/', getOrders);

// Get order by ID
router.get('/:id', getOrderById);

// Create order
router.post('/', createOrder);

// Process payment
router.post('/:id/payment', processPayment);

// Payment webhook (no authentication required)
router.post('/payment-webhook', paymentWebhook);

// Update order status (for payment notification)
router.put('/:id/status', updateOrderStatus);

// Get tracking info
router.get('/:id/tracking', getTrackingInfo);

module.exports = router;