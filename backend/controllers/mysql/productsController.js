const Product = require('../../models/mysql/Product');

// Get all products
const getProducts = async (req, res) => {
  try {
    // Extract query parameters
    const { category_id, isFeatured, search, page = 1, limit = 10 } = req.query;
    
    // Build filter object
    const filter = {};
    if (category_id) filter.category_id = category_id;
    if (isFeatured !== undefined) filter.isFeatured = isFeatured === 'true';
    if (search) filter.$text = { $search: search };
    
    // Get products with pagination
    const products = await Product.find(filter);
    
    // Get total count for pagination
    const totalCount = await Product.countDocuments(filter);
    
    res.json({
      message: 'Products retrieved successfully',
      data: products,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / limit),
        totalCount
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ 
      message: 'Internal server error' 
    });
  }
};

// Get product by ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ 
        message: 'Product not found' 
      });
    }
    
    res.json({
      message: 'Product retrieved successfully',
      data: product
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ 
      message: 'Internal server error' 
    });
  }
};

// Get product categories
const getCategories = async (req, res) => {
  try {
    const categories = await Product.getCategories();
    
    res.json({
      message: 'Categories retrieved successfully',
      data: categories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ 
      message: 'Internal server error' 
    });
  }
};

module.exports = {
  getProducts,
  getProductById,
  getCategories
};