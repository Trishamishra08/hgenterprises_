const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('./models/Category');
const Product = require('./models/Product');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

const run = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB...');

        // 1. Fix subcategory images for Category 'rings'
        const ringCategory = await Category.findOne({ id: 'rings' });
        if (ringCategory) {
            console.log('Found Rings Category. Updating subcategory images...');
            
            const subcategoryImages = {
                'Solitaire': 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=400',
                'Gold Band': 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&q=80&w=400',
                'Diamond Ring': 'https://images.unsplash.com/photo-1605100821642-4c0787f75568?auto=format&fit=crop&q=80&w=400',
                'Engagement': 'https://images.unsplash.com/photo-1543294001-f7cd5d7fb516?auto=format&fit=crop&q=80&w=400',
                'Cocktail': 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=400',
                'Couple Rings': 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&q=80&w=400'
            };

            ringCategory.subcategories.forEach(sub => {
                if (subcategoryImages[sub.name]) {
                    sub.image = subcategoryImages[sub.name];
                    console.log(`Assigned image to subcategory: ${sub.name}`);
                }
            });

            await ringCategory.save();
            console.log('Rings Category subcategory images updated successfully!');
        } else {
            console.warn('RINGS category not found in DB!');
        }

        // 2. Clear existing dynamic rings products so we do not duplicate them (except the seeded ones if needed, or we just add new ones)
        // Let's delete any products that we are about to add to avoid duplicates, matching by name
        const namesToInsert = [
            "The Crown Empress Solitaire",
            "Elysian Round Cut Solitaire",
            "Infinity Classic Gold Band",
            "Eternal Promise Diamond Ring",
            "His & Hers Forever Bands",
            "Vintage Ruby & Diamond Halo Ring",
            "Duchess Oval Cut Solitaire",
            "Twisted Vine Rose Gold Band"
        ];
        
        await Product.deleteMany({ name: { $in: namesToInsert } });
        console.log('Removed old matching ring products...');

        // 3. Add Related Products under 'RINGS'
        const NEW_PRODUCTS = [
            {
                brand: 'HG SOLITAIRE',
                name: "The Crown Empress Solitaire",
                category: 'RINGS',
                subcategory: 'Solitaire',
                rating: 4.9,
                tag: 'BEST SELLER',
                image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=600',
                hoverImage: 'https://images.unsplash.com/photo-1605100821642-4c0787f75568?auto=format&fit=crop&q=80&w=600',
                description: 'A breathtaking 1.5 carat round brilliant cut diamond, set in an elegant 6-prong platinum crown setting.',
                benefits: ['IGI Certified', 'Conflict-Free Diamond', 'Lifetime Upgrade Policy'],
                specifications: [
                    { label: 'Diamond Carat', value: '1.50 ct' },
                    { label: 'Clarity', value: 'VVS2, Ideal Cut' },
                    { label: 'Metal', value: '950 Platinum' }
                ],
                variants: [
                    { name: 'Size 6', mrp: 210000, price: 185000, discount: '12%off', stock: 2, sold: 10 },
                    { name: 'Size 7', mrp: 210000, price: 185000, discount: '12%off', stock: 4, sold: 18 }
                ]
            },
            {
                brand: 'HG SOLITAIRE',
                name: "Elysian Round Cut Solitaire",
                category: 'RINGS',
                subcategory: 'Solitaire',
                rating: 4.8,
                tag: 'PREMIUM',
                image: 'https://images.unsplash.com/photo-1605100821642-4c0787f75568?auto=format&fit=crop&q=80&w=600',
                hoverImage: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=600',
                description: 'Classic 1.0 carat diamond ring with delicate diamond-accented shoulders set in 18k white gold.',
                benefits: ['GIA Certified', 'Free Luxury Packaging', 'Complimentary Appraisals'],
                specifications: [
                    { label: 'Diamond Carat', value: '1.00 ct' },
                    { label: 'Clarity', value: 'VS1, Excellent Cut' },
                    { label: 'Metal', value: '18k White Gold' }
                ],
                variants: [
                    { name: 'Size 6', mrp: 135000, price: 119000, discount: '11%off', stock: 5, sold: 14 },
                    { name: 'Size 7', mrp: 135000, price: 119000, discount: '11%off', stock: 6, sold: 22 }
                ]
            },
            {
                brand: 'HG LUXE',
                name: "Infinity Classic Gold Band",
                category: 'RINGS',
                subcategory: 'Gold Band',
                rating: 4.7,
                tag: 'CLASSIC',
                image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&q=80&w=600',
                description: 'Elegant, ultra-smooth solid gold band designed for seamless comfortable daily wear.',
                benefits: ['Hallmarked 22k Gold', 'Comfort Fit Design', 'Engraving Available'],
                specifications: [
                    { label: 'Material', value: '22k Yellow Gold' },
                    { label: 'Band Width', value: '4mm' },
                    { label: 'Weight', value: '6.5g' }
                ],
                variants: [
                    { name: 'Size 7', mrp: 45000, price: 38000, discount: '15%off', stock: 12, sold: 35 },
                    { name: 'Size 9', mrp: 48000, price: 41000, discount: '14%off', stock: 10, sold: 29 }
                ]
            },
            {
                brand: 'HG JEWELS',
                name: "Eternal Promise Diamond Ring",
                category: 'RINGS',
                subcategory: 'Engagement',
                rating: 4.9,
                tag: 'ENGAGEMENT',
                image: 'https://images.unsplash.com/photo-1543294001-f7cd5d7fb516?auto=format&fit=crop&q=80&w=600',
                description: 'A striking emerald-cut diamond ring surrounded by a vintage micro-pave halo of diamonds.',
                benefits: ['Micro-Pave Detailing', 'Conflict-Free Diamonds', 'Free Lifetime Cleaning'],
                specifications: [
                    { label: 'Center Stone', value: '0.85 ct' },
                    { label: 'Side Diamonds', value: '0.35 ct total' },
                    { label: 'Metal', value: '18k Yellow Gold' }
                ],
                variants: [
                    { name: 'Size 6', mrp: 95000, price: 84000, discount: '11%off', stock: 3, sold: 9 },
                    { name: 'Size 7', mrp: 95000, price: 84000, discount: '11%off', stock: 5, sold: 17 }
                ]
            },
            {
                brand: 'HG PREMIUM',
                name: "His & Hers Forever Bands",
                category: 'RINGS',
                subcategory: 'Couple Rings',
                rating: 4.8,
                tag: 'COUPLE',
                image: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&q=80&w=600',
                description: 'A luxurious set of matching wedding bands for couples, meticulously crafted in high-polish sterling silver.',
                benefits: ['Matching Set', 'Anti-Tarnish Coating', 'Custom Engraving Included'],
                specifications: [
                    { label: 'Material', value: '925 Sterling Silver' },
                    { label: 'Stone', value: 'Genuine Moissanite Accents' }
                ],
                variants: [
                    { name: 'Standard Set', mrp: 12500, price: 9900, discount: '20%off', stock: 15, sold: 40 }
                ]
            },
            {
                brand: 'HG LUXE',
                name: "Vintage Ruby & Diamond Halo Ring",
                category: 'RINGS',
                subcategory: 'Cocktail',
                rating: 5.0,
                tag: 'EXCLUSIVE',
                image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=600',
                description: 'A magnificent cocktail ring featuring a deep crimson royal Burmese ruby, haloed by premium brilliant cut diamonds.',
                benefits: ['Natural Burmese Ruby', 'Intricate Vintage Filigree', 'Luxury Vault Certificate'],
                specifications: [
                    { label: 'Ruby Weight', value: '2.10 ct' },
                    { label: 'Diamond Weight', value: '0.75 ct' },
                    { label: 'Metal', value: '18k Rose Gold' }
                ],
                variants: [
                    { name: 'Size 7', mrp: 210000, price: 185000, discount: '12%off', stock: 2, sold: 4 }
                ]
            },
            {
                brand: 'HG SOLITAIRE',
                name: "Duchess Oval Cut Solitaire",
                category: 'RINGS',
                subcategory: 'Solitaire',
                rating: 4.8,
                tag: 'NEW ARRIVAL',
                image: 'https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?auto=format&fit=crop&q=80&w=600',
                description: 'Exquisite 1.2 carat oval cut diamond solitaire on a slim micro-pave platinum band.',
                benefits: ['Certified Oval Diamond', 'Hand-Set Setting', 'Complimentary Resizing'],
                specifications: [
                    { label: 'Diamond Carat', value: '1.20 ct' },
                    { label: 'Metal', value: '950 Platinum' }
                ],
                variants: [
                    { name: 'Size 6', mrp: 175000, price: 155000, discount: '11%off', stock: 3, sold: 7 }
                ]
            },
            {
                brand: 'HG JEWELS',
                name: "Twisted Vine Rose Gold Band",
                category: 'RINGS',
                subcategory: 'Gold Band',
                rating: 4.7,
                tag: 'TRENDING',
                image: 'https://images.unsplash.com/photo-1543294001-f7cd5d7fb516?auto=format&fit=crop&q=80&w=600',
                description: 'Dainty twisted vine wedding ring embedded with micro diamonds in 18k warm rose gold.',
                benefits: ['Natural Accent Diamonds', 'Comfort Inner Curve', 'Nickel-Free Alloy'],
                specifications: [
                    { label: 'Metal', value: '18k Rose Gold' },
                    { label: 'Diamonds', value: '0.15 ct total' }
                ],
                variants: [
                    { name: 'Size 7', mrp: 55000, price: 48000, discount: '12%off', stock: 8, sold: 19 }
                ]
            }
        ];

        console.log(`Inserting ${NEW_PRODUCTS.length} premium ring products into the database...`);
        const createdProducts = await Product.insertMany(NEW_PRODUCTS);
        console.log(`Successfully added products! Created IDs: ${createdProducts.map(p => p._id).join(', ')}`);

        process.exit(0);
    } catch (e) {
        console.error('Failed to run database modification:', e);
        process.exit(1);
    }
};

run();
