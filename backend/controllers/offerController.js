const Offer = require('../models/Offer');

// Get all offers
exports.getAllOffers = async (req, res) => {
    try {
        const { adminView } = req.query;
        const query = adminView === 'true' ? {} : { isActive: true };
        const offers = await Offer.find(query).sort({ createdAt: -1 });
        res.status(200).json(offers);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching offers', error: error.message });
    }
};

// Get single offer
exports.getOfferById = async (req, res) => {
    try {
        const offer = await Offer.findById(req.params.id);
        if (!offer) return res.status(404).json({ message: 'Offer not found' });
        res.status(200).json(offer);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching offer', error: error.message });
    }
};

// Create offer (Admin)
exports.createOffer = async (req, res) => {
    try {
        const offer = new Offer(req.body);
        await offer.save();
        res.status(201).json(offer);
    } catch (error) {
        res.status(400).json({ message: 'Error creating offer', error: error.message });
    }
};

// Update offer (Admin)
exports.updateOffer = async (req, res) => {
    try {
        const offer = await Offer.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!offer) return res.status(404).json({ message: 'Offer not found' });
        res.status(200).json(offer);
    } catch (error) {
        res.status(400).json({ message: 'Error updating offer', error: error.message });
    }
};

// Delete offer (Admin)
exports.deleteOffer = async (req, res) => {
    try {
        const offer = await Offer.findByIdAndDelete(req.params.id);
        if (!offer) return res.status(404).json({ message: 'Offer not found' });
        res.status(200).json({ message: 'Offer deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting offer', error: error.message });
    }
};
