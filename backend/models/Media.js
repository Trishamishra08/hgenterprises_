const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
    name: { type: String, required: true },
    url: { type: String, required: true },
    public_id: { type: String, required: true },
    format: { type: String },
    resource_type: { type: String }, // image, video, etc.
    folder: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Media', mediaSchema);
