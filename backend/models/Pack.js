const mongoose = require('mongoose');

const packSchema = new mongoose.Schema({
    brand: { type: String, required: true, default: 'HG PREMIUM' },
    name: { type: String, required: true },
    category: { type: String, required: true },
    subcategory: { type: String },
    mrp: { type: Number, required: true },
    price: { type: Number, required: true },
    unitPrice: { type: String, default: 'N/A' },
    rating: { type: Number, default: 0 },
    tag: { type: String },
    discount: { type: String },
    image: { type: String },
    description: { type: String },
    contents: [
        {
            productId: { type: String }, // Can be a string or a ref to Product
            productName: { type: String },
            quantity: { type: Number, default: 1 },
            variant: { type: String, default: 'Standard' }
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('Pack', packSchema);
