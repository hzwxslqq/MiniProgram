const { v4: uuidv4 } = require('uuid');
const db = require('../utils/db');

// Order class for file-based database
class Order {
  constructor(data) {
    this.id = data.id || uuidv4();
    this.userId = data.userId || data.user_id;
    this.orderNumber = data.orderNumber || data.order_number || this.generateOrderNumber();
    this.items = data.items || [];
    this.subtotal = data.subtotal || 0;
    this.shippingFee = data.shippingFee !== undefined ? data.shippingFee : (data.shipping_fee !== undefined ? data.shipping_fee : 0);
    this.totalAmount = data.totalAmount !== undefined ? data.totalAmount : (data.total_amount !== undefined ? data.total_amount : 0);
    this.status = data.status || 'pending';
    this.shippingAddress = data.shippingAddress || data.shipping_address || {};
    this.paymentMethod = data.paymentMethod || data.payment_method || 'wechat_pay';
    this.paymentId = data.paymentId || data.payment_id || null;
    this.trackingNumber = data.trackingNumber || data.tracking_number || null;
    this.estimatedDelivery = data.estimatedDelivery || data.estimated_delivery || null;
    this.createdAt = data.createdAt || data.created_at || new Date().toISOString();
    this.updatedAt = data.updatedAt || data.updated_at || new Date().toISOString();
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
    try {
      const orders = await db.read('orders');
      const existingOrderIndex = orders.findIndex(order => order.id === this.id);
      
      if (existingOrderIndex !== -1) {
        // Update existing order
        orders[existingOrderIndex] = this;
      } else {
        // Create new order
        orders.push(this);
      }
      
      await db.write('orders', orders);
      return true;
    } catch (error) {
      console.error('Error saving order:', error);
      return false;
    }
  }
  
  // Static methods
  static async find(filter, options = {}) {
    try {
      const orders = await db.read('orders');
      let filteredOrders = orders;
      
      // Apply filters
      if (filter) {
        filteredOrders = orders.filter(order => {
          for (const key in filter) {
            // Handle both camelCase and snake_case field names
            const orderValue = order[key] !== undefined ? order[key] : 
                              order[key.replace(/([A-Z])/g, '_$1').toLowerCase()];
            if (orderValue != filter[key]) { // Using loose equality to match both "1" and 1
              return false;
            }
          }
          return true;
        });
      }
      
      // Apply sorting
      if (options.sort) {
        const sortField = Object.keys(options.sort)[0];
        const sortOrder = options.sort[sortField];
        filteredOrders.sort((a, b) => {
          // Handle both camelCase and snake_case field names
          const aValue = a[sortField] !== undefined ? a[sortField] : 
                        a[sortField.replace(/([A-Z])/g, '_$1').toLowerCase()];
          const bValue = b[sortField] !== undefined ? b[sortField] : 
                        b[sortField.replace(/([A-Z])/g, '_$1').toLowerCase()];
          
          if (sortOrder === -1) {
            return new Date(bValue) - new Date(aValue); // Descending
          } else {
            return new Date(aValue) - new Date(bValue); // Ascending
          }
        });
      }
      
      return filteredOrders.map(order => new Order(order));
    } catch (error) {
      console.error('Error finding orders:', error);
      return [];
    }
  }
  
  static async findOne(filter) {
    try {
      const orders = await this.find(filter);
      return orders.length > 0 ? new Order(orders[0]) : null;
    } catch (error) {
      console.error('Error finding order:', error);
      return null;
    }
  }
  
  static async findById(id) {
    try {
      const orders = await db.read('orders');
      const order = orders.find(o => o.id === id);
      return order ? new Order(order) : null;
    } catch (error) {
      console.error('Error finding order by ID:', error);
      return null;
    }
  }
  
  static async deleteMany(filter) {
    try {
      const orders = await db.read('orders');
      const filteredOrders = orders.filter(order => {
        for (const key in filter) {
          // Handle both camelCase and snake_case field names
          const orderValue = order[key] !== undefined ? order[key] : 
                            order[key.replace(/([A-Z])/g, '_$1').toLowerCase()];
          if (orderValue != filter[key]) { // Using loose equality to match both "1" and 1
            return true; // Keep this order (don't delete)
          }
        }
        return false; // Delete this order
      });
      
      await db.write('orders', filteredOrders);
      return { deletedCount: orders.length - filteredOrders.length };
    } catch (error) {
      console.error('Error deleting orders:', error);
      return { deletedCount: 0 };
    }
  }
}

module.exports = Order;