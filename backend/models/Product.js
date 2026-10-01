const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    mrp: { type: Number, required: true },
    price: { type: Number, required: true },
    discount: { type: String },
    stock: { type: Number, default: 0 },
    sold: { type: Number, default: 0 },
});

// Per-product selection of a dynamic Attribute (see models/Attribute.js).
// `key` references Attribute.key; values are snapshotted so the storefront renders without a join.
const attributeOptionSchema = new mongoose.Schema({
    key: { type: String, required: true },
    name: { type: String, required: true },
    type: { type: String, enum: ['color', 'size', 'text'], default: 'text' },
    values: [{
        label: { type: String, required: true },
        value: { type: String, default: '' },
        image: { type: String, default: '' },
    }],
}, { _id: false });

const specificationSchema = new mongoose.Schema({
    label: { type: String, required: true },
    value: { type: String, required: true },
});

const faqSchema = new mongoose.Schema({
    q: { type: String, required: true },
    a: { type: String, required: true },
});

const diamondRowSchema = new mongoose.Schema({
    count: { type: String, default: '' },
    shape: { type: String, default: '' },
    size: { type: String, default: '' },
    settingType: { type: String, default: '' },
}, { _id: false });

const jewelleryDetailsSchema = new mongoose.Schema({
    productDetails: {
        productCode: { type: String, default: '' },
        height: { type: String, default: '' },
        width: { type: String, default: '' },
        productWeight: { type: String, default: '' },
    },
    diamondDetails: {
        totalWeight: { type: String, default: '' },
        totalNoOfDiamonds: { type: String, default: '' },
        rows: [diamondRowSchema],
    },
    metalDetails: {
        type: { type: String, default: '' },
        weight: { type: String, default: '' },
    },
    priceBreakup: {
        gold: { type: Number, default: 0 },
        diamond: { type: Number, default: 0 },
        makingCharge: { type: Number, default: 0 },
        gst: { type: Number, default: 0 },
        total: { type: Number, default: 0 },
    },
    tags: [{ type: String }],
}, { _id: false });

const productSchema = new mongoose.Schema({
    brand: { type: String, required: true, default: 'HG JEWELS' },
    name: { type: String, required: true },
    category: { type: String, required: true },
    subcategory: { type: String },
    department: {
        type: String,
        enum: ['jewellery', 'tools', 'machines'],
        default: 'jewellery',
    },
    targetGroup: { type: String, enum: ['Male', 'Female', 'Children', 'Unisex'], default: 'Unisex' },
    rating: { type: Number, default: 0 },
    tag: { type: String },
    image: { type: String }, // Cloudinary URL
    hoverImage: { type: String }, // Cloudinary URL for hover state
    unit: { type: String, default: 'pcs' },
    description: { type: String },
    benefits: [{ type: String }],
    specifications: [specificationSchema],
    jewelleryDetails: jewelleryDetailsSchema,
    faqs: [faqSchema],
    variants: [variantSchema],
    attributeOptions: [attributeOptionSchema],
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
