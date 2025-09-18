const db = require('../utils/db');

// CartItem class
class CartItem {
  constructor(data) {
    this.id = data.id;
    this.userId = data.userId;
    this.productId = data.productId;
    this.productName = data.productName;
    this.productImage = data.productImage;
    this.price = data.price;
    this.quantity = data.quantity || 1;
    this.selected = data.selected !== undefined ? data.selected : true; // Default to selected
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
  
  // Save cart item
  async save() {
    if (this.id) {
      // Update existing cart item
      const updatedItem = db.update('cartItems', this.id, {
        userId: this.userId,
        productId: this.productId,
        productName: this.productName,
        productImage: this.productImage,
        price: this.price,
        quantity: this.quantity,
        selected: this.selected
      });
      Object.assign(this, updatedItem);
    } else {
      // Create new cart item
      const newItem = db.create('cartItems', {
        userId: this.userId,
        productId: this.productId,
        productName: this.productName,
        productImage: this.productImage,
        price: this.price,
        quantity: this.quantity,
        selected: this.selected
      });
      Object.assign(this, newItem);
    }
    return this;
  }
  
  // Static methods
  static async find(filter) {
    const items = db.findByFilter('cartItems', filter);
    return items.map(item => new CartItem(item));
  }
  
  static async findOne(filter) {
    const items = db.findByFilter('cartItems', filter);
    if (items.length === 0) return null;
    
    const item = items[0];
    return new CartItem(item);
  }
  
  static async findOneAndDelete(filter) {
    const items = db.findByFilter('cartItems', filter);
    if (items.length === 0) return null;
    
    const item = items[0];
    db.remove('cartItems', item.id);
    return new CartItem(item);
  }
  
  static async deleteMany(filter) {
    return db.removeByFilter('cartItems', filter);
  }
  
  static async populate(items, populateFields) {
    // For simplicity, we'll just return the items as is
    // In a real implementation, this would populate referenced documents
    return items;
  }
}

module.exports = CartItem;