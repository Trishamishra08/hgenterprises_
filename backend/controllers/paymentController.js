const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const crypto = require('crypto');
const Order = require('../models/Order');
const { markPaid, restoreStock } = require('../utils/orderService');

const hmac = (secret, body) => crypto.createHmac('sha256', secret).update(body).digest('hex');

const safeEqual = (a, b) => {
    const x = Buffer.from(String(a || ''));
    const y = Buffer.from(String(b || ''));
    return x.length === y.length && crypto.timingSafeEqual(x, y);
};

/**
 * Browser handler calls this after Razorpay checkout succeeds. The signature proves Razorpay
 * captured the payment for *this* gateway order; we then confirm the matching HG order.
 */
exports.verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ success: false, message: 'Missing payment details' });
        }

        const expected = hmac(process.env.RAZORPAY_KEY_SECRET, `${razorpay_order_id}|${razorpay_payment_id}`);
        if (!safeEqual(expected, razorpay_signature)) {
            return res.status(400).json({ success: false, message: 'Invalid payment signature' });
        }

        const order = await Order.findOne({ razorpayOrderId: razorpay_order_id, userId: req.user.id });
        if (!order) return res.status(404).json({ success: false, message: 'Order not found for this payment' });

        const paid = await markPaid(order, razorpay_payment_id);
        res.status(200).json({ success: true, message: 'Payment verified successfully', order: paid });
    } catch (error) {
        console.error('Payment Verification Error:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

/** Customer closed checkout or the payment failed: cancel the unpaid order (never touches paid orders) */
exports.paymentFailed = async (req, res) => {
    try {
        const { razorpay_order_id } = req.body;
        const order = await Order.findOne({ razorpayOrderId: razorpay_order_id, userId: req.user.id });
        if (!order) return res.status(404).json({ message: 'Order not found' });

        if (order.paymentStatus !== 'Completed') {
            order.paymentStatus = 'Failed';
            order.status = 'Cancelled';
            await order.save();
            await restoreStock(order._id, `Payment failed #${order.orderId}`);
        }
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

/**
 * Razorpay → server webhook. Covers the case where the customer pays but closes the tab before the browser
 * handler runs. Needs RAZORPAY_WEBHOOK_SECRET (set when creating the webhook in the Razorpay dashboard,
 * events: payment.captured, payment.failed).
 */
exports.webhook = async (req, res) => {
    try {
        const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
        if (!secret) return res.status(503).json({ message: 'Webhook not configured' });

        const signature = req.headers['x-razorpay-signature'];
        if (!req.rawBody || !safeEqual(hmac(secret, req.rawBody), signature)) {
            return res.status(400).json({ message: 'Invalid signature' });
        }

        const { event, payload } = req.body;
        const payment = payload?.payment?.entity;
        if (payment?.order_id) {
            const order = await Order.findOne({ razorpayOrderId: payment.order_id });
            if (order && event === 'payment.captured') {
                // Amount must match what we asked Razorpay to collect
                if (payment.amount === Math.round(order.total * 100)) await markPaid(order, payment.id);
                else console.error(`[WEBHOOK] amount mismatch for ${order.orderId}`);
            }
        }
        res.status(200).json({ received: true });
    } catch (error) {
        console.error('Webhook error:', error);
        res.status(500).json({ message: 'Webhook error' });
    }
};
