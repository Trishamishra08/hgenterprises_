require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

mongoose.connect(process.env.MONGODB_URI)
.then(async () => {
    console.log('Connected to MongoDB');

    await Product.updateMany(
        { category: 'Hand Tools' },
        { $set: { toolType: 'Hand Tools' } }
    );
    
    console.log('Update result completed');
    process.exit(0);
})
.catch((err) => {
    console.error('Error connecting to MongoDB', err);
    process.exit(1);
});
