const Product = require('../models/Product');

// Get all products
const getProducts = async (req, res) => {
  try {
    const { categoryId, isFeatured, search } = req.query;
    
    // Build filters
    const filters = {};
    if (categoryId) filters.categoryId = categoryId;
    if (isFeatured === 'true') filters.isFeatured = true;
    if (search) filters.search = search;
    
    // Get products
    const products = await Product.findAll(filters);
    
    res.json({
      message: 'Products retrieved successfully',
      data: products
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
    
    // Get product
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

// Get categories
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