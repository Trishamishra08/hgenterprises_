const Attribute = require('../models/Attribute');

const DEFAULT_ATTRIBUTES = [
    {
        key: 'metal-colour', name: 'Metal Colour', type: 'color', departments: ['jewellery'], order: 1,
        values: [
            { label: 'Yellow Gold', value: '#E6B84F' },
            { label: 'Rose Gold', value: '#E8A598' },
            { label: 'White Gold', value: '#D9D9DE' },
        ],
    },
    {
        key: 'ring-size', name: 'Ring Size', type: 'size', departments: ['jewellery'], order: 2,
        values: [5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((n) => ({ label: String(n) })),
    },
];

const slugify = (s) => String(s || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

exports.getAttributes = async (req, res) => {
    try {
        if ((await Attribute.countDocuments()) === 0) await Attribute.insertMany(DEFAULT_ATTRIBUTES);
        const query = req.query.all === 'true' ? {} : { isActive: true };
        if (req.query.department) query.departments = req.query.department;
        res.json(await Attribute.find(query).sort({ order: 1, createdAt: 1 }));
    } catch (error) {
        res.status(500).json({ message: 'Error fetching attributes', error: error.message });
    }
};

exports.createAttribute = async (req, res) => {
    try {
        const body = { ...req.body };
        body.key = slugify(body.key || body.name);
        res.status(201).json(await Attribute.create(body));
    } catch (error) {
        res.status(400).json({ message: 'Error creating attribute', error: error.message });
    }
};

exports.updateAttribute = async (req, res) => {
    try {
        const { key, ...body } = req.body; // key is immutable: products reference it
        const attr = await Attribute.findByIdAndUpdate(req.params.id, body, { new: true, runValidators: true });
        if (!attr) return res.status(404).json({ message: 'Attribute not found' });
        res.json(attr);
    } catch (error) {
        res.status(400).json({ message: 'Error updating attribute', error: error.message });
    }
};

exports.deleteAttribute = async (req, res) => {
    try {
        const attr = await Attribute.findByIdAndDelete(req.params.id);
        if (!attr) return res.status(404).json({ message: 'Attribute not found' });
        res.json({ message: 'Attribute deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting attribute', error: error.message });
    }
};
