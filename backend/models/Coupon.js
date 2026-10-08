const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    type: { type: String, enum: ['flat', 'percent'], required: true },
    value: { type: Number, required: true },
    minOrderValue: { type: Number, required: true },
    maxDiscount: { type: Number },
    validFrom: { type: Date, default: Date.now },
    validUntil: { type: Date, required: true },
    usageLimit: { type: Number, default: 1000 },
    usageCount: { type: Number, default: 0 },
    perUserLimit: { type: Number, default: 1 },
    applicableCategories: [{ type: String }],
    userEligibility: { type: String, enum: ['all', 'new', 'existing'], default: 'all' },
    active: { type: Boolean, default: true },
    description: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Coupon', couponSchema);
