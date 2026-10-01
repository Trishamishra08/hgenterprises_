const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    youtubeUrl: { type: String, required: true, trim: true },
    department: { type: String, enum: ['general', 'jewellery', 'tools', 'machines'], default: 'general' },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Video', videoSchema);
