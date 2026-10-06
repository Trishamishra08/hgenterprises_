const ReturnRequest = require('../models/ReturnRequest');
const Order = require('../models/Order');
const Settings = require('../models/Settings');
const { OrderError, adjustItemsStock, refundOnline } = require('../utils/orderService');
const { notifyUser } = require('../utils/notify');

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Create a return / exchange request.
 * Everything that matters (order ownership, delivered status, time window, quantities, amounts)
 * is checked and calculated here, not trusted from the browser.
 */
exports.createReturnRequest = async (req, res) => {
    try {
        const { orderId, type, items, reason, comment, images, bankDetails } = req.body;

        if (!['return', 'exchange'].includes(type)) return res.status(400).json({ message: 'Request type must be return or exchange' });
        if (!String(reason || '').trim()) return res.status(400).json({ message: 'Please select a reason' });
        if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ message: 'Select at least one item' });

        const order = await Order.findOne({ orderId, userId: req.user.id });
        if (!order) return res.status(404).json({ message: 'Order not found' });
        if (order.status !== 'Delivered') return res.status(400).json({ message: 'Return or exchange is possible only after the order is delivered' });

        const settings = (await Settings.findOne()) || {};
        const windowDays = type === 'return' ? (settings.returnWindowDays ?? 7) : (settings.exchangeWindowDays ?? 10);
        const deliveredAt = order.deliveredAt || order.updatedAt;
        if (Date.now() - new Date(deliveredAt).getTime() > windowDays * DAY_MS) {
            return res.status(400).json({ message: `The ${windowDays}-day ${type} period for this order is over` });
        }

        // Quantity already covered by earlier (non-rejected) requests on this order
        const earlier = await ReturnRequest.find({ orderId, status: { $ne: 'Rejected' } });
        const used = {};
        earlier.forEach((r) => r.items.forEach((i) => { used[i.id] = (used[i.id] || 0) + (i.quantity || 1); }));

        const lines = [];
        for (const raw of items) {
            const line = order.items.find((i) => String(i.id) === String(raw.id));
            if (!line) return res.status(400).json({ message: 'One of the selected items is not part of this order' });
            const quantity = Math.floor(Number(raw.quantity) || line.quantity);
            const available = line.quantity - (used[line.id] || 0);
            if (quantity < 1 || quantity > available) {
                return res.status(400).json({ message: `"${line.name}" already has a return/exchange request, or the quantity is more than ordered` });
            }
            lines.push({ id: line.id, name: line.name, price: line.price, quantity, image: line.image });
        }

        // Refund = item value minus the item's share of any coupon discount. Shipping is not refunded.
        const itemsTotal = lines.reduce((sum, l) => sum + l.price * l.quantity, 0);
        const discountShare = order.subtotal > 0 ? (order.discount || 0) * (itemsTotal / order.subtotal) : 0;
        const refundAmount = type === 'return' ? Math.round(itemsTotal - discountShare) : 0;

        // COD refunds go to the customer's bank account; online refunds go back to the original payment
        if (type === 'return' && order.paymentMethod === 'cod') {
            if (!bankDetails?.holderName || !bankDetails?.accountNumber || !bankDetails?.ifscCode) {
                return res.status(400).json({ message: 'Bank details are required to refund a Cash on Delivery order' });
            }
        }

        const request = await ReturnRequest.create({
            orderId,
            userId: req.user.id,
            type,
            items: lines,
            reason: String(reason).trim(),
            comment,
            bankDetails: order.paymentMethod === 'cod' ? bankDetails : undefined,
            refundAmount,
            evidence: { images: Array.isArray(images) ? images : [] },
            timeline: [{ status: 'Pending', note: 'Request submitted by customer' }],
        });

        res.status(201).json({ message: 'Request submitted successfully', request });
    } catch (error) {
        console.error('[RETURN REQUEST ERROR]', error);
        res.status(500).json({ message: 'Failed to submit request', error: error.message });
    }
};

// Get user's return requests
exports.getUserReturns = async (req, res) => {
    try {
        const returns = await ReturnRequest.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(returns);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch return requests', error: error.message });
    }
};

// Admin: Get all return requests
exports.getAllReturns = async (req, res) => {
    try {
        const type = req.query.type; // 'return' or 'exchange'
        const filter = type ? { type } : {};
        const returns = await ReturnRequest.find(filter).populate('userId', 'name email phone').sort({ createdAt: -1 });
        res.status(200).json(returns);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch all return requests', error: error.message });
    }
};

// Get one request: the customer who made it, or an admin
exports.getReturnById = async (req, res) => {
    try {
        const ret = await ReturnRequest.findById(req.params.id).populate('userId', 'name email phone');
        if (!ret) return res.status(404).json({ message: 'Return request not found' });
        const ownerId = String(ret.userId?._id || ret.userId);
        if (req.user.role !== 'admin' && ownerId !== String(req.user.id)) {
            return res.status(403).json({ message: 'Not allowed' });
        }
        // Attach the order's address so the admin can see where to pick up / deliver
        const order = await Order.findOne({ orderId: ret.orderId }).select('address paymentMethod paymentStatus total');
        res.status(200).json({ ...ret.toObject(), address: order?.address, orderPaymentMethod: order?.paymentMethod });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch return details', error: error.message });
    }
};

/**
 * Admin moves a request through the manual workflow (no courier integration, admin books everything):
 *   Pending -> Approved -> Picked Up -> Received -> Refunded (return) | Replaced (exchange)
 *   and Rejected at Pending / Approved / Received (failed quality check).
 */
