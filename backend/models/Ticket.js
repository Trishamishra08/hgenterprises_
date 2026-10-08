const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
    from: { type: String, enum: ['user', 'admin'], default: 'user' },
    text: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

const ticketSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    subject: { type: String, required: true },
    category: { type: String },
    orderId: { type: String },
    message: { type: String, required: true },
    status: { type: String, enum: ['Open', 'In Progress', 'Closed'], default: 'Open' },
    replies: [replySchema],
    date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Ticket', ticketSchema);
