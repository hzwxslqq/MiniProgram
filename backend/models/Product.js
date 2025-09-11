const { ObjectId } = require('mongodb');

// Product model
class Product {
  constructor(data) {
    this.id = data.id || new ObjectId().toString();
    this.name = data.name;
    this.description = data.description || '';
    this.price = data.price;
    this.originalPrice = data.originalPrice || data.price;
    this.image = data.image || '';
    this.images = data.images || [];
    this.categoryId = data.categoryId || '';
    this.categoryName = data.categoryName || '';
    this.stock = data.stock || 0;
    this.rating = data.rating || 0;
    this.reviewCount = data.reviewCount || 0;
    this.tags = data.tags || [];
    this.isFeatured = data.isFeatured || false;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }
  
  // Convert to plain object
  toObject() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      price: this.price,
      originalPrice: this.originalPrice,
      image: this.image,
      images: this.images,
      categoryId: this.categoryId,
      categoryName: this.categoryName,
      stock: this.stock,
      rating: this.rating,
      reviewCount: this.reviewCount,
      tags: this.tags,
      isFeatured: this.isFeatured,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

// Sample products data for demo purposes
// In a real application, this would be a database
const products = [
  new Product({
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
    isFeatured: true
  }),
  new Product({
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
    isFeatured: true
  }),
  new Product({
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
    isFeatured: false
  }),
  new Product({
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
    isFeatured: false
  }),
  new Product({
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
    isFeatured: true
  }),
  new Product({
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
    isFeatured: false
  })
].map(product => product.toObject());

// Model methods
Product.findById = async (id) => {
  return products.find(product => product.id === id);
};

Product.findAll = async (filters = {}) => {
  let result = [...products];
  
  // Apply filters
  if (filters.categoryId) {
    result = result.filter(product => product.categoryId === filters.categoryId);
  }
  
  if (filters.isFeatured) {
    result = result.filter(product => product.isFeatured);
  }
  
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    result = result.filter(product => 
      product.name.toLowerCase().includes(searchLower) ||
      product.description.toLowerCase().includes(searchLower) ||
      product.tags.some(tag => tag.toLowerCase().includes(searchLower))
    );
  }
  
  return result;
};

Product.getCategories = async () => {
  const categories = [
    { id: '1', name: 'Electronics', icon: '/images/icon_electronics.png' },
    { id: '2', name: 'Clothing', icon: '/images/icon_clothing.png' },
    { id: '3', name: 'Home', icon: '/images/icon_home_category.png' },
    { id: '4', name: 'Beauty', icon: '/images/icon_beauty.png' },
    { id: '5', name: 'Sports', icon: '/images/icon_sports.png' }
  ];
  
  return categories;
};

module.exports = Product;