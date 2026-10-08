const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./models/Product');

async function run() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB...');

        // 1. Search for existing gifts or gold coins
        const gifts = await Product.find({
            $or: [
                { name: /gift/i },
                { category: /gift/i },
                { subcategory: /gift/i },
                { tag: /gift/i }
            ]
        });
        console.log(`Found ${gifts.length} existing gift products.`);

        const coins = await Product.find({
            $or: [
                { name: /coin/i },
                { category: /coin/i },
                { subcategory: /coin/i },
                { tag: /coin/i }
            ]
        });
        console.log(`Found ${coins.length} existing coin products.`);

        // 2. Add sample Gold Coin products if not present
        if (coins.length === 0) {
            console.log('Adding premium sample Gold Coin products...');
            const sampleCoins = [
                {
                    brand: 'HG BULLION',
                    name: '24k Pure Gold Coin - 1g (999 Purity)',
                    category: 'JEWELLERY',
                    subcategory: 'Gold Coins',
                    targetGroup: 'Unisex',
                    rating: 4.9,
                    tag: 'BULLION',
                    image: 'https://images.unsplash.com/photo-1618409399993-94c0340b07a3?auto=format&fit=crop&q=80&w=600',
                    description: 'Invest in pure wealth. This 1 gram 24k (999) yellow gold coin is certified for purity and comes in tamper-proof card packaging.',
                    benefits: ['999 Certified Pure Gold', 'Tamper-Proof Packaging', 'High Resale Value'],
                    specifications: [
                        { label: 'Purity', value: '24k (999)' },
                        { label: 'Weight', value: '1 gram' },
                        { label: 'Metal', value: 'Yellow Gold' }
                    ],
                    variants: [
                        { name: '1 Gram Pack', mrp: 8500, price: 7800, discount: '8%off', stock: 50, sold: 120 }
                    ]
                },
                {
                    brand: 'HG BULLION',
                    name: '24k Pure Gold Coin - 5g (999 Purity)',
                    category: 'JEWELLERY',
                    subcategory: 'Gold Coins',
                    targetGroup: 'Unisex',
                    rating: 5.0,
                    tag: 'BULLION',
                    image: 'https://images.unsplash.com/photo-1618409399993-94c0340b07a3?auto=format&fit=crop&q=80&w=600',
                    description: 'Exquisite 5 gram 24k (999.9) pure yellow gold coin, beautifully minted with Lakshmi motif on one side and HG logo on the other.',
                    benefits: ['999.9 Ultrapure Gold', 'Beautiful Lakshmi Minting', 'Assay Certificate Included'],
                    specifications: [
                        { label: 'Purity', value: '24k (999.9)' },
                        { label: 'Weight', value: '5 grams' },
                        { label: 'Metal', value: 'Yellow Gold' }
                    ],
                    variants: [
                        { name: '5 Gram Pack', mrp: 41000, price: 38500, discount: '6%off', stock: 30, sold: 75 }
                    ]
                }
            ];

            for (const item of sampleCoins) {
                await Product.create(item);
                console.log(`Created product: ${item.name}`);
            }
        }

        // 3. Ensure some general jewelry is tagged with 'GIFT' or has 'gift' in tag if not present
        const giftTagged = await Product.find({ tag: /gift/i });
        if (giftTagged.length === 0) {
            console.log('No gift-tagged items found. Tagging some popular items as gifts...');
            const results = await Product.updateMany(
                { name: { $in: ["Aura Celestial Diamond Pendant", "Midnight Emerald Solitaire", "Midnight Ruby Drops"] } },
                { $set: { tag: 'GIFT' } }
            );
            console.log(`Tagged ${results.modifiedCount} products with GIFT.`);
        }

        console.log('Check and seed complete!');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

run();
