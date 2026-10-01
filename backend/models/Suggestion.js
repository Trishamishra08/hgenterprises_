const mongoose = require('mongoose');

const suggestionSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    phone: { type: String, default: '' },
    source: { type: String, default: 'suggestion' }, // 'suggestion' | 'welcome-popup'
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    status: { type: String, enum: ['New', 'Read', 'Archived'], default: 'New' }
}, { timestamps: true });

module.exports = mongoose.model('Suggestion', suggestionSchema);
