const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./models/Product');

async function run() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB...');

        const names = [
            'Elysian Pearl & Diamond Choker',
            'Aura Celestial Diamond Pendant',
            'Classic Diamond Solitaire Studs',
            'Elysian Tennis Diamond Bracelet',
            'Sacred Ganesha Gold Pendant'
        ];

        const results = await Product.updateMany(
            { name: { $in: names } },
            { $set: { tag: 'GIFT' } }
        );
        console.log(`Successfully tagged ${results.modifiedCount} products as GIFT.`);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

run();
