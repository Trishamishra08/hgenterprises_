const mongoose = require('mongoose');
const Product = require('../backend/models/Product');
require('dotenv').config({ path: '../backend/.env' });

async function test() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');

        const testProduct = new Product({
            name: 'Test Product ' + Date.now(),
            category: 'necklaces',
            subcategory: 'Kundan',
            brand: 'HG JEWELS',
            variants: [{
                name: 'Default',
                mrp: 1000,
                price: 800,
                stock: 10
            }]
        });

        await testProduct.save();
        console.log('Success!');
    } catch (error) {
        console.error('Validation Error Details:');
        if (error.errors) {
            Object.keys(error.errors).forEach(key => {
                console.log(`${key}: ${error.errors[key].message}`);
            });
        } else {
            console.error(error.message);
        }
    } finally {
        await mongoose.connection.close();
    }
}

test();
