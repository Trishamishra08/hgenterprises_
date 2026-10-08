const express = require('express');
const router = express.Router();
const returnController = require('../controllers/returnController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');
const { upload, uploadToCloudinary } = require('../config/cloudinary');

router.post('/', authMiddleware, returnController.createReturnRequest);
router.get('/my', authMiddleware, returnController.getUserReturns);
router.get('/', authMiddleware, adminMiddleware, returnController.getAllReturns);
router.get('/:id', authMiddleware, returnController.getReturnById);
router.patch('/:id', authMiddleware, adminMiddleware, returnController.updateReturnStatus);

// Image Upload Protocol for returns (Users can upload proof of damage)
router.post('/upload', authMiddleware, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
        
        // Return proof images do not need a watermark. Simply upload the buffer to the returns directory.
        const result = await uploadToCloudinary(req.file.buffer, 'HGEnterprises/returns');
        
        res.status(200).json({ imageUrl: result.secure_url });
    } catch (error) {
        console.error("Return upload error:", error);
        res.status(500).json({ message: 'Upload failed', error: error.message });
    }
});

module.exports = router;
