const express = require('express');
const router = express.Router();
const inventoryReportController = require('../controllers/inventoryReportController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

router.get('/', authMiddleware, adminMiddleware, inventoryReportController.getInventoryReports);

module.exports = router;
