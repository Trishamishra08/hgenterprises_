const Suggestion = require('../models/Suggestion');

exports.addSuggestion = async (req, res) => {
    try {
        const { name, email, message, userId, phone, source } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const suggestion = await Suggestion.create({
            name,
            email,
            message,
            phone: phone || '',
            source: source === 'welcome-popup' ? 'welcome-popup' : 'suggestion',
            userId: userId || null
        });

        res.status(201).json({ message: 'Suggestion submitted successfully!', suggestion });
    } catch (error) {
        console.error('[ADD SUGGESTION ERROR]', error);
        res.status(500).json({ message: 'Failed to submit suggestion', error: error.message });
    }
};

exports.getSuggestions = async (req, res) => {
    try {
        const suggestions = await Suggestion.find().sort({ createdAt: -1 });
        res.status(200).json(suggestions);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch suggestions', error: error.message });
    }
};

exports.updateSuggestionStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const suggestion = await Suggestion.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        if (!suggestion) return res.status(404).json({ message: 'Suggestion not found' });
        res.status(200).json({ message: 'Status updated', suggestion });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update suggestion', error: error.message });
    }
};

exports.deleteSuggestion = async (req, res) => {
    try {
        const suggestion = await Suggestion.findByIdAndDelete(req.params.id);
        if (!suggestion) return res.status(404).json({ message: 'Suggestion not found' });
        res.status(200).json({ message: 'Suggestion deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete suggestion', error: error.message });
    }
};
