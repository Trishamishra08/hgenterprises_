const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    date: { type: String, default: () => new Date().toISOString().split('T')[0] },
    author: { type: String, default: 'Admin' },
    status: { type: String, enum: ['Published', 'Draft'], default: 'Published' }
}, { timestamps: true });

module.exports = mongoose.model('Blog', blogSchema);
