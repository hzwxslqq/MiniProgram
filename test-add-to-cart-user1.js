// Test script to add items to cart for user ID "1"
const fs = require('fs');
const path = require('path');

// Path to the database file
const dbPath = path.join(__dirname, 'backend', 'data', 'db.json');

// Read the current database
let db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// Find user with ID "1"
const user = db.users.find(u => u.id === '1');
console.log('Found user:', user.username);

// Get current cart items for user ID "1"
const userCartItemsBefore = db.cartItems.filter(item => item.userId === '1');
console.log('User 1 cart items before:', userCartItemsBefore.length);

// Add a new item to the cart for user ID "1"
const newItem = {
  id: Date.now().toString(),
  userId: '1',
  productId: '3',
  productName: 'Bluetooth Speaker',
  productImage: '/images/product3.png',
  price: 79.99,
  quantity: 2,
  selected: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

db.cartItems.push(newItem);

// Write the updated database back to file
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

// Verify the change
const updatedDb = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
const userCartItemsAfter = updatedDb.cartItems.filter(item => item.userId === '1');
console.log('User 1 cart items after:', userCartItemsAfter.length);
console.log('Added item:', JSON.stringify(newItem, null, 2));