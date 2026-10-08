const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('./models/Category');
const Banner = require('./models/Banner');
const Product = require('./models/Product');
const Pack = require('./models/Pack');
const { cloudinary } = require('./config/cloudinary');
const https = require('https');
const fs = require('fs');
const path = require('path');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

const downloadImage = (url, filepath) => {
    return new Promise((resolve, reject) => {
        // Handle https only
        if (!url.startsWith('https://')) {
            return reject(new Error('URL must start with https://'));
        }
        https.get(url, (res) => {
            if (res.statusCode === 200) {
                res.pipe(fs.createWriteStream(filepath))
                    .on('error', reject)
                    .once('close', () => resolve(filepath));
            } else {
                res.resume(); // Consume response data to free up memory
                reject(new Error(`Request Failed With a Status Code: ${res.statusCode} for ${url}`));
            }
        }).on('error', reject);
    });
};

const uploadToCloudinary = async (filepath) => {
    try {
        const result = await cloudinary.uploader.upload(filepath, {
            folder: 'HGEnterprises/assets',
            resource_type: 'auto'
        });
        return result.secure_url;
    } catch (error) {
        console.error(`Cloudinary upload failed:`, error);
        return null;
    }
};

const migrateUnsplash = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to DB for deep Unsplash migration...');

        const tempDir = path.join(__dirname, 'temp_unsplash');
        if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

        const modelsToFix = [
            { model: Category, fields: ['subcategories.image'] },
            { model: Banner, fields: ['image'] },
            { model: Product, fields: ['image'] },
            { model: Pack, fields: ['image'] }
        ];

        for (const item of modelsToFix) {
            console.log(`Checking ${item.model.modelName}...`);
            const docs = await item.model.find();

            for (const doc of docs) {
                let changed = false;

                for (const field of item.fields) {
                    if (field.includes('.')) {
                        // Nested field like subcategories.image
                        const [arrayField, subField] = field.split('.');
                        if (doc[arrayField] && Array.isArray(doc[arrayField])) {
                            for (const sub of doc[arrayField]) {
                                if (sub[subField] && sub[subField].includes('unsplash.com')) {
                                    console.log(`Migrating unsplash image for ${sub.name || 'subcat'}...`);
                                    try {
                                        const filename = `unsplash_sub_${Date.now()}.jpg`;
                                        const filepath = path.join(tempDir, filename);
                                        await downloadImage(sub[subField], filepath);
                                        const secureUrl = await uploadToCloudinary(filepath);
                                        if (secureUrl) {
                                            sub[subField] = secureUrl;
                                            changed = true;
                                        }
                                    } catch (e) {
                                        console.warn(`Skipping ${sub[subField]}: ${e.message}`);
                                    }
                                }
                            }
                        }
                    } else if (doc[field] && doc[field].includes('unsplash.com')) {
                        console.log(`Migrating unsplash image for ${doc.name || doc.title || doc._id}...`);
                        try {
                            const filename = `unsplash_${Date.now()}.jpg`;
                            const filepath = path.join(tempDir, filename);
                            await downloadImage(doc[field], filepath);
                            const secureUrl = await uploadToCloudinary(filepath);
                            if (secureUrl) {
                                doc[field] = secureUrl;
                                changed = true;
                            }
                        } catch (e) {
                            console.warn(`Skipping ${doc[field]}: ${e.message}`);
                        }
                    }
                }

                if (changed) {
                    await doc.save();
                    console.log(`Updated ${item.model.modelName}: ${doc.name || doc.title || doc._id}`);
                }
            }
        }

        console.log('Deep migration completed!');
        process.exit();
    } catch (error) {
        console.error('Migration error:', error);
        process.exit(1);
    }
};

migrateUnsplash();
