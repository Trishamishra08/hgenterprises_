const Faq = require('../models/Faq');

exports.getAllFaqs = async (req, res) => {
    try {
        const faqs = await Faq.find().sort({ order: 1, createdAt: -1 });
        res.status(200).json(faqs);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch FAQs', error: error.message });
    }
};

exports.createFaq = async (req, res) => {
    try {
        const { question, answer, category, status, order } = req.body;
        const newFaq = new Faq({ question, answer, category, status, order });
        await newFaq.save();
        res.status(201).json(newFaq);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create FAQ', error: error.message });
    }
};

exports.updateFaq = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedFaq = await Faq.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedFaq) return res.status(404).json({ message: 'FAQ not found' });
        res.status(200).json(updatedFaq);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update FAQ', error: error.message });
    }
};

exports.deleteFaq = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedFaq = await Faq.findByIdAndDelete(id);
        if (!deletedFaq) return res.status(404).json({ message: 'FAQ not found' });
        res.status(200).json({ message: 'FAQ deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete FAQ', error: error.message });
    }
};
