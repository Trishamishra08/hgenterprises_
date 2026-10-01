const express = require('express');
const router = express.Router();
const c = require('../controllers/guidelineController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

router.get('/', c.getGuidelines);
router.get('/:department/:slug', c.getGuideline);
router.post('/', authMiddleware, adminMiddleware, c.createGuideline);
router.put('/:id', authMiddleware, adminMiddleware, c.updateGuideline);
router.delete('/:id', authMiddleware, adminMiddleware, c.deleteGuideline);

module.exports = router;
