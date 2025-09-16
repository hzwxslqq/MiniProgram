const bcrypt = require('bcryptjs');
const db = require('../utils/db');

// User class
class User {
  constructor(data) {
    this.id = data.id;
    this.username = data.username;
    this.password = data.password;
    this.email = data.email;
    this.phone = data.phone;
    this.avatar = data.avatar;
    this.wechatOpenId = data.wechatOpenId; // Add WeChat openid field
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
  
  // Compare password method
  async comparePassword(candidatePassword) {
    // For WeChat mobile users, password is a placeholder and not used
    if (this.password === 'wechat_mobile_user') {
      return false; // WeChat users should use WeChat login, not password login
    }
    return bcrypt.compare(candidatePassword, this.password);
  }
  
  // Remove password from JSON output
  toJSON() {
    const userObject = { ...this };
    delete userObject.password;
    return userObject;
  }
  
  // Save user
  async save() {
    // Validate required fields
    if (!this.username) {
      throw new Error('Username is required');
    }
    
    if (!this.password && !this.wechatOpenId) {
      throw new Error('Either password or WeChat openid is required');
    }
    
    if (this.id) {
      // Update existing user
      const updatedUser = db.update('users', this.id, {
        username: this.username,
        password: this.password,
        email: this.email,
        phone: this.phone,
        avatar: this.avatar,
        wechatOpenId: this.wechatOpenId
      });
      Object.assign(this, updatedUser);
    } else {
      // Create new user
      // Hash password before saving (only if it's not a placeholder for WeChat login)
      if (this.password && this.password !== 'wechat_mobile_user') {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
      }
      
      // Ensure unique username
      let uniqueUsername = this.username;
      let counter = 1;
      while (await User.findOne({ username: uniqueUsername })) {
        uniqueUsername = `${this.username}_${counter}`;
        counter++;
      }
      this.username = uniqueUsername;
      
      const newUser = db.create('users', {
        username: this.username,
        password: this.password,
        email: this.email,
        phone: this.phone,
        avatar: this.avatar,
        wechatOpenId: this.wechatOpenId
      });
      Object.assign(this, newUser);
    }
    return this;
  }
  
  // Static methods
  static async findOne(filter) {
    const users = db.findByFilter('users', filter);
    if (users.length === 0) return null;
    
    const user = users[0];
    return new User(user);
  }
  
  static async find(filter) {
    const users = db.findByFilter('users', filter);
    return users.map(user => new User(user));
  }
  
  static async findById(id) {
    const user = db.findById('users', id);
    if (!user) return null;
    return new User(user);
  }
  
  static async deleteMany(filter) {
    // For simplicity, we'll just return a success result
    return { deletedCount: 0 };
  }
}

module.exports = User;