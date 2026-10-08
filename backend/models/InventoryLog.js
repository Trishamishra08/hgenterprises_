const mongoose = require('mongoose');

const inventoryLogSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    change: { type: Number, required: true },
    reason: { type: String, default: 'Manual Adjustment' },
    oldStock: { type: Number, required: true },
    newStock: { type: Number, required: true },
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('InventoryLog', inventoryLogSchema);
