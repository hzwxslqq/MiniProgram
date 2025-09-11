const { ObjectId } = require('mongodb');

// User model
class User {
  constructor(data) {
    this.id = data.id || new ObjectId().toString();
    this.username = data.username;
    this.password = data.password;
    this.email = data.email || '';
    this.phone = data.phone || '';
    this.avatar = data.avatar || '';
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }
  
  // Convert to plain object
  toObject() {
    return {
      id: this.id,
      username: this.username,
      password: this.password,
      email: this.email,
      phone: this.phone,
      avatar: this.avatar,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
  
  // Convert to JSON (exclude password)
  toJSON() {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      phone: this.phone,
      avatar: this.avatar,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

// In-memory storage for demo purposes
// In a real application, this would be a database
const users = [
  {
    id: '1',
    username: 'admin',
    password: '$2a$10$8K1p/a0dhrxiowP.dnkgNORTWgdEDHn5L2/xjpEWuC.QQv4rKO9jO', // password: admin123
    email: 'admin@example.com',
    phone: '1234567890',
    avatar: '',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Model methods
User.findById = async (id) => {
  return users.find(user => user.id === id);
};

User.findByUsername = async (username) => {
  return users.find(user => user.username === username);
};

User.create = async (userData) => {
  const newUser = new User(userData);
  users.push(newUser.toObject());
  return newUser;
};

module.exports = User;