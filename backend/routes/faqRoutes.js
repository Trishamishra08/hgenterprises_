const express = require('express');
const router = express.Router();
const faqController = require('../controllers/faqController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

// Public routes
router.get('/', faqController.getAllFaqs);

// Admin routes
router.post('/', authMiddleware, adminMiddleware, faqController.createFaq);
router.put('/:id', authMiddleware, adminMiddleware, faqController.updateFaq);
router.delete('/:id', authMiddleware, adminMiddleware, faqController.deleteFaq);

module.exports = router;
