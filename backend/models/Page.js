const mongoose = require('mongoose');

const pageSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true }, // e.g., 'privacy-policy'
    title: { type: String, required: true },
    content: { type: String, required: true },
    lastUpdatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Page', pageSchema);
