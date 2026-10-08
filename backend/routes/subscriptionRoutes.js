const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

router.post('/create', subscriptionController.createSubscription);

// Admin routes
router.get('/admin/all', authMiddleware, adminMiddleware, subscriptionController.getSubscriptions);
router.put('/admin/:id/status', authMiddleware, adminMiddleware, subscriptionController.updateSubscriptionStatus);
router.delete('/admin/:id', authMiddleware, adminMiddleware, subscriptionController.deleteSubscription);

module.exports = router;
