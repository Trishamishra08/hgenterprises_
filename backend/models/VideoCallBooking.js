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
            'rejected',
            'cancelled',
            'completed',
        ],
        default: 'pending_admin',
    },
    callId: { type: String },
    adminNote: { type: String, default: '' },
    rejectedBy: { type: String, enum: ['admin', 'user', null], default: null },
    adminApprovedAt: Date,
    userConfirmedAt: Date,
}, { timestamps: true });

module.exports = mongoose.model('VideoCallBooking', videoCallBookingSchema);
