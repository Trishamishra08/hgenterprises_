const mongoose = require('mongoose');

const subcategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String },
    path: { type: String },
    status: { type: String, enum: ['Active', 'Hidden'], default: 'Active' }
});

const categorySchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    department: { type: String, required: true, default: 'jewellery' },
    image: { type: String },
    status: { type: String, enum: ['Active', 'Hidden'], default: 'Active' },
    showInCollection: { type: Boolean, default: true },
    showInNavbar: { type: Boolean, default: true },
    subcategories: [subcategorySchema],
    materialLabel: { type: String },
    materials: [{ type: String }],
    popularTypes: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);