const FLOW = {
    Pending: ['Approved', 'Rejected'],
    Approved: ['Picked Up', 'Rejected'],
    'Picked Up': ['Received'],
    Received: ['Refunded', 'Replaced', 'Rejected'],
};

exports.updateReturnStatus = async (req, res) => {
    try {
        const { status, adminComment, refundAmount, courier, restock, qcNote, refundReference, replacement } = req.body;
        const ret = await ReturnRequest.findById(req.params.id);
        if (!ret) return res.status(404).json({ message: 'Return request not found' });

        const allowed = FLOW[ret.status] || [];
        if (!allowed.includes(status)) {
            return res.status(400).json({
                message: allowed.length ? `A "${ret.status}" request can only move to: ${allowed.join(', ')}` : `A "${ret.status}" request is closed`,
            });
        }
        if (status === 'Refunded' && ret.type !== 'return') return res.status(400).json({ message: 'Only a return can be refunded. Exchanges end with a replacement.' });
        if (status === 'Replaced' && ret.type !== 'exchange') return res.status(400).json({ message: 'Only an exchange can be replaced' });

        const order = await Order.findOne({ orderId: ret.orderId });
        let timelineNote = String(adminComment || '').trim();
        let notice;
        let afterSave = null; // work that must only happen once the request itself is safely saved

        if (status === 'Rejected' && !timelineNote) return res.status(400).json({ message: 'Please write the reason for rejecting' });

        if (status === 'Approved') {
            notice = 'Your request is approved. Our team will arrange the pickup and contact you.';
        }

        if (status === 'Picked Up') {
            if (!String(courier?.partner || '').trim() || !String(courier?.awb || '').trim()) {
                return res.status(400).json({ message: 'Courier name and tracking number are required for the pickup' });
            }
            ret.courier = { partner: courier.partner.trim(), awb: courier.awb.trim(), status: 'Picked Up' };
            notice = `Your item was picked up by ${ret.courier.partner} (tracking ${ret.courier.awb}).`;
        }

        if (status === 'Received') {
            ret.qcNote = String(qcNote || '').trim();
            if (restock && !ret.restocked) {
                await adjustItemsStock(ret.items, +1, `Return received #${ret.orderId}`);
                ret.restocked = true;
            }
            notice = 'We received your item and are checking it. You will get an update soon.';
        }

        if (status === 'Refunded') {
            const amount = Number(refundAmount ?? ret.refundAmount);
            if (!(amount > 0) || amount > ret.refundAmount) {
                return res.status(400).json({ message: `Refund must be more than 0 and at most ₹${ret.refundAmount}` });
            }
            const online = order?.paymentMethod === 'razorpay' && order?.razorpayPaymentId && ['Completed', 'Partially Refunded'].includes(order.paymentStatus);
            if (online) {
                try {
                    ret.refundId = await refundOnline(order.razorpayPaymentId, amount, { orderId: ret.orderId, returnId: String(ret._id) });
                } catch (err) {
                    return res.status(502).json({ message: 'Razorpay refund failed: ' + (err.error?.description || err.message) });
                }
            } else if (!String(refundReference || '').trim()) {
                return res.status(400).json({ message: 'Enter the bank transfer reference (UTR) after paying the customer' });
            } else {
                ret.refundReference = String(refundReference).trim();
            }
            ret.refundedAmount = amount;
            ret.refundAmount = amount;

            if (order) {
                afterSave = async () => {
                    const others = await ReturnRequest.find({ orderId: ret.orderId, _id: { $ne: ret._id } }).select('refundedAmount');
                    const refundedSoFar = others.reduce((sum, r) => sum + (r.refundedAmount || 0), 0) + amount;
                    order.paymentStatus = refundedSoFar >= order.total - 1 ? 'Refunded' : 'Partially Refunded';
                    await order.save();
                };
            }
            notice = `Your refund of ₹${amount.toLocaleString('en-IN')} has been ${online ? 'sent to your original payment method. It can take 5-7 working days to show.' : 'transferred to your bank account.'}`;
        }

        if (status === 'Replaced') {
            if (!String(replacement?.courierName || '').trim() || !String(replacement?.trackingId || '').trim()) {
                return res.status(400).json({ message: 'Courier name and tracking number of the replacement shipment are required' });
            }
            if (!ret.replacementStockTaken) {
                await adjustItemsStock(ret.items, -1, `Replacement shipped #${ret.orderId}`);
                ret.replacementStockTaken = true;
            }
            ret.replacement = { courierName: replacement.courierName.trim(), trackingId: replacement.trackingId.trim(), shippedAt: new Date() };
            notice = `Your replacement has been shipped via ${ret.replacement.courierName} (tracking ${ret.replacement.trackingId}).`;
        }

        if (status === 'Rejected') {
            notice = `Your request could not be accepted. Reason: ${timelineNote}`;
        }

        ret.status = status;
        if (adminComment !== undefined) ret.adminComment = String(adminComment).trim();
        ret.timeline.push({ status, note: timelineNote || undefined });
        // Save first: once Razorpay has sent a refund, the request must never be left in its old status
        await ret.save();
        if (afterSave) await afterSave();

        await notifyUser(ret.userId, { title: `${ret.type === 'return' ? 'Return' : 'Exchange'} ${status}`, message: notice, type: 'order', link: '/profile/orders' });

        res.status(200).json(ret);
    } catch (error) {
        if (error instanceof OrderError) return res.status(error.status).json({ message: error.message });
        console.error('[RETURN UPDATE ERROR]', error);
        res.status(500).json({ message: 'Failed to update return status', error: error.message });
    }
};
