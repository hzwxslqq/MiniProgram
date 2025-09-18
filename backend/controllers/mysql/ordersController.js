const Order = require('../../models/mysql/Order');
const CartItem = require('../../models/mysql/CartItem');
const Product = require('../../models/mysql/Product');

// Get orders
const getOrders = async (req, res) => {
  try {
    // For testing purposes, allow fetching orders without authentication
    // In a production environment, you would require authentication
    let userId = 1; // Default to user ID 1 for testing
    if (req.user && req.user.id) {
      userId = req.user.id;
    } else {
      console.log('No authenticated user, using default user ID for testing');
    }
    
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
    // For testing purposes, allow fetching order without authentication
    // In a production environment, you would require authentication
    let userId = 1; // Default to user ID 1 for testing
    if (req.user && req.user.id) {
      userId = req.user.id;
    } else {
      console.log('No authenticated user, using default user ID for testing');
    }
    
    const { id } = req.params;
    
    // Convert order ID to integer for database query
    const orderId = parseInt(id);
    if (isNaN(orderId)) {
      return res.status(400).json({ 
        message: 'Invalid order ID format' 
      });
    }
    
    const order = await Order.findOne({ id: orderId }); // Remove user_id filter for testing
    if (!order) {
      return res.status(404).json({ 
        message: 'Order not found' 
      });
    }
    
    // Format the order data to match frontend expectations (camelCase fields)
    const formattedOrder = {
      id: order.id,
      userId: order.user_id,
      orderNumber: order.order_number,
      items: order.items.map(item => ({
        productId: item.productId,
        productName: item.productName,
        productImage: item.productImage,
        quantity: item.quantity,
        price: item.price
      })),
      subtotal: parseFloat(order.subtotal),
      shippingFee: parseFloat(order.shipping_fee),
      totalAmount: parseFloat(order.total_amount),
      status: order.status,
      shippingAddress: order.shipping_address,
      paymentMethod: order.payment_method,
      paymentId: order.payment_id,
      trackingNumber: order.tracking_number,
      estimatedDelivery: order.estimated_delivery,
      createdAt: order.created_at,
      updatedAt: order.updated_at
    };
    
    res.json({
      message: 'Order retrieved successfully',
      data: formattedOrder
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
    
    // Debug logging
    console.log('=== CREATE ORDER DEBUG ===');
    console.log('User ID:', userId);
    console.log('Request body:', req.body);
    console.log('Items received:', items);
    
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
    
    // Calculate order totals and enrich items with product information
    let subtotal = 0;
    const enrichedItems = [];
    
    // Look up each product to get price and name
    for (const item of items) {
      console.log('Processing item:', item);
      
      // Check if productId exists
      if (!item.productId) {
        console.error('Item missing productId:', item);
        return res.status(400).json({ 
          message: `Item missing product ID: ${JSON.stringify(item)}` 
        });
      }
      
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(400).json({ 
          message: `Product with ID ${item.productId} not found` 
        });
      }
      
      const itemTotal = parseFloat(product.price) * item.quantity;
      subtotal += itemTotal;
      
      // Enrich item with product information
      enrichedItems.push({
        productId: product.id,
        productName: product.name,
        productImage: product.image,
        quantity: item.quantity,
        price: parseFloat(product.price)
      });
    }
    
    const shippingFee = parseFloat(subtotal) >= 100 ? 0 : 5.99; // Free shipping for orders over $100
    const totalAmount = subtotal + shippingFee;
    
    // Create order
    const order = new Order({
      user_id: userId,
      items: enrichedItems,
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
    
    // Convert order ID to integer for database query
    const orderId = parseInt(id);
    if (isNaN(orderId)) {
      return res.status(400).json({ 
        message: 'Invalid order ID format' 
      });
    }
    
    // Find order
    const order = await Order.findOne({ id: orderId, user_id: userId });
    if (!order) {
      return res.status(404).json({ 
        message: 'Order not found or does not belong to user' 
      });
    }
    
    // Update order status and payment info
    order.status = 'paid';
    order.payment_method = paymentMethod;
    order.payment_id = `PAY-${Date.now()}`; // Generate payment ID
    
    // Assign tracking number when order is paid
    order.tracking_number = `YD${Date.now()}`; // YD prefix for Yunda Express
    order.estimated_delivery = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000); // 3 days from now
    
    await order.save();
    
    res.json({
      message: 'Payment processed successfully',
      data: {
        id: order.id,
        orderNumber: order.order_number,
        status: order.status,
        totalAmount: order.total_amount,
        items: order.items,
        trackingNumber: order.tracking_number,
        estimatedDelivery: order.estimated_delivery,
        createdAt: order.created_at,
        updatedAt: order.updated_at
      }
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
    
    // Convert order ID to integer for database query
    const orderId = parseInt(id);
    if (isNaN(orderId)) {
      return res.status(400).json({ 
        message: 'Invalid order ID format' 
      });
    }
    
    // Find order
    const order = await Order.findOne({ id: orderId, user_id: userId });
    if (!order) {
      return res.status(404).json({ 
        message: 'Order not found or does not belong to user' 
      });
    }
    
    // Update order status
    order.status = status;
    
    // If order is shipped, ensure tracking number follows Yunda format
    if (status === 'shipped' && order.tracking_number) {
      // Ensure tracking number follows Yunda format (12-15 digits)
      // If it doesn't already follow Yunda format, we could generate a new one
      // For now, we'll just make sure it exists
      if (!order.tracking_number.startsWith('YD')) {
        order.tracking_number = `YD${Date.now()}`;
      }
    }
    
    await order.save();
    
    res.json({
      message: 'Order status updated successfully',
      data: {
        id: order.id,
        orderNumber: order.order_number,
        status: order.status,
        totalAmount: order.total_amount,
        items: order.items,
        trackingNumber: order.tracking_number,
        estimatedDelivery: order.estimated_delivery,
        createdAt: order.created_at,
        updatedAt: order.updated_at
      }
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
    
    // Convert order ID to integer for database query
    const orderId = parseInt(id);
    if (isNaN(orderId)) {
      return res.status(400).json({ 
        message: 'Invalid order ID format' 
      });
    }
    
    const order = await Order.findOne({ id: orderId, user_id: userId });
    if (!order) {
      return res.status(404).json({ 
        message: 'Order not found or does not belong to user' 
      });
    }
    
    // Check if order has tracking number and is shipped
    if (!order.tracking_number) {
      return res.status(400).json({ 
        message: 'Order does not have a tracking number yet' 
      });
    }
    
    if (order.status !== 'shipped' && order.status !== 'delivered') {
      return res.status(400).json({ 
        message: 'Order is not shipped yet' 
      });
    }
    
    // Fetch tracking info from logistics API
    const logisticsTrackingInfo = await getLogisticsTrackingInfo(order.tracking_number);
    
    const trackingInfo = {
      orderId: order.id,
      trackingNumber: logisticsTrackingInfo.trackingNumber,
      carrier: logisticsTrackingInfo.carrier || 'Yunda Express',
      status: logisticsTrackingInfo.status,
      estimatedDelivery: logisticsTrackingInfo.estimatedDelivery,
      events: logisticsTrackingInfo.events.map(event => ({
        status: event.status,
        timestamp: event.timestamp,
        location: event.location,
        description: event.description || ''
      }))
    };
    
    res.json({
      message: 'Tracking info retrieved successfully',
      data: trackingInfo
    });
  } catch (error) {
    console.error('Get tracking info error:', error);
    res.status(500).json({ 
      message: error.message || 'Internal server error' 
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