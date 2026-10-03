const mongoose = require('mongoose');

// One live OTP per phone. Only a hash is stored; the document deletes itself after expiry.
const otpSchema = new mongoose.Schema({
    phone: { type: String, required: true, unique: true },
    codeHash: { type: String, required: true },
    attempts: { type: Number, default: 0 },
    lastSentAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true, index: { expires: 0 } },
}, { timestamps: true });

module.exports = mongoose.model('Otp', otpSchema);
