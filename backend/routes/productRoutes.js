const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authMiddleware } = require('../middleware/authMiddleware');
const reviewController = require('../controllers/reviewController');

// All products
router.get('/', productController.getAllProducts);

// Static/Specific routes MUST come before wildcard /:id to avoid route conflicts
// Packs
router.get('/packs', productController.getAllPacks);

// Reviews (specific paths before /:id wildcard)
router.get('/reviews/featured', reviewController.getFeaturedReviews);
router.get('/reviews/my', authMiddleware, reviewController.getMyReviews);
router.post('/reviews', authMiddleware, reviewController.addReview);
router.delete('/reviews/:id', authMiddleware, reviewController.deleteReview);

// Admin Routes (Protected) - must be before /:id wildcard
const { adminMiddleware } = require('../middleware/authMiddleware');
router.post('/', authMiddleware, adminMiddleware, productController.createProduct);
router.patch('/admin/inventory/bulk-adjust', authMiddleware, adminMiddleware, productController.bulkAdjustStock);
router.get('/admin/inventory/logs', authMiddleware, adminMiddleware, productController.getAllInventoryLogs);
router.get('/admin/reviews/all', authMiddleware, adminMiddleware, reviewController.getAllReviewsAdmin);
router.patch('/admin/reviews/:id/status', authMiddleware, adminMiddleware, reviewController.updateReviewStatus);

// Wildcard routes LAST - these match any string as :id or :productId
router.get('/:id', productController.getProductById);
router.get('/:productId/reviews', reviewController.getProductReviews);
router.put('/:id', authMiddleware, adminMiddleware, productController.updateProduct);
router.delete('/:id', authMiddleware, adminMiddleware, productController.deleteProduct);
router.patch('/:id/status', authMiddleware, adminMiddleware, productController.toggleProductStatus);

module.exports = router;
