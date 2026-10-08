const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const cloudinary = require('cloudinary').v2;
const multer = require('multer');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Use memory storage so we can manipulate the image buffer using Sharp before uploading
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
});

/**
 * Uploads an image buffer directly to Cloudinary using a stream.
 * @param {Buffer} fileBuffer - The image buffer to upload.
 * @param {string} folder - The destination folder on Cloudinary.
 * @returns {Promise<object>} - The Cloudinary upload result object.
 */
const uploadToCloudinary = (fileBuffer, folder = 'HGEnterprises/products') => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: folder,
                allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
                transformation: [
                    { quality: 'auto:good', fetch_format: 'auto' } // Auto-optimize image delivery quality/format
                ]
            },
            (error, result) => {
                if (error) {
                    console.error("Cloudinary upload stream error:", error);
                    return reject(error);
                }
                resolve(result);
            }
        );
        uploadStream.end(fileBuffer);
    });
};

module.exports = { cloudinary, upload, uploadToCloudinary };
