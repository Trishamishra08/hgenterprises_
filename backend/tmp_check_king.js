const mongoose = require('mongoose');
require('dotenv').config();

async function check() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const Category = mongoose.model('Category', new mongoose.Schema({ name: String, department: String }));
        const cats = await Category.find({ $or: [{ name: /King/i }, { department: /King/i }] });
        console.log('Categories found:', JSON.stringify(cats, null, 2));
    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}

check();
