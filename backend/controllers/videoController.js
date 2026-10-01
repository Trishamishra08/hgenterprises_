const Video = require('../models/Video');

exports.getVideos = async (req, res) => {
    try {
        const query = req.query.all === 'true' ? {} : { isActive: true };
        if (req.query.department) query.department = req.query.department;
        res.json(await Video.find(query).sort({ order: 1, createdAt: -1 }));
    } catch (error) {
        res.status(500).json({ message: 'Error fetching videos', error: error.message });
    }
};

exports.createVideo = async (req, res) => {
    try {
        res.status(201).json(await Video.create(req.body));
    } catch (error) {
        res.status(400).json({ message: 'Error creating video', error: error.message });
    }
};

exports.updateVideo = async (req, res) => {
    try {
        const video = await Video.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!video) return res.status(404).json({ message: 'Video not found' });
        res.json(video);
    } catch (error) {
        res.status(400).json({ message: 'Error updating video', error: error.message });
    }
};

exports.deleteVideo = async (req, res) => {
    try {
        const video = await Video.findByIdAndDelete(req.params.id);
        if (!video) return res.status(404).json({ message: 'Video not found' });
        res.json({ message: 'Video deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting video', error: error.message });
    }
};
