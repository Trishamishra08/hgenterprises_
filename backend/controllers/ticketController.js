const Ticket = require('../models/Ticket');

exports.createTicket = async (req, res) => {
    try {
        const { subject, message, category, orderId } = req.body;
        const newTicket = {
            id: 'TKT-' + Date.now().toString().slice(-6),
            userName: req.user.name,
            userEmail: req.user.email,
            subject,
            message,
            category,
            orderId,
            date: new Date().toISOString()
        };
        const ticket = await Ticket.create(newTicket);
        res.status(201).json({ message: 'Ticket created successfully', ticket });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create ticket', error: error.message });
    }
};

exports.getUserTickets = async (req, res) => {
    try {
        const tickets = await Ticket.find({ userEmail: req.user.email }).sort({ date: -1 });
        res.status(200).json(tickets);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tickets', error: error.message });
    }
};
// Get All Tickets (Admin)
exports.getAllTickets = async (req, res) => {
    try {
        const tickets = await Ticket.find().sort({ date: -1 });
        res.status(200).json(tickets);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tickets', error: error.message });
    }
};

// Update Ticket Status
exports.updateTicketStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const ticket = await Ticket.findOneAndUpdate({ id }, { status }, { new: true });
        if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
        res.status(200).json({ message: 'Status updated', ticket });
    } catch (error) {
        res.status(500).json({ message: 'Error updating status', error: error.message });
    }
};

// Delete Ticket
exports.deleteTicket = async (req, res) => {
    try {
        const { id } = req.params;
        const ticket = await Ticket.findOneAndDelete({ id });
        if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
        res.status(200).json({ message: 'Ticket deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting ticket', error: error.message });
    }
};
