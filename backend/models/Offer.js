const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
    title: { type: String, required: true },
    discount: { type: String, required: true },
    description: { type: String },
    tag: { type: String, default: 'OFFER' },
    expiry: { type: Date },
    color: { type: String, default: 'bg-zinc-950' },
    accent: { type: String, default: 'text-gold' },
    category: { type: String, enum: ['trending', 'limited', 'all'], default: 'trending' },
    path: { type: String, default: '/shop?offers=true' },
    icon: { type: String, default: 'Zap' },
    image: { type: String },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Offer', offerSchema);
