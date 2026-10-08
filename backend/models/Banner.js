const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
    badge: { type: String },
    title: { type: String, required: true },
    description: { type: String },
    btnText: { type: String, default: 'Explore Now' },
    link: { type: String, default: '/shop' },
    image: { type: String, required: true },
    video: { type: String },
    cardImage: { type: String },
    secondaryTitle: { type: String },
    secondaryLink: { type: String },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
    startDate: { type: String },
    endDate: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Banner', bannerSchema);

