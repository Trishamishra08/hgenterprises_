const Page = require('../models/Page');

exports.getPage = async (req, res) => {
    try {
        const page = await Page.findOne({ id: req.params.pageId });
        if (!page) {
            return res.status(404).json({ message: 'Page not found' });
        }
        res.status(200).json(page);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching page', error: error.message });
    }
};

exports.updatePage = async (req, res) => {
    try {
        const { title, content } = req.body;
        const page = await Page.findOneAndUpdate(
            { id: req.params.pageId },
            { title, content, lastUpdatedBy: req.user?._id },
            { new: true, upsert: true }
        );
        res.status(200).json(page);
    } catch (error) {
        res.status(500).json({ message: 'Error updating page', error: error.message });
    }
};
