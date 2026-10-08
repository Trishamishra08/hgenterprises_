const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('./models/Category');

dotenv.config();

const fixBrokenLinks = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Fixing specific broken categories...');

        // Fix Tools -> Measurement
        await Category.updateOne(
            { name: "Tools", "subcategories.name": "Measurement" },
            { $set: { "subcategories.$.image": "https://images.unsplash.com/photo-1622329390509-0d297920ab0a?auto=format&fit=crop&q=80&w=400" } }
        );

        // Fix Machines -> Casting
        await Category.updateOne(
            { name: "Machines", "subcategories.name": "Casting" },
            { $set: { "subcategories.$.image": "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=400" } }
        );

        console.log('Fixed! Now run migrate_unsplash.js again to sync these to Cloudinary.');
        process.exit();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

fixBrokenLinks();
