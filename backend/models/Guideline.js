const mongoose = require('mongoose');

const guidelineSchema = new mongoose.Schema({
    department: { type: String, enum: ['jewellery', 'tools', 'machines'], required: true },
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, lowercase: true, trim: true },
    content: { type: String, default: '' },
    youtubeUrl: { type: String, default: '', trim: true },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

guidelineSchema.index({ department: 1, slug: 1 }, { unique: true });

module.exports = mongoose.model('Guideline', guidelineSchema);
