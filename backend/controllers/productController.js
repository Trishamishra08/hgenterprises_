const jwt = require('jsonwebtoken');
const Product = require('../models/Product');
const Pack = require('../models/Pack');
const User = require('../models/User');
const InventoryLog = require('../models/InventoryLog');

// Best-effort admin check for routes that stay public for active products but
// must not leak inactive/hidden ones to anonymous requests.
async function requesterIsAdmin(req) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return false;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        return user?.role === 'admin';
    } catch (_) {
        return false;
    }
}

// Get all products with optional filters
exports.getAllProducts = async (req, res) => {
    try {
        const { category, subcategory, targetGroup, tag, adminView } = req.query;
        // If not adminView, only show active products
        let query = adminView === 'true' ? {} : { isActive: true };

        if (category) query.category = category;
        if (subcategory) query.subcategory = subcategory;
        if (targetGroup) query.targetGroup = targetGroup;
        if (tag) query.tag = tag;

        const products = await Product.find(query).sort({ createdAt: -1 });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error: error.message });
    }
};

// Create product (Admin)
exports.createProduct = async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ message: 'Error creating product', error: error.message });
    }
};

// Update product (Admin)
exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.status(200).json(product);
    } catch (error) {
        res.status(400).json({ message: 'Error updating product', error: error.message });
    }
};

// Delete product (Admin)
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting product', error: error.message });
    }
};

// Toggle product active status (Admin)
exports.toggleProductStatus = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        product.isActive = !product.isActive;
        await product.save();
        res.status(200).json(product);
    } catch (error) {
        res.status(400).json({ message: 'Error toggling product status', error: error.message });
    }
};

// Bulk adjust stock (Admin)
exports.bulkAdjustStock = async (req, res) => {
    try {
        const { adjustments } = req.body; // Map: { productId: amount }
        const productIds = Object.keys(adjustments);

        const updatePromises = productIds.map(async (id) => {
            const amount = adjustments[id];
            const product = await Product.findById(id);
            if (!product) return;

            const oldStock = product.variants?.[0]?.stock || 0;
            const newStock = oldStock + amount;

            // Log the change
            await InventoryLog.create({
                productId: id,
                change: amount,
                oldStock,
                newStock,
                adminId: req.user.id,
                reason: 'Manual Adjustment'
            });

            // Update product
            return Product.findByIdAndUpdate(id, {
                $inc: { "variants.0.stock": amount }
            });
        });

        await Promise.all(updatePromises);
        res.status(200).json({ message: 'Stock adjusted successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error adjusting stock', error: error.message });
    }
};

// Get all inventory logs (Admin)
exports.getAllInventoryLogs = async (req, res) => {
    try {
        const logs = await InventoryLog.find()
            .populate('productId', 'name image')
            .populate('adminId', 'name')
            .sort({ createdAt: -1 });
        res.status(200).json(logs);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching logs', error: error.message });
    }
};

// Get single product
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        if (!product.isActive && !(await requesterIsAdmin(req))) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching product', error: error.message });
    }
};

// Get all packs
exports.getAllPacks = async (req, res) => {
    try {
        const packs = await Pack.find();
        res.status(200).json(packs);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching packs', error: error.message });
    }
};
