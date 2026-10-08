const Banner = require('../models/Banner');

// Get all active banners (User)
exports.getAllBanners = async (req, res) => {
    try {
        const banners = await Banner.find({ status: 'Active' });
        res.status(200).json(banners);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching banners', error: error.message });
    }
};

// Get all banners (Admin)
exports.getAllBannersAdmin = async (req, res) => {
    try {
        const banners = await Banner.find();
        res.status(200).json(banners);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching banners', error: error.message });
    }
};

// Create a new banner
exports.createBanner = async (req, res) => {
    try {
        const banner = new Banner(req.body);
        await banner.save();
        res.status(201).json(banner);
    } catch (error) {
        res.status(500).json({ message: 'Error creating banner', error: error.message });
    }
};

// Update a banner
exports.updateBanner = async (req, res) => {
    try {
        const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!banner) return res.status(404).json({ message: 'Banner not found' });
        res.status(200).json(banner);
    } catch (error) {
        res.status(500).json({ message: 'Error updating banner', error: error.message });
    }
};

// Delete a banner
exports.deleteBanner = async (req, res) => {
    try {
        const banner = await Banner.findByIdAndDelete(req.params.id);
        if (!banner) return res.status(404).json({ message: 'Banner not found' });
        res.status(200).json({ message: 'Banner deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting banner', error: error.message });
    }
};

