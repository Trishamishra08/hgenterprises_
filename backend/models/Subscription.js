const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: false },
    productName: { type: String, required: true },
    productPrice: { type: Number, required: true },
    monthlyInstallment: { type: Number, required: true },
    maturityValue: { type: Number, required: true },
    status: { type: String, enum: ['Staged', 'Active', 'Completed', 'Cancelled'], default: 'Staged' }
}, { timestamps: true });

module.exports = mongoose.model('Subscription', subscriptionSchema);
