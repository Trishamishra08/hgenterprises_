const mongoose = require('mongoose');
require('dotenv').config();

async function check() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const Product = mongoose.model('Product', new mongoose.Schema({ name: String }));
        const prods = await Product.find({ name: /King/i });
        console.log('Products found:', JSON.stringify(prods, null, 2));
    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}

check();
