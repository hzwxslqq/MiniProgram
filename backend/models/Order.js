const db = require('../utils/db');

// Order class
class Order {
  constructor(data) {
    this.id = data.id;
    this.userId = data.userId;
    this.orderNumber = data.orderNumber;
    this.items = data.items;
    this.subtotal = data.subtotal;
    this.shippingFee = data.shippingFee;
    this.totalAmount = data.totalAmount;
    this.status = data.status || 'pending'; // Set default status to pending
    this.shippingAddress = data.shippingAddress;
    this.paymentMethod = data.paymentMethod;
    this.paymentId = data.paymentId;
    this.trackingNumber = data.trackingNumber;
    this.estimatedDelivery = data.estimatedDelivery;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
  
  // Generate order number
  generateOrderNumber() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `ORD-${year}${month}${day}-${random}`;
  }
  
  // Save order
  async save() {
    if (this.id) {
      // Update existing order
      const updatedOrder = db.update('orders', this.id, {
        userId: this.userId,
        orderNumber: this.orderNumber,
        items: this.items,
        subtotal: this.subtotal,
        shippingFee: this.shippingFee,
        totalAmount: this.totalAmount,
        status: this.status,
        shippingAddress: this.shippingAddress,
        paymentMethod: this.paymentMethod,
        paymentId: this.paymentId,
        trackingNumber: this.trackingNumber,
        estimatedDelivery: this.estimatedDelivery
      });
      Object.assign(this, updatedOrder);
    } else {
      // Create new order
      // Generate order number if not provided
      if (!this.orderNumber) {
        this.orderNumber = this.generateOrderNumber();
      }
      
      const newOrder = db.create('orders', {
        userId: this.userId,
        orderNumber: this.orderNumber,
        items: this.items,
        subtotal: this.subtotal,
        shippingFee: this.shippingFee,
        totalAmount: this.totalAmount,
        status: this.status,
        shippingAddress: this.shippingAddress,
        paymentMethod: this.paymentMethod,
        paymentId: this.paymentId,
        trackingNumber: this.trackingNumber,
        estimatedDelivery: this.estimatedDelivery
      });
      Object.assign(this, newOrder);
    }
    return this;
  }
  
  // Static methods
  static async find(filter, options = {}) {
    let orders = db.findByFilter('orders', filter);
    
    // Apply sorting
    if (options.sort) {
      const sortField = Object.keys(options.sort)[0];
      const sortOrder = options.sort[sortField];
      orders.sort((a, b) => {
        if (sortOrder === -1) {
          return new Date(b[sortField]) - new Date(a[sortField]);
        } else {
          return new Date(a[sortField]) - new Date(b[sortField]);
        }
      });
    }
    
    return orders.map(order => new Order(order));
  }
  
  static async findOne(filter) {
    const orders = db.findByFilter('orders', filter);
    if (orders.length === 0) return null;
    
    const order = orders[0];
    return new Order(order);
  }
  
  static async findById(id) {
    const order = db.findById('orders', id);
    if (!order) return null;
    return new Order(order);
  }
}

module.exports = Order;