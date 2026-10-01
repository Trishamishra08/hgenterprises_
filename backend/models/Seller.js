const mongoose = require('mongoose');

// A seller is just a contact the admin adds (no login, no panel). Redirected video calls go to their phone.
const sellerSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    note: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Seller', sellerSchema);
