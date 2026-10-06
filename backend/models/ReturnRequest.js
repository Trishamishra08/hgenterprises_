const mongoose = require('mongoose');

const returnRequestSchema = new mongoose.Schema({
    orderId: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['return', 'exchange'], required: true },
    items: [{
        id: String,
        name: String,
        price: Number,
        quantity: Number,
        image: String
    }],
    reason: { type: String, required: true },
    comment: { type: String },
    evidence: {
        images: [{ type: String }], // Cloudinary URLs
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Picked Up', 'Received', 'Refunded', 'Replaced', 'Rejected'],
        default: 'Pending'
    },
    adminComment: { type: String },
    refundAmount: { type: Number },          // maximum refundable amount, computed by the server from the order
    refundedAmount: { type: Number, default: 0 },
    refundId: { type: String },              // Razorpay refund id (online orders)
    refundReference: { type: String },       // bank UTR / reference (COD orders, paid manually)
    qcNote: { type: String },
    restocked: { type: Boolean, default: false },
    replacementStockTaken: { type: Boolean, default: false },
    replacement: {
        courierName: String,
        trackingId: String,
        shippedAt: Date
    },
    bankDetails: {
        holderName: String,
        accountNumber: String,
        ifscCode: String,
        bankName: String
    },
    courier: {
        partner: String,
        awb: String,
        status: String
    },
    timeline: [{
        status: String,
        note: String,
        date: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

module.exports = mongoose.model('ReturnRequest', returnRequestSchema);
