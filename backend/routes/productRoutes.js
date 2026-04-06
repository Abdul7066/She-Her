const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
} = require('../controllers/productController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const { uploadProductImages } = require('../middleware/uploadMiddleware');
const { apiCache } = require('../middleware/cacheMiddleware');

// Public routes
router.get('/', apiCache, getProducts);
router.get('/:id', getProductById);

// Protected routes (Reviews)
router.post('/:id/reviews', protect, createProductReview);

// Admin/Manager only (Product CRUD)
router.post(
  '/',
  protect,
  authorizeRoles('admin', 'manager'),
  uploadProductImages,
  createProduct
);

router.put(
  '/:id',
  protect,
  authorizeRoles('admin', 'manager'),
  uploadProductImages,
  updateProduct
);

router.delete(
  '/:id',
  protect,
  authorizeRoles('admin'),
  deleteProduct
);

module.exports = router;
