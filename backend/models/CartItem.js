const { ObjectId } = require('mongodb');

// Cart Item model
class CartItem {
  constructor(data) {
    this.id = data.id || new ObjectId().toString();
    this.userId = data.userId;
    this.productId = data.productId;
    this.productName = data.productName;
    this.productImage = data.productImage || '';
    this.price = data.price;
    this.quantity = data.quantity || 1;
    this.selected = data.selected !== undefined ? data.selected : true;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }
  
  // Convert to plain object
  toObject() {
    return {
      id: this.id,
      userId: this.userId,
      productId: this.productId,
      productName: this.productName,
      productImage: this.productImage,
      price: this.price,
      quantity: this.quantity,
      selected: this.selected,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

// In-memory storage for demo purposes
// In a real application, this would be a database
const cartItems = [
  {
    id: '1',
    userId: '1',
    productId: '1',
    productName: 'Wireless Headphones',
    productImage: '/images/product1.png',
    price: 129.99,
    quantity: 1,
    selected: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    userId: '1',
    productId: '3',
    productName: 'Bluetooth Speaker',
    productImage: '/images/product3.png',
    price: 79.99,
    quantity: 2,
    selected: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Model methods
CartItem.findByUserId = async (userId) => {
  return cartItems.filter(item => item.userId === userId);
};

CartItem.findByUserIdAndProductId = async (userId, productId) => {
  return cartItems.find(item => item.userId === userId && item.productId === productId);
};

CartItem.findById = async (id) => {
  return cartItems.find(item => item.id === id);
};

CartItem.create = async (cartItemData) => {
  const newCartItem = new CartItem(cartItemData);
  cartItems.push(newCartItem.toObject());
  return newCartItem;
};

CartItem.update = async (id, updateData) => {
  const index = cartItems.findIndex(item => item.id === id);
  if (index === -1) return null;
  
  cartItems[index] = { ...cartItems[index], ...updateData, updatedAt: new Date() };
  return new CartItem(cartItems[index]);
};

CartItem.delete = async (id) => {
  const index = cartItems.findIndex(item => item.id === id);
  if (index === -1) return false;
  
  cartItems.splice(index, 1);
  return true;
};

CartItem.clearByUserId = async (userId) => {
  const initialLength = cartItems.length;
  for (let i = cartItems.length - 1; i >= 0; i--) {
    if (cartItems[i].userId === userId) {
      cartItems.splice(i, 1);
    }
  }
  return initialLength !== cartItems.length;
};

module.exports = CartItem;