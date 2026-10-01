const express = require('express');
const router = express.Router();
const c = require('../controllers/videoController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

router.get('/', c.getVideos);
router.post('/', authMiddleware, adminMiddleware, c.createVideo);
router.put('/:id', authMiddleware, adminMiddleware, c.updateVideo);
router.delete('/:id', authMiddleware, adminMiddleware, c.deleteVideo);

module.exports = router;
