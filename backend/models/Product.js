const db = require('../utils/db');

// Product class
class Product {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.price = data.price;
    this.originalPrice = data.originalPrice;
    this.image = data.image;
    this.images = data.images;
    this.categoryId = data.categoryId;
    this.categoryName = data.categoryName;
    this.stock = data.stock;
    this.rating = data.rating;
    this.reviewCount = data.reviewCount;
    this.tags = data.tags;
    this.isFeatured = data.isFeatured;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
  
  // Save product
  async save() {
    if (this.id) {
      // Update existing product
      const updatedProduct = db.update('products', this.id, {
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
        isFeatured: this.isFeatured
      });
      Object.assign(this, updatedProduct);
    } else {
      // Create new product
      const newProduct = db.create('products', {
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
        isFeatured: this.isFeatured
      });
      Object.assign(this, newProduct);
    }
    return this;
  }
  
  // Static methods
  static async find(filter = {}) {
    // Apply filters
    let products = db.findAll('products');
    
    if (filter.categoryId) {
      products = products.filter(product => product.categoryId === filter.categoryId);
    }
    
    if (filter.isFeatured !== undefined) {
      products = products.filter(product => product.isFeatured === filter.isFeatured);
    }
    
    // For search functionality
    if (filter.$text) {
      const search = filter.$text.$search.toLowerCase();
      products = products.filter(product => 
        product.name.toLowerCase().includes(search) ||
        product.description.toLowerCase().includes(search) ||
        product.tags.some(tag => tag.toLowerCase().includes(search))
      );
    }
    
    return products.map(product => new Product(product));
  }
  
  static async findById(id) {
    const product = db.findById('products', id);
    if (!product) return null;
    return new Product(product);
  }
  
  static async countDocuments(filter = {}) {
    const products = await Product.find(filter);
    return products.length;
  }
  
  static async insertMany(products) {
    // For simplicity, we'll just return a success result
    return { insertedCount: products.length };
  }
  
  static async deleteMany(filter) {
    // For simplicity, we'll just return a success result
    return { deletedCount: 0 };
  }
  
  static async getCategories() {
    const categories = [
      { id: '1', name: 'Electronics', icon: '/images/icon_electronics.png' },
      { id: '2', name: 'Clothing', icon: '/images/icon_clothing.png' },
      { id: '3', name: 'Home', icon: '/images/icon_home_category.png' },
      { id: '4', name: 'Beauty', icon: '/images/icon_beauty.png' },
      { id: '5', name: 'Sports', icon: '/images/icon_sports.png' }
    ];
    
    return categories;
  }
  
  // Seed data function
  static async seedData() {
    const count = await Product.countDocuments();
    if (count === 0) {
      const products = [
        {
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
        },
        {
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
        },
        {
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
        },
        {
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
        },
        {
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
        },
        {
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
        }
      ];
      
      // Save products to database
      for (const productData of products) {
        const product = new Product(productData);
        await product.save();
      }
      
      console.log('Product seed data inserted');
    }
  }
}

module.exports = Product;