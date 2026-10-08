const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

// Public routes
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/otp/send', authController.sendOTP);
router.post('/otp/verify', authController.verifyOTP);

// Protected routes
router.get('/profile', authMiddleware, authController.getProfile);
router.put('/profile', authMiddleware, authController.updateProfile);
router.put('/change-password', authMiddleware, authController.changePassword);
router.post('/address/add', authMiddleware, authController.addAddress);
router.delete('/address/:addressId', authMiddleware, authController.removeAddress);
router.post('/wishlist', authMiddleware, authController.toggleWishlist);
router.patch('/notifications/:id', authMiddleware, authController.markNotificationRead);

// Admin routes
router.get('/users', authMiddleware, adminMiddleware, authController.getAllUsers);
router.patch('/users/:userId/status', authMiddleware, adminMiddleware, authController.toggleUserStatus);

module.exports = router;
