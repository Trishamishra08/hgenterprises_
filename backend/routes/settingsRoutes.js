const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

router.get('/', settingsController.getSettings);
router.post('/', authMiddleware, adminMiddleware, settingsController.updateSettings);

module.exports = router;
