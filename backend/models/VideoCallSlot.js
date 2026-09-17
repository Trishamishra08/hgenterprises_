const mongoose = require('mongoose');

const videoCallSlotSchema = new mongoose.Schema({
    date: { type: String, required: true }, // YYYY-MM-DD
    startTime: { type: String, required: true }, // e.g. 11:00 AM
    endTime: { type: String, required: true },
    capacity: { type: Number, default: 1, min: 1 },
    bookedCount: { type: Number, default: 0, min: 0 },
    isActive: { type: Boolean, default: true },
    note: { type: String, default: '' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

videoCallSlotSchema.index({ date: 1, startTime: 1 });

module.exports = mongoose.model('VideoCallSlot', videoCallSlotSchema);
