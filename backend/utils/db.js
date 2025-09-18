const fs = require('fs');
const path = require('path');

// Database file path
const dbPath = path.join(__dirname, '..', 'data', 'db.json');

// Initialize database directory
const initDB = () => {
  const dataDir = path.join(__dirname, '..', 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  // Create initial database file if it doesn't exist
  if (!fs.existsSync(dbPath)) {
    const initialData = {
      users: [
        {
          id: '1',
          username: 'admin',
          password: '$2a$10$NejtIbUTfAI7IsnBnIrulu6Ov1u1niYMGqYxxCOfTpgSnsYUO/45K', // password: admin123
          email: 'admin@example.com',
          phone: '1234567890',
          avatar: '',
          wechatOpenId: '', // WeChat openid field
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ],
      products: [
        {
          id: '1',
          name: 'Wireless Headphones',
          description: 'High-quality wireless headphones with noise cancellation',
          price: 129.99,
          originalPrice: 159.99,
          image: '/images/product1.png',
          images: ['/images/product1.png'],
          categoryId: '1',
          categoryName: 'Electronics',
          stock: 50,
          rating: 4.5,
          reviewCount: 128,
          tags: ['electronics', 'audio', 'wireless'],
          isFeatured: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Smart Watch',
          description: 'Feature-rich smartwatch with health monitoring',
          price: 199.99,
          originalPrice: 249.99,
          image: '/images/product2.png',
          images: ['/images/product2.png'],
          categoryId: '1',
          categoryName: 'Electronics',
          stock: 30,
          rating: 4.8,
          reviewCount: 97,
          tags: ['electronics', 'wearable', 'health'],
          isFeatured: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '3',
          name: 'Bluetooth Speaker',
          description: 'Portable Bluetooth speaker with excellent sound quality',
          price: 79.99,
          originalPrice: 99.99,
          image: '/images/product3.png',
          images: ['/images/product3.png'],
          categoryId: '1',
          categoryName: 'Electronics',
          stock: 100,
          rating: 4.3,
          reviewCount: 64,
          tags: ['electronics', 'audio', 'portable'],
          isFeatured: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '4',
          name: 'Phone Case',
          description: 'Durable phone case with stylish design',
          price: 24.99,
          originalPrice: 34.99,
          image: '/images/product4.png',
          images: ['/images/product4.png'],
          categoryId: '2',
          categoryName: 'Accessories',
          stock: 200,
          rating: 4.1,
          reviewCount: 210,
          tags: ['accessories', 'phone', 'protection'],
          isFeatured: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '5',
          name: 'Laptop Backpack',
          description: 'Spacious backpack with laptop compartment',
          price: 59.99,
          originalPrice: 79.99,
          image: '/images/product5.png',
          images: ['/images/product5.png'],
          categoryId: '3',
          categoryName: 'Bags',
          stock: 75,
          rating: 4.6,
          reviewCount: 85,
          tags: ['bags', 'laptop', 'travel'],
          isFeatured: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '6',
          name: 'Water Bottle',
          description: 'Insulated water bottle that keeps drinks cold for 24 hours',
          price: 19.99,
          originalPrice: 29.99,
          image: '/images/product6.png',
          images: ['/images/product6.png'],
          categoryId: '4',
          categoryName: 'Home',
          stock: 150,
          rating: 4.2,
          reviewCount: 142,
          tags: ['home', 'kitchen', 'hydration'],
          isFeatured: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ],
      cartItems: [
        {
          id: '1',
          userId: '1',
          productId: '1',
          productName: 'Wireless Headphones',
          productImage: '/images/product1.png',
          price: 129.99,
          quantity: 1,
          selected: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
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
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ],
      orders: [
        {
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
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: '2023-01-15T00:00:00.000Z'
        },
        {
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
          createdAt: '2023-01-02T00:00:00.000Z',
          updatedAt: '2023-01-05T00:00:00.000Z'
        },
        {
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
          createdAt: '2023-01-03T00:00:00.000Z',
          updatedAt: '2023-01-03T00:00:00.000Z'
        }
      ]
    };
    
    // Add userAddresses collection
    initialData.userAddresses = [
      {
        id: '1',
        userId: '1',
        name: 'John Doe',
        phone: '1234567890',
        address: '123 Main St',
        city: 'New York',
        postalCode: '10001',
        isDefault: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    
    fs.writeFileSync(dbPath, JSON.stringify(initialData, null, 2));
  }
};

// Read database
const readDB = () => {
  if (!fs.existsSync(dbPath)) {
    initDB();
  }
  
  const data = fs.readFileSync(dbPath, 'utf8');
  return JSON.parse(data);
};

// Write database
const writeDB = (data) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

// Find all items in a collection
const findAll = (collection) => {
  const db = readDB();
  return db[collection] || [];
};

// Find item by ID in a collection
const findById = (collection, id) => {
  const db = readDB();
  const items = db[collection] || [];
  return items.find(item => item.id === id);
};

// Find items by filter in a collection
const findByFilter = (collection, filter) => {
  const db = readDB();
  const items = db[collection] || [];
  return items.filter(item => {
    for (const key in filter) {
      if (item[key] !== filter[key]) {
        return false;
      }
    }
    return true;
  });
};

// Create item in a collection
const create = (collection, item) => {
  const db = readDB();
  const items = db[collection] || [];
  
  // Generate ID if not provided
  if (!item.id) {
    item.id = Date.now().toString();
  }
  
  // Add timestamps
  item.createdAt = new Date().toISOString();
  item.updatedAt = new Date().toISOString();
  
  items.push(item);
  db[collection] = items;
  writeDB(db);
  
  return item;
};

// Update item in a collection
const update = (collection, id, updates) => {
  const db = readDB();
  const items = db[collection] || [];
  const index = items.findIndex(item => item.id === id);
  
  if (index === -1) {
    return null;
  }
  
  // Update timestamps
  updates.updatedAt = new Date().toISOString();
  
  items[index] = { ...items[index], ...updates };
  db[collection] = items;
  writeDB(db);
  
  return items[index];
};

// Delete item from a collection
const remove = (collection, id) => {
  const db = readDB();
  const items = db[collection] || [];
  const index = items.findIndex(item => item.id === id);
  
  if (index === -1) {
    return false;
  }
  
  items.splice(index, 1);
  db[collection] = items;
  writeDB(db);
  
  return true;
};

// Delete items by filter from a collection
const removeByFilter = (collection, filter) => {
  const db = readDB();
  const items = db[collection] || [];
  const filteredItems = items.filter(item => {
    // Keep item if it does NOT match all filter criteria
    for (const key in filter) {
      if (item[key] !== filter[key]) {
        return true; // Keep item (doesn't match this filter criterion)
      }
    }
    // If we get here, item matches all filter criteria, so remove it
    return false;
  });
  
  db[collection] = filteredItems;
  writeDB(db);
  
  return items.length - filteredItems.length; // Return number of items removed
};

module.exports = {
  initDB,
  findAll,
  findById,
  findByFilter,
  create,
  update,
  remove,
  removeByFilter
};