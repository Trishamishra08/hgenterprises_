const express = require('express');
const router = express.Router();
const bannerController = require('../controllers/bannerController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');
const { upload, uploadToCloudinary } = require('../config/cloudinary');
const { applyWatermark } = require('../utils/watermark');
const { prepareCatalogImage } = require('../utils/bgRemove');

// User Route
router.get('/', bannerController.getAllBanners);

// Admin Routes
router.get('/all', authMiddleware, adminMiddleware, bannerController.getAllBannersAdmin);
router.post('/', authMiddleware, adminMiddleware, bannerController.createBanner);
router.put('/:id', authMiddleware, adminMiddleware, bannerController.updateBanner);
router.delete('/:id', authMiddleware, adminMiddleware, bannerController.deleteBanner);

// Image Upload Endpoint with Watermark
router.post('/upload', authMiddleware, adminMiddleware, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

        // Lifestyle banners keep their original background unless ?removeBg=true
        const shouldRemoveBg = req.query.removeBg === 'true';
        const catalogBuffer = shouldRemoveBg
            ? await prepareCatalogImage(req.file.buffer)
            : req.file.buffer;

        const watermarkedBuffer = await applyWatermark(catalogBuffer);

        // Stream upload to Cloudinary
        const result = await uploadToCloudinary(watermarkedBuffer, 'HGEnterprises/products');

        res.status(200).json({ imageUrl: result.secure_url });
    } catch (error) {
        console.error("Image upload and watermark failed:", error);
        res.status(500).json({ message: 'Upload failed', error: error.message });
    }
});

module.exports = router;
