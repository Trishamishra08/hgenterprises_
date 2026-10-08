const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./models/Product');

async function run() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB...');

        const products = await Product.find({});
        console.log(`TOTAL PRODUCTS IN DB: ${products.length}`);
        
        products.forEach(p => {
            console.log(`- ID: ${p._id}, Name: "${p.name}", Category: "${p.category}", Subcategory: "${p.subcategory}", Tag: "${p.tag}"`);
        });

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

run();
