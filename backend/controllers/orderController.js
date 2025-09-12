const Order = require('../models/Order');
const CartItem = require('../models/CartItem');
const Product = require('../models/Product');
const { generatePaymentParams } = require('../utils/wechatPay');

// Get orders
const getOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get orders
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    
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
    
    // Get order
    const order = await Order.findOne({ _id: id, userId });
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
    const { items, shippingAddress } = req.body;
    
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
    
    // Calculate totals
    let subtotal = 0;
    const orderItems = [];
    
    // Validate items and calculate subtotal
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(400).json({ 
          message: `Product with ID ${item.productId} not found` 
        });
      }
      
      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;
      
      orderItems.push({
        productId: product._id,
        productName: product.name,
        productImage: product.image,
        quantity: item.quantity,
        price: product.price
      });
    }
    
    // Calculate shipping (free for orders over $100)
    const shippingFee = subtotal >= 100 ? 0 : 5.99;
    const totalAmount = subtotal + shippingFee;
    
    // Create order
    const order = new Order({
      userId,
      items: orderItems,
      subtotal,
      shippingFee,
      totalAmount,
      shippingAddress
    });
    
    await order.save();
    
    // Clear cart items after order creation
    await CartItem.deleteMany({ userId });
    
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
    
    // Get order
    const order = await Order.findOne({ _id: id, userId });
    if (!order) {
      return res.status(404).json({ 
        message: 'Order not found or does not belong to user' 
      });
    }
    
    // Check if order is already paid
    if (order.status !== 'pending') {
      return res.status(400).json({ 
        message: 'Order is not in pending status' 
      });
    }
    
    // Generate payment parameters for WeChat Pay
    const paymentParams = generatePaymentParams(
      order,
      process.env.WECHAT_APP_ID,
      process.env.WECHAT_PAY_MCH_ID,
      process.env.WECHAT_PAY_API_KEY
    );
    
    res.json({
      message: 'Payment parameters generated successfully',
      data: {
        orderId: order._id,
        orderNumber: order.orderNumber,
        totalAmount: order.totalAmount,
        paymentParams
      }
    });
  } catch (error) {
    console.error('Process payment error:', error);
    res.status(500).json({ 
      message: 'Internal server error' 
    });
  }
};

// Update order status (for payment notification)
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, paymentId } = req.body;
    
    // Get order
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ 
        message: 'Order not found' 
      });
    }
    
    // Update order status
    order.status = status;
    if (paymentId) order.paymentId = paymentId;
    
    // If order is paid, set estimated delivery date
    if (status === 'paid') {
      order.estimatedDelivery = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000); // 3 days from now
      order.trackingNumber = `TRK${Date.now()}`;
    }
    
    // If order is shipped, update status
    if (status === 'shipped') {
      // In a real app, this would be triggered by logistics system
    }
    
    await order.save();
    
    res.json({
      message: `Order status updated to ${status}`,
      data: order
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ 
      message: 'Internal server error' 
    });
  }
};

// Get tracking info
const getTrackingInfo = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    // Get order
    const order = await Order.findOne({ _id: id, userId });
    if (!order) {
      return res.status(404).json({ 
        message: 'Order not found or does not belong to user' 
      });
    }
    
    // Check if order is shipped
    if (order.status !== 'shipped' && order.status !== 'delivered') {
      return res.status(400).json({ 
        message: 'Order is not shipped yet' 
      });
    }
    
    // Sample tracking information
    const trackingInfo = {
      orderId: order._id,
      trackingNumber: order.trackingNumber,
      carrier: 'SF Express',
      status: order.status === 'delivered' ? 'Delivered' : 'In Transit',
      estimatedDelivery: order.estimatedDelivery,
      events: [
        {
          timestamp: order.createdAt,
          location: 'Order Processing Center',
          description: 'Order has been processed and is awaiting shipment',
          status: 'Order Placed'
        },
        {
          timestamp: new Date(order.updatedAt.getTime() - 2 * 24 * 60 * 60 * 1000),
          location: 'Shipping Facility',
          description: 'Order has been shipped',
          status: 'Shipped'
        },
        {
          timestamp: new Date(order.updatedAt.getTime() - 1 * 24 * 60 * 60 * 1000),
          location: 'Local Distribution Center',
          description: 'Order is out for delivery',
          status: 'Out for Delivery'
        }
      ]
    };
    
    // Add delivered event if order is delivered
    if (order.status === 'delivered') {
      trackingInfo.events.push({
        timestamp: order.updatedAt,
        location: 'Delivery Address',
        description: 'Order has been delivered',
        status: 'Delivered'
      });
    }
    
    res.json({
      message: 'Tracking information retrieved successfully',
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