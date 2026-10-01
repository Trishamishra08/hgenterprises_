const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const Razorpay = require('razorpay');
const Order = require('../models/Order');
const { OrderError, priceOrder, deductStock, restoreStock } = require('../utils/orderService');

const getRazorpay = () => new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/**
 * Place an order. Prices, discount, shipping and GST are computed on the server.
 *  - paymentMethod 'cod'      → order is confirmed immediately (subject to the COD cap)
 *  - paymentMethod 'razorpay' → order is created as Pending/unpaid together with a Razorpay order for the
 *                               server-computed total; it is confirmed only after /payments/razorpay/verify
 *                               (or the webhook) proves the payment.
 */
exports.createOrder = async (req, res) => {
    try {
        const { items, address, shippingAddress, paymentMethod, couponCode } = req.body;

        const orderAddress = address || shippingAddress;
        if (!orderAddress) return res.status(400).json({ message: 'Shipping address is required' });

        const method = paymentMethod === 'razorpay' ? 'razorpay' : 'cod';
        const priced = await priceOrder({ items, couponCode, userId: req.user.id });

        if (method === 'cod') {
            const cap = priced.settings.codMaxAmount ?? 50000;
            if (priced.total > cap) {
                return res.status(400).json({ message: `Cash on Delivery is available up to ₹${cap.toLocaleString('en-IN')}. Please pay online for this order.` });
            }
        }

        const order = await Order.create({
            userId: req.user.id,
            orderId: 'ORD-' + Date.now(),
            items: priced.lines,
            subtotal: priced.subtotal,
            gstAmount: priced.gstAmount,
            shippingAmount: priced.shippingAmount,
            discount: priced.discount,
            couponCode: priced.couponCode,
            total: priced.total,
            address: orderAddress,
            paymentMethod: method,
            paymentStatus: 'Pending',
            status: method === 'cod' ? 'Processing' : 'Pending',
        });

        if (method === 'cod') {
            await deductStock(order._id);
            return res.status(201).json({ message: 'Order placed successfully', order: await Order.findById(order._id) });
        }

        // Online: create the gateway order for exactly what we computed
        const rzpOrder = await getRazorpay().orders.create({
            amount: Math.round(priced.total * 100),
            currency: 'INR',
            receipt: order.orderId,
            notes: { orderId: order.orderId },
        });
        order.razorpayOrderId = rzpOrder.id;
        await order.save();

        res.status(201).json({
            message: 'Order created, awaiting payment',
            order,
            razorpay: { orderId: rzpOrder.id, amount: rzpOrder.amount, currency: rzpOrder.currency, key: process.env.RAZORPAY_KEY_ID },
        });
    } catch (error) {
        if (error instanceof OrderError) return res.status(error.status).json({ message: error.message });
        console.error('[ORDER ERROR]', error);
        res.status(500).json({ message: 'Failed to place order', error: error.message });
    }
};

// Get orders for a specific user
exports.getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user.id }).populate('userId', 'name email phone').sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        console.error('[ORDER FETCH ERROR]', error);
        res.status(500).json({ message: 'Error fetching orders', error: error.message });
    }
};

// Get All Orders (Admin)
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('userId', 'name email phone').sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        console.error('[ADMIN ORDER FETCH ERROR]', error);
        res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
    }
};

// Update Order Status (Admin)
exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!order) return res.status(404).json({ message: 'Order not found' });

        // Cancelling an order that had taken stock puts it back on the shelf
        if (status === 'Cancelled') await restoreStock(order._id);

        res.status(200).json(await Order.findById(order._id));
    } catch (error) {
        res.status(500).json({ message: 'Failed to update order', error: error.message });
    }
};
