const Order = require('../models/Order');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const Settings = require('../models/Settings');
const InventoryLog = require('../models/InventoryLog');

class OrderError extends Error {
    constructor(message, status = 400) {
        super(message);
        this.status = status;
    }
}

/**
 * Price an order from the database only. Nothing monetary is trusted from the client:
 * unit price, discount, shipping and GST are all recomputed here.
 */
async function priceOrder({ items, couponCode, userId }) {
    if (!Array.isArray(items) || items.length === 0) throw new OrderError('Cart is empty');

    const settings = (await Settings.findOne()) || { gstPercentage: 18, shippingCharge: 50 };

    const lines = [];
    for (const raw of items) {
        const productId = raw._id || raw.id;
        const quantity = Math.floor(Number(raw.quantity) || 1);
        if (!productId || quantity < 1) throw new OrderError('Invalid cart item');

        const product = await Product.findById(productId).catch(() => null);
        if (!product || !product.isActive) throw new OrderError(`"${raw.name || 'An item'}" is no longer available`);

        const variant = product.variants?.[0];
        const price = Number(variant?.price) || 0;
        if (price <= 0) throw new OrderError(`"${product.name}" has no valid price`);
        if ((variant?.stock ?? 0) < quantity) throw new OrderError(`Only ${Math.max(variant?.stock ?? 0, 0)} left of "${product.name}"`);

        lines.push({
            id: String(product._id),
            brand: product.brand || 'HG Enterprises',
            name: product.name,
            category: product.category || 'General',
            subcategory: product.subcategory || '',
            image: product.image || '',
            price,
            quantity,
            variant: raw.selectedSize != null ? String(raw.selectedSize) : (raw.variant || raw.size || 'Default'),
            unit: product.unit || 'pcs',
            options: {
                selectedSize: raw.selectedSize ?? null,
                selectedAttributes: raw.selectedAttributes && typeof raw.selectedAttributes === 'object' ? raw.selectedAttributes : {},
            },
        });
    }

    const subtotal = lines.reduce((sum, l) => sum + l.price * l.quantity, 0);

    // Coupon (validated server-side)
    let discount = 0;
    let appliedCode;
    if (couponCode) {
        const coupon = await Coupon.findOne({ code: String(couponCode).trim() });
        const now = Date.now();
        if (!coupon || !coupon.active) throw new OrderError('Invalid coupon code');
        if (coupon.validFrom && new Date(coupon.validFrom).getTime() > now) throw new OrderError('Coupon is not active yet');
        if (coupon.validUntil && new Date(coupon.validUntil).getTime() < now) throw new OrderError('Coupon has expired');
        if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) throw new OrderError('Coupon usage limit reached');
        if (subtotal < (coupon.minOrderValue || 0)) throw new OrderError(`Coupon needs a minimum order of ₹${coupon.minOrderValue}`);

        const used = await Order.countDocuments({
            userId,
            couponCode: coupon.code,
            status: { $ne: 'Cancelled' },
            paymentStatus: { $ne: 'Failed' },
        });
        if (used >= (coupon.perUserLimit || 1)) throw new OrderError('You have already used this coupon');

        const cats = (coupon.applicableCategories || []).map((c) => String(c).toLowerCase());
        const eligible = cats.length
            ? lines.filter((l) => cats.includes(String(l.category).toLowerCase())).reduce((s, l) => s + l.price * l.quantity, 0)
            : subtotal;
        if (eligible <= 0) throw new OrderError('Coupon does not apply to these items');

        discount = coupon.type === 'percent' ? (eligible * coupon.value) / 100 : coupon.value;
        if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
        discount = Math.round(Math.min(discount, eligible));
        appliedCode = coupon.code;
    }

    const isFirstOrder = (await Order.countDocuments({ userId, status: { $ne: 'Cancelled' } })) === 0;
    const shippingAmount = isFirstOrder ? 0 : (settings.shippingCharge ?? 50);

    // Prices are GST-inclusive: GST is the tax portion contained in the taxable amount
    const gstRate = (settings.gstPercentage ?? 18) / 100;
    const taxable = subtotal - discount;
    const gstAmount = Math.round(taxable - taxable / (1 + gstRate));
    const total = taxable + shippingAmount;

    return { lines, subtotal, discount, couponCode: appliedCode, shippingAmount, gstAmount, total, settings };
}

