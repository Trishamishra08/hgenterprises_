const mongoose = require('mongoose');
require('dotenv').config();

const Category = require('./models/Category');

async function checkDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hgenterprises');
        const categories = await Category.find({});
        console.log('CATEGORIES IN DB:', JSON.stringify(categories, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkDB();
