const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

const updateSpecs = async () => {
    try {
        if (!MONGODB_URI) {
            console.error('Error: MONGODB_URI not found in environment variables.');
            process.exit(1);
        }

        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB successfully!');

        // Specifications array exactly mapping to Image 1 & Image 2
        const specs = [
            // PRODUCT DETAILS
            { label: 'Product Code', value: '029595-5828902' },
            { label: 'Product Height', value: '22.5 mm' },
            { label: 'Product Width', value: '7.8 mm' },
            { label: 'Product Weight', value: '3.25 gram' },

            // DIAMOND DETAILS
            { label: 'Diamond Total Weight', value: '0.265 Ct' },
            { label: 'Diamond Total No. Of Diamonds', value: '25' },

            // METAL DETAILS
            { label: 'Metal Type', value: '18Kt Gold' },
            { label: 'Metal Weight', value: '3.2 gram' },

            // PRICE BREAKUP
            { label: 'Price Gold', value: '₹ 37,556/-' },
            { label: 'Price Diamond', value: '₹ 32,941/-' },
            { label: 'Price Making Charges', value: '₹ 16,149/-' },
            { label: 'Price GST', value: '₹ 2,599/-' },
            { label: 'Price Total', value: '₹ 89,245/-' },

            // TAGS
            { 
                label: 'Tags List', 
                value: 'White Rings, 18k Rings, Multistone Rings, Party Rings, Women Rings, 14k Rings, Gold Rings, Diamond Rings, Festive Rings, Engagement Rings, Rs 50000 And Above Rings, White Gold Rings, Akshaya Tritiya Rings, Fashion Rings, Workwear Rings' 
            }
        ];

        // Let's update Duchess Oval Cut Solitaire in MongoDB
        const result = await Product.updateOne(
            { name: "Duchess Oval Cut Solitaire" },
            { 
                $set: { 
                    specifications: specs,
                    price: 89245,
                    originalPrice: 99500, // Giving a nice ~10% discount
                } 
            }
        );

        if (result.matchedCount > 0) {
            console.log('Successfully updated Duchess Oval Cut Solitaire specifications!');
        } else {
            console.warn('Could not find Duchess Oval Cut Solitaire in database. Adding custom seed product...');
            const newProduct = {
                brand: 'HG SOLITAIRE',
                name: 'Duchess Oval Cut Solitaire',
                category: 'RINGS',
                subcategory: 'Solitaire',
                rating: 4.8,
                tag: 'NEW ARRIVAL',
                image: 'https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?auto=format&fit=crop&q=80&w=600',
                description: 'Exquisite oval cut diamond solitaire on a slim micro-pave 18k gold band.',
                benefits: [
                    'Certified Center Diamond',
                    'Elegant Micro-pave Setting',
                    'Complimentary Resizing & Certification'
                ],
                specifications: specs,
                price: 89245,
                originalPrice: 99500,
                variants: [
                    { name: 'Standard Set', mrp: 99500, price: 89245, discount: '10%off', stock: 5, sold: 12 }
                ]
            };
            await Product.create(newProduct);
            console.log('Successfully created Duchess Oval Cut Solitaire with premium specifications!');
        }

        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
};

updateSpecs();
