const mongoose = require('mongoose');

const valueSchema = new mongoose.Schema({
    label: { type: String, required: true },
    value: { type: String, default: '' }, // hex for colour attributes, optional detail for others
    image: { type: String, default: '' },
}, { _id: false });

// A reusable, admin-defined product attribute (Metal Colour, Ring Size, Finish, ...).
// New attributes can be added from the admin panel without code changes.
const attributeSchema = new mongoose.Schema({
    key: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    type: { type: String, enum: ['color', 'size', 'text'], default: 'text' },
    departments: [{ type: String, enum: ['jewellery', 'tools', 'machines'] }],
    values: [valueSchema],
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Attribute', attributeSchema);
