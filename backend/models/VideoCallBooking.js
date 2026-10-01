const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: String,
    image: String,
    code: String,
    metal: String,
    stone: String,
}, { _id: false });

const videoCallBookingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [cartItemSchema],
    slot: { type: mongoose.Schema.Types.ObjectId, ref: 'VideoCallSlot' },
    /** When user proposes their own time instead of an admin slot */
    customSlot: {
        date: String,
        startTime: String,
        endTime: String,
    },
    note: { type: String, default: '' },
    contactName: { type: String, default: '' },
    contactEmail: { type: String, default: '' },
    status: {
        type: String,
        enum: [
            'pending_admin',   // waiting for admin
            'pending_user',    // admin approved, waiting user confirm
            'confirmed',       // both approved — call ready
            'redirected',      // admin handed the request to a seller who will contact the customer directly
            'rejected',
            'cancelled',
            'completed',
        ],
        default: 'pending_admin',
    },
    callId: { type: String },
    adminNote: { type: String, default: '' },
    /** Admin can hand a request to a seller contact (name + phone); the seller has no panel and calls the customer */
    assignedSeller: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', default: null },
    redirectedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    redirectedAt: Date,
    redirectNote: { type: String, default: '' },
    rejectedBy: { type: String, enum: ['admin', 'user', null], default: null },
    adminApprovedAt: Date,
    userConfirmedAt: Date,
}, { timestamps: true });

module.exports = mongoose.model('VideoCallBooking', videoCallBookingSchema);
