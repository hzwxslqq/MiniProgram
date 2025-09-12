const express = require('express');
const { 
  getOrders, 
  getOrderById, 
  createOrder, 
  processPayment,
  updateOrderStatus,
  getTrackingInfo
} = require('../controllers/orderController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Get orders
router.get('/', getOrders);

// Get order by ID
router.get('/:id', getOrderById);

// Create order
router.post('/', createOrder);

// Process payment
router.post('/:id/payment', processPayment);

// Update order status (for payment notification)
router.put('/:id/status', updateOrderStatus);

// Get tracking info
router.get('/:id/tracking', getTrackingInfo);

module.exports = router;