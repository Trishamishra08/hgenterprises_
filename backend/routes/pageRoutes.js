const express = require('express');
const router = express.Router();
const pageController = require('../controllers/pageController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

router.get('/:pageId', pageController.getPage);
router.put('/:pageId', authMiddleware, adminMiddleware, pageController.updatePage);

module.exports = router;
