const db = require('./backend/utils/db');

// Test the removeByFilter function
console.log('Testing removeByFilter function...');

// First, let's see what's in the cartItems collection
const initialCartItems = db.findAll('cartItems');
console.log('Initial cart items:', initialCartItems.length);

// Add a test item for a specific user
const testItem = db.create('cartItems', {
  userId: 'test-user-123',
  productId: 'test-product',
  productName: 'Test Product',
  productImage: '/images/test.png',
  price: 9.99,
  quantity: 1,
  selected: true
});

console.log('Added test item with ID:', testItem.id);

// Check cart items again
const cartItemsAfterAdd = db.findAll('cartItems');
console.log('Cart items after adding test item:', cartItemsAfterAdd.length);

// Now try to remove items for this specific user
const removedCount = db.removeByFilter('cartItems', { userId: 'test-user-123' });
console.log('Items removed:', removedCount);

// Check cart items again
const cartItemsAfterRemove = db.findAll('cartItems');
console.log('Cart items after removing test user items:', cartItemsAfterRemove.length);

// Verify the test item was removed
const testItemExists = db.findByFilter('cartItems', { userId: 'test-user-123' });
console.log('Test items remaining:', testItemExists.length);