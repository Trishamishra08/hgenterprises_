const express = require('express');
const router = express.Router();
const c = require('../controllers/policyController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

router.get('/', c.getPolicies);
router.get('/:slug', c.getPolicyBySlug);
router.post('/', authMiddleware, adminMiddleware, c.createPolicy);
router.put('/:id', authMiddleware, adminMiddleware, c.updatePolicy);
router.delete('/:id', authMiddleware, adminMiddleware, c.deletePolicy);

module.exports = router;
