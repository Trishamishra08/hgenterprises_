const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const dropIndex = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB...');

        const Banner = mongoose.connection.collection('banners');
        await Banner.dropIndex('id_1');
        console.log('Successfully dropped id_1 index from banners collection.');

        process.exit();
    } catch (error) {
        console.error('Failed to drop index:', error);
        process.exit(1);
    }
};

dropIndex();
