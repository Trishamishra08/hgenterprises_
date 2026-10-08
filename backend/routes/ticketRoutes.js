const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

router.get('/', authMiddleware, ticketController.getUserTickets);
router.post('/create', authMiddleware, ticketController.createTicket);

// Admin routes
router.get('/admin/all', authMiddleware, adminMiddleware, ticketController.getAllTickets);
router.put('/admin/:id/status', authMiddleware, adminMiddleware, ticketController.updateTicketStatus);
router.delete('/admin/:id', authMiddleware, adminMiddleware, ticketController.deleteTicket);

module.exports = router;
