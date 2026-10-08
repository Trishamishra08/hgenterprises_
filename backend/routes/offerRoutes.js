const express = require('express');
const router = express.Router();
const offerController = require('../controllers/offerController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

// Public
router.get('/', offerController.getAllOffers);

// Admin Only
router.get('/:id', authMiddleware, adminMiddleware, offerController.getOfferById);
router.post('/', authMiddleware, adminMiddleware, offerController.createOffer);
router.put('/:id', authMiddleware, adminMiddleware, offerController.updateOffer);
router.delete('/:id', authMiddleware, adminMiddleware, offerController.deleteOffer);

module.exports = router;
