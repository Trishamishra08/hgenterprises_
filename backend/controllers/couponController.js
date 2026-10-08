const Coupon = require('../models/Coupon');

exports.getAllCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find().sort({ createdAt: -1 });
        res.status(200).json(coupons);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching coupons', error: error.message });
    }
};

exports.getCouponById = async (req, res) => {
    try {
        const coupon = await Coupon.findById(req.params.id);
        if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
        res.status(200).json(coupon);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching coupon', error: error.message });
    }
};

exports.createCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.create(req.body);
        res.status(201).json(coupon);
    } catch (error) {
        res.status(500).json({ message: 'Error creating coupon', error: error.message });
    }
};

exports.updateCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
        res.status(200).json(coupon);
    } catch (error) {
        res.status(500).json({ message: 'Error updating coupon', error: error.message });
    }
};

exports.deleteCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findByIdAndDelete(req.params.id);
        if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
        res.status(200).json({ message: 'Coupon deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting coupon', error: error.message });
    }
};
