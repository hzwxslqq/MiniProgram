const Order = require('../../models/mysql/Order');
const CartItem = require('../../models/mysql/CartItem');

// Get orders
const getOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get orders sorted by creation date (newest first)
    const orders = await Order.find({ user_id: userId }, { sort: { created_at: -1 } });
    
    res.json({
      message: 'Orders retrieved successfully',
      data: orders
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ 
      message: 'Internal server error' 
    });
  }
};

// Get order by ID
const getOrderById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    const order = await Order.findOne({ id, user_id: userId });
    if (!order) {
      return res.status(404).json({ 
        message: 'Order not found or does not belong to user' 
      });
    }
    
    res.json({
      message: 'Order retrieved successfully',
      data: order
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ 
      message: 'Internal server error' 
    });
  }
};

// Create order
const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { items, shippingAddress, paymentMethod } = req.body;
    
    // Validate input
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ 
        message: 'Items are required' 
      });
    }
    
    if (!shippingAddress) {
      return res.status(400).json({ 
        message: 'Shipping address is required' 
      });
    }
    
    // Calculate order totals
    let subtotal = 0;
    for (const item of items) {
      subtotal += item.price * item.quantity;
    }
    
    const shippingFee = subtotal > 100 ? 0 : 5.99; // Free shipping for orders over $100
    const totalAmount = subtotal + shippingFee;
    
    // Create order
    const order = new Order({
      user_id: userId,
      items,
      subtotal,
      shipping_fee: shippingFee,
      total_amount: totalAmount,
      status: 'pending',
      shipping_address: shippingAddress,
      payment_method: paymentMethod
    });
    
    await order.save();
    
    // Clear cart items for this user
    await CartItem.deleteMany({ user_id: userId });
    
    res.status(201).json({
      message: 'Order created successfully',
      data: order
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ 
      message: 'Internal server error' 
    });
  }
};

// Process payment
const processPayment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { paymentMethod } = req.body;
    
    // Find order
    const order = await Order.findOne({ id, user_id: userId });
    if (!order) {
      return res.status(404).json({ 
        message: 'Order not found or does not belong to user' 
      });
    }
    
    // Update order status and payment info
    order.status = 'paid';
    order.payment_method = paymentMethod;
    order.payment_id = `PAY-${Date.now()}`; // Generate payment ID
    
    await order.save();
    
    res.json({
      message: 'Payment processed successfully',
      data: order
    });
  } catch (error) {
    console.error('Process payment error:', error);
    res.status(500).json({ 
      message: 'Internal server error' 
    });
  }
};

// Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { status } = req.body;
    
    // Find order
    const order = await Order.findOne({ id, user_id: userId });
    if (!order) {
      return res.status(404).json({ 
        message: 'Order not found or does not belong to user' 
      });
    }
    
    // Update order status
    order.status = status;
    await order.save();
    
    res.json({
      message: 'Order status updated successfully',
      data: order
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ 
      message: 'Internal server error' 
    });
  }
};

// Get logistics tracking info
const getTrackingInfo = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    const order = await Order.findOne({ id, user_id: userId });
    if (!order) {
      return res.status(404).json({ 
        message: 'Order not found or does not belong to user' 
      });
    }
    
    // In a real implementation, this would fetch tracking info from a logistics API
    const trackingInfo = {
      trackingNumber: order.tracking_number || 'TRK' + Date.now(),
      status: order.status,
      estimatedDelivery: order.estimated_delivery || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      events: [
        {
          status: 'Order Placed',
          timestamp: order.created_at,
          location: 'Order Processing Center'
        },
        {
          status: 'Shipped',
          timestamp: order.updated_at,
          location: 'Distribution Center'
        }
      ]
    };
    
    res.json({
      message: 'Tracking info retrieved successfully',
      data: trackingInfo
    });
  } catch (error) {
    console.error('Get tracking info error:', error);
    res.status(500).json({ 
      message: 'Internal server error' 
    });
  }
};

module.exports = {
  getOrders,
  getOrderById,
  createOrder,
  processPayment,
  updateOrderStatus,
  getTrackingInfo
};