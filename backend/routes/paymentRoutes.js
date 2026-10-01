const express = require('express');
const router = express.Router();
const { verifyPayment, paymentFailed, webhook } = require('../controllers/paymentController');
const { authMiddleware } = require('../middleware/authMiddleware');

// Gateway orders are created by POST /orders/place with the server-computed total
router.post('/razorpay/verify', authMiddleware, verifyPayment);
router.post('/razorpay/failed', authMiddleware, paymentFailed);
router.post('/razorpay/webhook', webhook); // authenticated by Razorpay signature

module.exports = router;
