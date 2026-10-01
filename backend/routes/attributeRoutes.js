const express = require('express');
const router = express.Router();
const c = require('../controllers/attributeController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

router.get('/', c.getAttributes);
router.post('/', authMiddleware, adminMiddleware, c.createAttribute);
router.put('/:id', authMiddleware, adminMiddleware, c.updateAttribute);
router.delete('/:id', authMiddleware, adminMiddleware, c.deleteAttribute);

module.exports = router;
