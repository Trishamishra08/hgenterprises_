const express = require('express');
const router = express.Router();
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');
const ctrl = require('../controllers/videoCallController');

// Slots — public list available without auth (schedule page may show before login completes)
router.get('/slots', ctrl.listAvailableSlots);
router.get('/slots/all', authMiddleware, adminMiddleware, ctrl.listSlotsAdmin);
router.post('/slots', authMiddleware, adminMiddleware, ctrl.createSlot);
router.put('/slots/:id', authMiddleware, adminMiddleware, ctrl.updateSlot);
router.delete('/slots/:id', authMiddleware, adminMiddleware, ctrl.deleteSlot);

// VC cart
router.get('/cart', authMiddleware, ctrl.getCart);
router.post('/cart', authMiddleware, ctrl.addToCart);
router.post('/cart/sync', authMiddleware, ctrl.syncCart);
router.delete('/cart/:productId', authMiddleware, ctrl.removeFromCart);

// Bookings
router.post('/bookings', authMiddleware, ctrl.createBooking);
router.get('/bookings/mine', authMiddleware, ctrl.myBookings);
router.get('/bookings/pending-count', authMiddleware, adminMiddleware, ctrl.pendingCount);
router.get('/bookings', authMiddleware, adminMiddleware, ctrl.listBookingsAdmin);
router.post('/bookings/:id/admin', authMiddleware, adminMiddleware, ctrl.adminRespond);
router.post('/bookings/:id/confirm', authMiddleware, ctrl.userConfirm);
router.post('/bookings/:id/cancel', authMiddleware, ctrl.cancelBooking);

module.exports = router;
