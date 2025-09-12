const { pool } = require('../../utils/mysql');

// Product class for MySQL
class Product {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.price = data.price;
    this.original_price = data.original_price;
    this.image = data.image;
    this.images = typeof data.images === 'string' ? JSON.parse(data.images) : data.images;
    this.category_id = data.category_id;
    this.category_name = data.category_name;
    this.stock = data.stock;
    this.rating = data.rating;
    this.review_count = data.review_count;
    this.tags = typeof data.tags === 'string' ? JSON.parse(data.tags) : data.tags;
    this.is_featured = data.is_featured;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }
  
  // Save product
  async save() {
    try {
      if (this.id) {
        // Update existing product
        const [result] = await pool.execute(
          'UPDATE products SET name = ?, description = ?, price = ?, original_price = ?, image = ?, images = ?, category_id = ?, category_name = ?, stock = ?, rating = ?, review_count = ?, tags = ?, is_featured = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
          [this.name, this.description, this.price, this.original_price, this.image, JSON.stringify(this.images), this.category_id, this.category_name, this.stock, this.rating, this.review_count, JSON.stringify(this.tags), this.is_featured, this.id]
        );
        return result.affectedRows > 0;
      } else {
        // Create new product
        const [result] = await pool.execute(
          'INSERT INTO products (name, description, price, original_price, image, images, category_id, category_name, stock, rating, review_count, tags, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [this.name, this.description, this.price, this.original_price, this.image, JSON.stringify(this.images), this.category_id, this.category_name, this.stock, this.rating, this.review_count, JSON.stringify(this.tags), this.is_featured]
        );
        
        this.id = result.insertId;
        return true;
      }
    } catch (error) {
      console.error('Error saving product:', error);
      return false;
    }
  }
  
  // Static methods
  static async find(filter = {}) {
    try {
      let query = 'SELECT * FROM products';
      const conditions = [];
      const values = [];
      
      // Apply filters
      if (filter.category_id) {
        conditions.push('category_id = ?');
        values.push(filter.category_id);
      }
      
      if (filter.isFeatured !== undefined) {
        conditions.push('is_featured = ?');
        values.push(filter.isFeatured);
      }
      
      // For search functionality
      if (filter.$text) {
        const search = filter.$text.$search;
        conditions.push('(name LIKE ? OR description LIKE ?)');
        values.push(`%${search}%`, `%${search}%`);
      }
      
      if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
      }
      
      query += ' ORDER BY created_at DESC';
      
      const [rows] = await pool.execute(query, values);
      return rows.map(row => new Product(row));
    } catch (error) {
      console.error('Error finding products:', error);
      return [];
    }
  }
  
  static async findById(id) {
    try {
      const [rows] = await pool.execute('SELECT * FROM products WHERE id = ?', [id]);
      if (rows.length === 0) return null;
      
      return new Product(rows[0]);
    } catch (error) {
      console.error('Error finding product by ID:', error);
      return null;
    }
  }
  
  static async countDocuments(filter = {}) {
    try {
      let query = 'SELECT COUNT(*) as count FROM products';
      const conditions = [];
      const values = [];
      
      // Apply filters
      if (filter.category_id) {
        conditions.push('category_id = ?');
        values.push(filter.category_id);
      }
      
      if (filter.isFeatured !== undefined) {
        conditions.push('is_featured = ?');
        values.push(filter.isFeatured);
      }
      
      // For search functionality
      if (filter.$text) {
        const search = filter.$text.$search;
        conditions.push('(name LIKE ? OR description LIKE ?)');
        values.push(`%${search}%`, `%${search}%`);
      }
      
      if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
      }
      
      const [rows] = await pool.execute(query, values);
      return rows[0].count;
    } catch (error) {
      console.error('Error counting products:', error);
      return 0;
    }
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
    try {
      const count = await Product.countDocuments();
      if (count === 0) {
        const products = [
          {
            name: 'Wireless Headphones',
            description: 'High-quality wireless headphones with noise cancellation',
            price: 129.99,
            original_price: 159.99,
            image: '/images/product1.png',
            images: ['/images/product1.png'],
            category_id: '1',
            category_name: 'Electronics',
            stock: 50,
            rating: 4.5,
            review_count: 128,
            tags: ['electronics', 'audio', 'wireless'],
            is_featured: true
          },
          {
            name: 'Smart Watch',
            description: 'Feature-rich smartwatch with health monitoring',
            price: 199.99,
            original_price: 249.99,
            image: '/images/product2.png',
            images: ['/images/product2.png'],
            category_id: '1',
            category_name: 'Electronics',
            stock: 30,
            rating: 4.8,
            review_count: 97,
            tags: ['electronics', 'wearable', 'health'],
            is_featured: true
          },
          {
            name: 'Bluetooth Speaker',
            description: 'Portable Bluetooth speaker with excellent sound quality',
            price: 79.99,
            original_price: 99.99,
            image: '/images/product3.png',
            images: ['/images/product3.png'],
            category_id: '1',
            category_name: 'Electronics',
            stock: 100,
            rating: 4.3,
            review_count: 64,
            tags: ['electronics', 'audio', 'portable'],
            is_featured: false
          },
          {
            name: 'Phone Case',
            description: 'Durable phone case with stylish design',
            price: 24.99,
            original_price: 34.99,
            image: '/images/product4.png',
            images: ['/images/product4.png'],
            category_id: '2',
            category_name: 'Accessories',
            stock: 200,
            rating: 4.1,
            review_count: 210,
            tags: ['accessories', 'phone', 'protection'],
            is_featured: false
          },
          {
            name: 'Laptop Backpack',
            description: 'Spacious backpack with laptop compartment',
            price: 59.99,
            original_price: 79.99,
            image: '/images/product5.png',
            images: ['/images/product5.png'],
            category_id: '3',
            category_name: 'Bags',
            stock: 75,
            rating: 4.6,
            review_count: 85,
            tags: ['bags', 'laptop', 'travel'],
            is_featured: true
          },
          {
            name: 'Water Bottle',
            description: 'Insulated water bottle that keeps drinks cold for 24 hours',
            price: 19.99,
            original_price: 29.99,
            image: '/images/product6.png',
            images: ['/images/product6.png'],
            category_id: '4',
            category_name: 'Home',
            stock: 150,
            rating: 4.2,
            review_count: 142,
            tags: ['home', 'kitchen', 'hydration'],
            is_featured: false
          }
        ];
        
        // Save products to database
        for (const productData of products) {
          const product = new Product(productData);
          await product.save();
        }
        
        console.log('Product seed data inserted');
      }
    } catch (error) {
      console.error('Error seeding products:', error);
    }
  }
}

module.exports = Product;