const express = require('express');
const router = express.Router();
const suggestionController = require('../controllers/suggestionController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

// Public route to submit suggestion
router.post('/', suggestionController.addSuggestion);

// Admin routes
router.get('/admin/all', authMiddleware, adminMiddleware, suggestionController.getSuggestions);
router.patch('/admin/:id/status', authMiddleware, adminMiddleware, suggestionController.updateSuggestionStatus);
router.delete('/admin/:id', authMiddleware, adminMiddleware, suggestionController.deleteSuggestion);

module.exports = router;
