const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

const CATEGORY_IMAGES = {
    'RINGS': [
        'https://images.unsplash.com/photo-1605100804763-247f67b454e4?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1622398925373-3f91b1e275f5?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&q=80&w=800'
    ],
    'NECKLACES': [
        'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?auto=format&fit=crop&q=80&w=800'
    ],
    'EARRINGS': [
        'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&q=80&w=800'
    ],
    'BRACELETS': [
        'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800'
    ],
    'PENDANTS': [
        'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800'
    ],
    'GOLD COINS': [
        'https://images.unsplash.com/photo-1621504450181-5d356f007b89?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1563820228308-df8cfc5f0a35?auto=format&fit=crop&q=80&w=800'
    ],
    'DEFAULT': [
        'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800'
    ]
};

const run = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB. Beginning high-quality image updates...');

        const products = await Product.find({});
        let updatedCount = 0;

        for (const product of products) {
            const category = product.category ? product.category.toUpperCase() : 'DEFAULT';
            const imagePool = CATEGORY_IMAGES[category] || CATEGORY_IMAGES['DEFAULT'];
            
            // Assign a random high-quality image from the pool based on category
            const randomPrimary = imagePool[Math.floor(Math.random() * imagePool.length)];
            const randomSecondary = imagePool[Math.floor(Math.random() * imagePool.length)];

            product.image = randomPrimary;
            product.hoverImage = randomSecondary;
            product.images = [randomPrimary, randomSecondary];

            await product.save();
            updatedCount++;
        }

        console.log(`Successfully updated ${updatedCount} products with beautiful Unsplash images!`);
        process.exit(0);
    } catch (e) {
        console.error('Failed to update images:', e);
        process.exit(1);
    }
};

run();