/**
 * Take stock for a paid / confirmed order. Idempotent: the atomic flag flip guarantees
 * that a verify call and a webhook racing each other deduct stock only once.
 */
async function deductStock(orderId) {
    const order = await Order.findOneAndUpdate(
        { _id: orderId, stockDeducted: { $ne: true } },
        { $set: { stockDeducted: true } },
        { new: true }
    );
    if (!order) return null; // already deducted

    for (const item of order.items) {
        const product = await Product.findById(item.id);
        if (!product) continue;
        const oldStock = product.variants?.[0]?.stock || 0;
        await Product.findByIdAndUpdate(item.id, { $inc: { 'variants.0.stock': -item.quantity, 'variants.0.sold': item.quantity } });
        await InventoryLog.create({
            productId: item.id,
            change: -item.quantity,
            oldStock,
            newStock: oldStock - item.quantity,
            reason: `Order #${order.orderId}`,
        });
    }

    if (order.couponCode) await Coupon.updateOne({ code: order.couponCode }, { $inc: { usageCount: 1 } });
    return order;
}

/** Give stock back (cancelled / failed order that had already taken stock). Idempotent. */
async function restoreStock(orderId, reason) {
    const order = await Order.findOneAndUpdate(
        { _id: orderId, stockDeducted: true },
        { $set: { stockDeducted: false } },
        { new: true }
    );
    if (!order) return null;

    for (const item of order.items) {
        const product = await Product.findById(item.id);
        if (!product) continue;
        const oldStock = product.variants?.[0]?.stock || 0;
        await Product.findByIdAndUpdate(item.id, { $inc: { 'variants.0.stock': item.quantity, 'variants.0.sold': -item.quantity } });
        await InventoryLog.create({
            productId: item.id,
            change: item.quantity,
            oldStock,
            newStock: oldStock + item.quantity,
            reason: reason || `Order #${order.orderId} cancelled`,
        });
    }
    return order;
}

/**
 * Add (direction +1) or take (direction -1) stock for a list of { id, quantity } lines.
 * Taking stock first checks every line so a request never half-applies.
 */
async function adjustItemsStock(items, direction, reason) {
    if (direction < 0) {
        for (const item of items) {
            const product = await Product.findById(item.id);
            if (!product) throw new OrderError(`Product "${item.name || item.id}" no longer exists`);
            if ((product.variants?.[0]?.stock ?? 0) < item.quantity) {
                throw new OrderError(`Not enough stock of "${product.name}" (have ${product.variants?.[0]?.stock ?? 0}, need ${item.quantity})`);
            }
        }
    }
    for (const item of items) {
        const product = await Product.findById(item.id);
        if (!product) continue;
        const oldStock = product.variants?.[0]?.stock || 0;
        const change = direction * item.quantity;
        await Product.findByIdAndUpdate(item.id, { $inc: { 'variants.0.stock': change } });
        await InventoryLog.create({ productId: item.id, change, oldStock, newStock: oldStock + change, reason });
    }
}

/** Refund part or all of an online payment through Razorpay. Returns the Razorpay refund id. */
async function refundOnline(paymentId, amountRupees, notes = {}) {
    const Razorpay = require('razorpay');
    const rzp = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });
    const refund = await rzp.payments.refund(paymentId, { amount: Math.round(amountRupees * 100), speed: 'normal', notes });
    return refund.id;
}

/** Mark an online order paid (called by verify + webhook). Safe to call twice. */
async function markPaid(order, paymentId) {
    if (order.paymentStatus !== 'Completed') {
        order.paymentStatus = 'Completed';
        order.razorpayPaymentId = paymentId || order.razorpayPaymentId;
        if (order.status === 'Pending') {
            order.status = 'Processing';
            order.statusHistory.push({ status: 'Processing', note: 'Online payment received' });
        }
        await order.save();
    }
    await deductStock(order._id);
    return Order.findById(order._id);
}

module.exports = { OrderError, priceOrder, deductStock, restoreStock, markPaid, adjustItemsStock, refundOnline };
