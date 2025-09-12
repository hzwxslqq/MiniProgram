const express = require('express');
const { getProducts, getProductById, getCategories } = require('../../controllers/mysql/productsController');

const router = express.Router();

// Get all products
router.get('/', getProducts);

// Get product by ID
router.get('/:id', getProductById);

// Get product categories
router.get('/categories', getCategories);

module.exports = router;