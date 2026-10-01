const Policy = require('../models/Policy');

const slugify = (s) => String(s || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

exports.getPolicies = async (req, res) => {
    try {
        const admin = req.query.all === 'true';
        res.json(await Policy.find(admin ? {} : { isActive: true }).select(admin ? '' : '-content').sort({ order: 1, createdAt: 1 }));
    } catch (error) {
        res.status(500).json({ message: 'Error fetching policies', error: error.message });
    }
};

exports.getPolicyBySlug = async (req, res) => {
    try {
        const policy = await Policy.findOne({ slug: req.params.slug, isActive: true });
        if (!policy) return res.status(404).json({ message: 'Policy not found' });
        res.json(policy);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching policy', error: error.message });
    }
};

exports.createPolicy = async (req, res) => {
    try {
        const body = { ...req.body, slug: slugify(req.body.slug || req.body.title) };
        res.status(201).json(await Policy.create(body));
    } catch (error) {
        res.status(400).json({ message: 'Error creating policy', error: error.message });
    }
};

exports.updatePolicy = async (req, res) => {
    try {
        const body = { ...req.body };
        if (body.slug) body.slug = slugify(body.slug);
        const policy = await Policy.findByIdAndUpdate(req.params.id, body, { new: true, runValidators: true });
        if (!policy) return res.status(404).json({ message: 'Policy not found' });
        res.json(policy);
    } catch (error) {
        res.status(400).json({ message: 'Error updating policy', error: error.message });
    }
};

exports.deletePolicy = async (req, res) => {
    try {
        const policy = await Policy.findByIdAndDelete(req.params.id);
        if (!policy) return res.status(404).json({ message: 'Policy not found' });
        res.json({ message: 'Policy deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting policy', error: error.message });
    }
};
