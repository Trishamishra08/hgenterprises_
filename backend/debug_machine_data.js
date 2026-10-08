const mongoose = require('mongoose');
const Product = require('./models/Product');
const Category = mongoose.model('Category', new mongoose.Schema({ name: String, id: String, subcategories: Array }));
require('dotenv').config();

const debugDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");

        const cats = await Category.find({});
        console.log("--- CATEGORIES ---");
        cats.forEach(c => console.log(`Name: "${c.name}", ID: "${c.id}"`));

        const machineProds = await Product.find({ category: /machine/i });
        console.log("\n--- MACHINE PRODUCTS ---");
        machineProds.forEach(p => console.log(`Name: "${p.name}", Category: "${p.category}", Subcategory: "${p.subcategory}"`));

        process.exit();
    } catch (err) {
        console.error("Error:", err);
        process.exit(1);
    }
};

debugDB();
