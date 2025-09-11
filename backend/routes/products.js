const express = require('express');
const { 
  getProducts, 
  getProductById, 
  getCategories 
} = require('../controllers/productController');

const router = express.Router();

// Get all products
router.get('/', getProducts);

// Get product by ID
router.get('/:id', getProductById);

// Get categories
router.get('/categories', getCategories);

module.exports = router;