const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    id: { type: String }, // Optional
    brand: { type: String, required: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    subcategory: { type: String },
    image: { type: String },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    variant: { type: String },
    unit: { type: String },
    options: { type: Object } // { selectedSize, selectedAttributes } chosen on the product page
});

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    orderId: { type: String, required: true, unique: true },
    items: [orderItemSchema],
    subtotal: { type: Number, required: true },
    gstAmount: { type: Number, required: true },
    shippingAmount: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    couponCode: { type: String },
    total: { type: Number, required: true },
    status: { type: String, enum: ['Pending', 'Received', 'Processing', 'Shipped', 'Out For Delivery', 'Delivered', 'Cancelled'], default: 'Processing' },
    paymentMethod: { type: String },
    paymentStatus: { type: String, enum: ['Pending', 'Completed', 'Failed'], default: 'Pending' },
    address: { type: Object, required: true },
    razorpayOrderId: { type: String, index: true },
    razorpayPaymentId: { type: String },
    stockDeducted: { type: Boolean, default: false },
    trackingId: { type: String },
    estimatedDelivery: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
