const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const Razorpay = require('razorpay');
const Order = require('../models/Order');
const { OrderError, priceOrder, deductStock, restoreStock, refundOnline } = require('../utils/orderService');
const { notifyUser } = require('../utils/notify');

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
            const cap = priced.settings.codMaxAmount ?? 30000;
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
            statusHistory: [{ status: method === 'cod' ? 'Processing' : 'Pending', note: method === 'cod' ? 'Order placed (Cash on Delivery)' : 'Order placed, awaiting online payment' }],
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

// Allowed moves. Shipment is manual: the admin books the courier outside the system and records the details here.
const ORDER_FLOW = {
    Pending: ['Processing', 'Cancelled'],            // Pending = online payment not received yet
    Received: ['Processing', 'Cancelled'],           // legacy status
    Processing: ['Shipped', 'Cancelled'],
    Shipped: ['Out For Delivery', 'Delivered'],
    'Out For Delivery': ['Delivered'],
};

const ORDER_MESSAGES = {
    Processing: (o) => `Your order ${o.orderId} is confirmed and is being prepared.`,
    Shipped: (o) => `Your order ${o.orderId} has been shipped via ${o.courierName}. Tracking ID: ${o.trackingId}.`,
    'Out For Delivery': (o) => `Your order ${o.orderId} is out for delivery today.`,
    Delivered: (o) => `Your order ${o.orderId} has been delivered. Return/exchange is possible from My Orders within the allowed days.`,
    Cancelled: (o) => `Your order ${o.orderId} was cancelled.${o.paymentStatus === 'Refunded' ? ' Your payment will be refunded to the original payment method in 5-7 working days.' : ''}`,
};

// Update Order Status (Admin)
exports.updateOrderStatus = async (req, res) => {
    try {
        const { status, courierName, trackingId, trackingUrl, estimatedDelivery, note } = req.body;
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        const allowed = ORDER_FLOW[order.status] || [];
        if (!allowed.includes(status)) {
            return res.status(400).json({
                message: allowed.length
                    ? `An order that is "${order.status}" can only move to: ${allowed.join(', ')}`
                    : `An order that is "${order.status}" cannot be changed any more`,
            });
        }

        if (status === 'Processing' && order.paymentMethod !== 'cod' && order.paymentStatus !== 'Completed') {
            return res.status(400).json({ message: 'Online payment has not been received for this order yet' });
        }

        if (status === 'Shipped') {
            if (!String(courierName || '').trim() || !String(trackingId || '').trim()) {
                return res.status(400).json({ message: 'Courier name and tracking ID are required to mark an order as shipped' });
            }
            order.courierName = String(courierName).trim();
            order.trackingId = String(trackingId).trim();
            order.trackingUrl = String(trackingUrl || '').trim();
            order.shippedAt = new Date();
            if (estimatedDelivery) order.estimatedDelivery = new Date(estimatedDelivery);
        }

        if (status === 'Delivered') {
            order.deliveredAt = new Date();
            if (order.paymentMethod === 'cod') order.paymentStatus = 'Completed'; // cash collected by courier
        }

        if (status === 'Cancelled') {
            if (!String(note || '').trim()) return res.status(400).json({ message: 'Please give a reason for cancelling the order' });
            order.cancelReason = String(note).trim();
            // Online money already received goes back to the customer
            if (order.paymentStatus === 'Completed' && order.paymentMethod === 'razorpay' && order.razorpayPaymentId) {
                try {
                    await refundOnline(order.razorpayPaymentId, order.total, { orderId: order.orderId, reason: 'Order cancelled' });
                    order.paymentStatus = 'Refunded';
                } catch (err) {
                    console.error('[ORDER] refund on cancel failed:', err.message);
                    return res.status(502).json({ message: 'Razorpay refund failed, order was not cancelled. ' + (err.error?.description || err.message) });
                }
            }
        }

        order.status = status;
        order.statusHistory.push({ status, note: String(note || '').trim() || undefined });
        await order.save();

        if (status === 'Cancelled') await restoreStock(order._id);

        const text = ORDER_MESSAGES[status]?.(order);
        if (text) await notifyUser(order.userId, { title: `Order ${status}`, message: text, type: 'order', link: `/order-tracking/${order.orderId}` });

        res.status(200).json(await Order.findById(order._id));
    } catch (error) {
        res.status(500).json({ message: 'Failed to update order', error: error.message });
    }
};
