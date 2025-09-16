const db = require('../utils/db');

// UserAddress class
class UserAddress {
  constructor(data) {
    this.id = data.id;
    this.userId = data.userId;
    this.name = data.name;
    this.phone = data.phone;
    this.address = data.address;
    this.city = data.city;
    this.postalCode = data.postalCode;
    this.isDefault = data.isDefault || false;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
  
  // Save user address
  async save() {
    if (this.id) {
      // Update existing address
      const updatedAddress = db.update('userAddresses', this.id, {
        userId: this.userId,
        name: this.name,
        phone: this.phone,
        address: this.address,
        city: this.city,
        postalCode: this.postalCode,
        isDefault: this.isDefault
      });
      Object.assign(this, updatedAddress);
    } else {
      // Create new address
      const newAddress = db.create('userAddresses', {
        userId: this.userId,
        name: this.name,
        phone: this.phone,
        address: this.address,
        city: this.city,
        postalCode: this.postalCode,
        isDefault: this.isDefault
      });
      Object.assign(this, newAddress);
    }
    return this;
  }
  
  // Static methods
  static async find(filter, options = {}) {
    let addresses = db.findByFilter('userAddresses', filter);
    
    // Apply sorting
    if (options.sort) {
      const sortField = Object.keys(options.sort)[0];
      const sortOrder = options.sort[sortField];
      addresses.sort((a, b) => {
        if (sortOrder === -1) {
          return new Date(b[sortField]) - new Date(a[sortField]);
        } else {
          return new Date(a[sortField]) - new Date(b[sortField]);
        }
      });
    }
    
    return addresses.map(address => new UserAddress(address));
  }
  
  static async findOne(filter) {
    const addresses = db.findByFilter('userAddresses', filter);
    if (addresses.length === 0) return null;
    
    const address = addresses[0];
    return new UserAddress(address);
  }
  
  static async findById(id) {
    const address = db.findById('userAddresses', id);
    if (!address) return null;
    return new UserAddress(address);
  }
  
  static async deleteById(id) {
    return db.remove('userAddresses', id);
  }
}

module.exports = UserAddress;