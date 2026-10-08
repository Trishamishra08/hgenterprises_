const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('./models/Category');
const Media = require('./models/Media');

dotenv.config();
const MONGODB_URI = process.env.MONGODB_URI;

const fixCategories = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        const jewelleryCat = await Category.findOne({ id: 'jewellery' });
        if (!jewelleryCat) {
            console.log('Jewellery not found');
            return process.exit(0);
        }

        const mapLocal = {
            'Pendants': 'cat_pendant.png',
            'Bracelets': 'cat_bracelets.png',
        };

        let updated = false;

        for (const sub of jewelleryCat.subcategories) {
            if (mapLocal[sub.name]) {
                const targetMedia = await Media.findOne({ name: mapLocal[sub.name] });
                if (targetMedia && targetMedia.url) {
                    sub.image = targetMedia.url;
                    updated = true;
                }
            } else if (sub.image && sub.image.includes('unsplash.com')) {
                // Try to fallback if we have a file
                console.log(`Unsplash used for ${sub.name}: ${sub.image}`);
            }
        }

        if (updated) {
            await jewelleryCat.save();
            console.log('Successfully updated jewellery category with local images');
        }

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

fixCategories();
