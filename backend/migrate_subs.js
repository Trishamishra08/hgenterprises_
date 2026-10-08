const mongoose = require('mongoose');
require('dotenv').config();

const Category = require('./models/Category');

const CATEGORY_HIERARCHY = {
    'necklaces': ['Kundan', 'Oxidized', 'Gold Chain', 'Temple', 'Diamond', 'Choker', 'Pendant', 'Mangalsutra'],
    'rings': ['Solitaire', 'Gold Band', 'Diamond Ring', 'Engagement', 'Cocktail', 'Couple Rings'],
    'earrings': ['Studs', 'Jhumkas', 'Drops', 'Hoops', 'Sui Dhaga', 'Chandbali'],
    'bangles': ['Temple Jewellery', 'Gold Bangles', 'Bracelets', 'Kada', 'Cuff'],
    'anklets': ['Silver Anklets', 'Gold Anklets', 'Chain Anklets'],
    'sets': ['Bridal Sets', 'Party Wear', 'Minimal Sets'],
    'combos-packs': ['Office Wear', 'Gift Sets', 'Daily Wear'],
    'nose-pins': ['Gold', 'Diamond', 'Silver']
};

async function migrate() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hgenterprises');
        const categories = await Category.find({});

        for (const cat of categories) {
            const key = cat.id.toLowerCase();
            const subs = CATEGORY_HIERARCHY[key];
            if (subs && cat.subcategories.length === 0) {
                console.log(`Migrating ${cat.name}...`);
                cat.subcategories = subs.map(s => ({
                    name: s,
                    status: 'Active',
                    path: s.toLowerCase().replace(/\s+/g, '-')
                }));
                await cat.save();
            }
        }
        console.log('Migration complete.');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

migrate();
