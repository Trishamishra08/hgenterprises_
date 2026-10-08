const Subscription = require('../models/Subscription');
const jwt = require('jsonwebtoken');

exports.createSubscription = async (req, res) => {
    try {
        const { name, email, phone, productId, productName, productPrice, monthlyInstallment, maturityValue } = req.body;

        if (!name || !email || !phone || !productName || !productPrice || !monthlyInstallment || !maturityValue) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Optional authentication check
        let userId = null;
        const token = req.headers.authorization?.split(' ')[1];
        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                userId = decoded.id;
            } catch (err) {
                // Ignore token errors for optional authentication
            }
        }

        const subscription = await Subscription.create({
            name,
            email,
            phone,
            userId,
            productId: productId || null,
            productName,
            productPrice,
            monthlyInstallment,
            maturityValue,
            status: 'Staged'
        });

        res.status(201).json({ message: 'Subscription inquiry submitted successfully!', subscription });
    } catch (error) {
        console.error('[CREATE SUBSCRIPTION ERROR]', error);
        res.status(500).json({ message: 'Failed to submit subscription inquiry', error: error.message });
    }
};

exports.getSubscriptions = async (req, res) => {
    try {
        const subscriptions = await Subscription.find()
            .populate('userId', 'name email phone')
            .sort({ createdAt: -1 });
        res.status(200).json(subscriptions);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch subscriptions', error: error.message });
    }
};

exports.updateSubscriptionStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const subscription = await Subscription.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        if (!subscription) return res.status(404).json({ message: 'Subscription not found' });
        res.status(200).json({ message: 'Subscription status updated successfully', subscription });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update subscription status', error: error.message });
    }
};

exports.deleteSubscription = async (req, res) => {
    try {
        const subscription = await Subscription.findByIdAndDelete(req.params.id);
        if (!subscription) return res.status(404).json({ message: 'Subscription not found' });
        res.status(200).json({ message: 'Subscription inquiry deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete subscription inquiry', error: error.message });
    }
};
