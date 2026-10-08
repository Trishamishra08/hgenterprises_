const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

// Order history (Protected)
router.get('/', authMiddleware, orderController.getUserOrders);

// Place order (Protected)
router.post('/place', authMiddleware, orderController.createOrder);

// Admin routes
router.get('/admin/all', authMiddleware, adminMiddleware, orderController.getAllOrders);
router.patch('/:id/status', authMiddleware, adminMiddleware, orderController.updateOrderStatus);

module.exports = router;
