const express = require('express');
const router = express.Router();
const {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
} = require('../controllers/orderController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// Protected routes
router.route('/')
  .post(protect, addOrderItems)
  .get(protect, authorizeRoles('admin'), getOrders);

router.get('/myorders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);

// marking as paid/delivered
router.put('/:id/pay', protect, updateOrderToPaid);
router.put('/:id/deliver', protect, authorizeRoles('admin'), updateOrderToDelivered);

module.exports = router;
