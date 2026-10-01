const Guideline = require('../models/Guideline');

const slugify = (s) => String(s || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

exports.getGuidelines = async (req, res) => {
    try {
        const admin = req.query.all === 'true';
        const query = admin ? {} : { isActive: true };
        if (req.query.department) query.department = req.query.department;
        res.json(await Guideline.find(query).select(admin ? '' : '-content').sort({ order: 1, createdAt: 1 }));
    } catch (error) {
        res.status(500).json({ message: 'Error fetching guidelines', error: error.message });
    }
};

exports.getGuideline = async (req, res) => {
    try {
        const g = await Guideline.findOne({ department: req.params.department, slug: req.params.slug, isActive: true });
        if (!g) return res.status(404).json({ message: 'Guideline not found' });
        res.json(g);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching guideline', error: error.message });
    }
};

exports.createGuideline = async (req, res) => {
    try {
        const body = { ...req.body, slug: slugify(req.body.slug || req.body.title) };
        res.status(201).json(await Guideline.create(body));
    } catch (error) {
        res.status(400).json({ message: 'Error creating guideline', error: error.message });
    }
};

exports.updateGuideline = async (req, res) => {
    try {
        const body = { ...req.body };
        if (body.slug) body.slug = slugify(body.slug);
        const g = await Guideline.findByIdAndUpdate(req.params.id, body, { new: true, runValidators: true });
        if (!g) return res.status(404).json({ message: 'Guideline not found' });
        res.json(g);
    } catch (error) {
        res.status(400).json({ message: 'Error updating guideline', error: error.message });
    }
};

exports.deleteGuideline = async (req, res) => {
    try {
        const g = await Guideline.findByIdAndDelete(req.params.id);
        if (!g) return res.status(404).json({ message: 'Guideline not found' });
        res.json({ message: 'Guideline deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting guideline', error: error.message });
    }
};
