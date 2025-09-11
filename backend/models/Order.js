const { ObjectId } = require('mongodb');

// Order model
class Order {
  constructor(data) {
    this.id = data.id || new ObjectId().toString();
    this.userId = data.userId;
    this.orderNumber = data.orderNumber || this.generateOrderNumber();
    this.items = data.items || [];
    this.subtotal = data.subtotal || 0;
    this.shippingFee = data.shippingFee || 0;
    this.totalAmount = data.totalAmount || 0;
    this.status = data.status || 'pending'; // pending, paid, shipped, delivered, cancelled
    this.shippingAddress = data.shippingAddress || {};
    this.paymentMethod = data.paymentMethod || 'wechat_pay';
    this.paymentId = data.paymentId || '';
    this.trackingNumber = data.trackingNumber || '';
    this.estimatedDelivery = data.estimatedDelivery || '';
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
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
  
  // Convert to plain object
  toObject() {
    return {
      id: this.id,
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
      estimatedDelivery: this.estimatedDelivery,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

// Sample orders data for demo purposes
// In a real application, this would be a database
const orders = [
  new Order({
    id: '1',
    userId: '1',
    orderNumber: 'ORD-20230101-001',
    items: [
      {
        productId: '1',
        productName: 'Wireless Headphones',
        productImage: '/images/product1.png',
        quantity: 1,
        price: 129.99
      }
    ],
    subtotal: 129.99,
    shippingFee: 0,
    totalAmount: 129.99,
    status: 'delivered',
    shippingAddress: {
      name: 'John Doe',
      phone: '1234567890',
      address: '123 Main St',
      city: 'New York',
      postalCode: '10001'
    },
    paymentMethod: 'wechat_pay',
    paymentId: 'PAY-20230101-001',
    trackingNumber: 'TRK123456789',
    estimatedDelivery: '2023-01-15',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-15')
  }),
  new Order({
    id: '2',
    userId: '1',
    orderNumber: 'ORD-20230102-002',
    items: [
      {
        productId: '3',
        productName: 'Bluetooth Speaker',
        productImage: '/images/product3.png',
        quantity: 2,
        price: 79.99
      },
      {
        productId: '4',
        productName: 'Phone Case',
        productImage: '/images/product4.png',
        quantity: 1,
        price: 24.99
      }
    ],
    subtotal: 184.97,
    shippingFee: 5.99,
    totalAmount: 190.96,
    status: 'shipped',
    shippingAddress: {
      name: 'John Doe',
      phone: '1234567890',
      address: '123 Main St',
      city: 'New York',
      postalCode: '10001'
    },
    paymentMethod: 'wechat_pay',
    paymentId: 'PAY-20230102-002',
    trackingNumber: 'TRK987654321',
    estimatedDelivery: '2023-01-20',
    createdAt: new Date('2023-01-02'),
    updatedAt: new Date('2023-01-05')
  }),
  new Order({
    id: '3',
    userId: '1',
    orderNumber: 'ORD-20230103-003',
    items: [
      {
        productId: '5',
        productName: 'Laptop Backpack',
        productImage: '/images/product5.png',
        quantity: 1,
        price: 59.99
      }
    ],
    subtotal: 59.99,
    shippingFee: 0,
    totalAmount: 59.99,
    status: 'pending',
    shippingAddress: {
      name: 'John Doe',
      phone: '1234567890',
      address: '123 Main St',
      city: 'New York',
      postalCode: '10001'
    },
    paymentMethod: 'wechat_pay',
    paymentId: '',
    trackingNumber: '',
    estimatedDelivery: '',
    createdAt: new Date('2023-01-03'),
    updatedAt: new Date('2023-01-03')
  })
].map(order => order.toObject());

// Model methods
Order.findById = async (id) => {
  return orders.find(order => order.id === id);
};

Order.findByUserId = async (userId) => {
  return orders.filter(order => order.userId === userId);
};

Order.findByOrderNumber = async (orderNumber) => {
  return orders.find(order => order.orderNumber === orderNumber);
};

Order.create = async (orderData) => {
  const newOrder = new Order(orderData);
  orders.push(newOrder.toObject());
  return newOrder;
};

Order.update = async (id, updateData) => {
  const index = orders.findIndex(order => order.id === id);
  if (index === -1) return null;
  
  orders[index] = { ...orders[index], ...updateData, updatedAt: new Date() };
  return new Order(orders[index]);
};

module.exports = Order;