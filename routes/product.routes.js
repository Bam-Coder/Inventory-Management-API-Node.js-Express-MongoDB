const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth.middleware');
const { 
  createProduct, 
  getMyProducts, 
  getProductById, 
  updateProduct, 
  deleteProduct,
  getLowStockProducts,
  getInventoryStats,
  searchProducts
} = require('../controllers/product.controller');
const { 
  productValidation, 
  idValidation, 
  searchValidation 
} = require('../utils/validation');

// Routes des produits
router.post('/', protect, productValidation, createProduct);
router.get('/', protect, getMyProducts);
router.get('/search', protect, searchValidation, searchProducts);
router.get('/low-stock', protect, getLowStockProducts);
router.get('/stats', protect, getInventoryStats);
router.get('/:id', protect, idValidation, getProductById);
router.put('/:id', protect, idValidation, updateProduct);
router.delete('/:id', protect, idValidation, deleteProduct);

module.exports = router;
