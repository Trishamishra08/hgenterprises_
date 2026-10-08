const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const Category = require('./models/Category');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

const PENDANTS_SUBCATEGORIES = [
    { name: 'Solitaire', status: 'Active', path: 'solitaire' },
    { name: 'Religious', status: 'Active', path: 'religious' },
    { name: 'Heart Shaped', status: 'Active', path: 'heart-shaped' },
    { name: 'Gemstone', status: 'Active', path: 'gemstone' },
    { name: 'Gold Pendant', status: 'Active', path: 'gold-pendant' },
    { name: 'Diamond Pendant', status: 'Active', path: 'diamond-pendant' }
];

const PENDANT_PRODUCTS = [
    {
        brand: 'HG SOLITAIRE',
        name: "Aura Celestial Diamond Pendant",
        category: 'PENDANTS',
        subcategory: 'Solitaire',
        targetGroup: 'Female',
        rating: 5.0,
        tag: 'BEST SELLER',
        image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=600',
        description: 'A striking 0.75 carat round brilliant cut solitaire diamond pendant suspended from a delicate 18k white gold cable chain.',
        benefits: ['GIA Certified Center Stone', 'Includes 18" Gold Chain', 'Complimentary Lifetime Appraisals'],
        specifications: [
            { label: 'Diamond Carat', value: '0.75 ct' },
            { label: 'Clarity', value: 'VVS1, Excellent Cut' },
            { label: 'Metal', value: '18k White Gold' }
        ],
        variants: [
            { name: 'Standard Set', mrp: 82000, price: 72000, discount: '12%off', stock: 4, sold: 28 }
        ]
    },
    {
        brand: 'HG JEWELS',
        name: "Sacred Ganesha Gold Pendant",
        category: 'PENDANTS',
        subcategory: 'Religious',
        targetGroup: 'Unisex',
        rating: 4.9,
        tag: 'TRADITIONAL',
        image: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&q=80&w=600',
        description: 'Meticulously detailed 22k yellow gold religious pendant depicting Lord Ganesha, detailed with premium matte-finish styling.',
        benefits: ['916 Hallmarked Gold', 'Unisex Devotional Piece', 'Comes with Certificate of Authenticity'],
        specifications: [
            { label: 'Metal', value: '22k Yellow Gold' },
            { label: 'Weight', value: '5.2g' },
            { label: 'Dimensions', value: '2.5cm x 1.8cm' }
        ],
        variants: [
            { name: 'Standard Pendant', mrp: 35000, price: 29900, discount: '14%off', stock: 12, sold: 88 }
        ]
    },
    {
        brand: 'HG JEWELS',
        name: "Amour Diamond Heart Pendant",
        category: 'PENDANTS',
        subcategory: 'Heart Shaped',
        targetGroup: 'Female',
        rating: 4.9,
        tag: 'VALENTINE SPECIAL',
        image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=600',
        hoverImage: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&q=80&w=600',
        description: 'An exquisite heart-shaped pendant featuring a pave-set border of brilliant-cut diamonds flanking a centerpiece sparkling diamond in 18k rose gold.',
        benefits: ['Romantic Heart Shape', 'Vessel of Pure Love', '18k Premium Rose Gold Chain Included'],
        specifications: [
            { label: 'Center Stone', value: '0.15 ct Diamond' },
            { label: 'Accent Stones', value: '0.22 ctw Diamonds' },
            { label: 'Metal', value: '18k Rose Gold' }
        ],
        variants: [
            { name: 'Standard Rose Gold', mrp: 52000, price: 45000, discount: '13%off', stock: 10, sold: 142 }
        ]
    },
    {
        brand: 'HG PREMIUM',
        name: "Elysian Emerald Halo Pendant",
        category: 'PENDANTS',
        subcategory: 'Gemstone',
        targetGroup: 'Female',
        rating: 5.0,
        tag: 'ROYAL EDIT',
        image: 'https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?auto=format&fit=crop&q=80&w=600',
        description: 'A deep green teardrop-shaped natural Zambian emerald surrounded by a sparkling diamond halo in 18k yellow gold.',
        benefits: ['A AAA Zambian Emerald Centerpiece', 'Brilliant Halo Construction', 'Royal Traditional Heritage Elegance'],
        specifications: [
            { label: 'Emerald', value: '1.20 ct Natural Zambian Pear' },
            { label: 'Diamonds', value: '0.35 ctw Round cut' },
            { label: 'Metal', value: '18k Yellow Gold' }
        ],
        variants: [
            { name: 'Teardrop Emerald', mrp: 89000, price: 78000, discount: '12%off', stock: 3, sold: 11 }
        ]
    },
    {
        brand: 'HG LUXE',
        name: "Classic 22k Gold Filigree Pendant",
        category: 'PENDANTS',
        subcategory: 'Gold Pendant',
        targetGroup: 'Female',
        rating: 4.8,
        tag: 'HERITAGE',
        image: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&q=80&w=600',
        description: 'A lightweight, intricate filigree art pendant crafted in hallmarked 22k yellow gold with delicate traditional floral motifs.',
        benefits: ['916 BIS Hallmarked', 'Extremely Intricate Handcrafted Filigree', 'Ultra Lightweight & Comfortable'],
        specifications: [
            { label: 'Metal', value: '22k Yellow Gold' },
            { label: 'Weight', value: '3.8g' },
            { label: 'Finish', value: 'High Polish Filigree' }
        ],
        variants: [
            { name: 'Filigree Gold', mrp: 32000, price: 27500, discount: '14%off', stock: 15, sold: 54 }
        ]
    },
    {
        brand: 'HG SOLITAIRE',
        name: "Stellar Starburst Diamond Pendant",
        category: 'PENDANTS',
        subcategory: 'Diamond Pendant',
        targetGroup: 'Female',
        rating: 4.9,
        tag: 'MODERN DESIGNS',
        image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=600',
        description: 'A celestial starburst motif pendant encrusted with high-clarity natural round diamonds, suspended from a platinum cable chain.',
        benefits: ['Celestial Star Design', 'High Contrast Platinum Shine', 'Stunning Gift for Celebrations'],
        specifications: [
            { label: 'Diamonds', value: '0.50 ctw Brilliant cut' },
            { label: 'Clarity', value: 'VVS2, G-H Color' },
            { label: 'Metal', value: '950 Platinum' }
        ],
        variants: [
            { name: 'Standard Platinum Set', mrp: 68000, price: 59000, discount: '13%off', stock: 6, sold: 47 }
        ]
    },
    {
        brand: 'HG JEWELS',
        name: "Infinite Love Knot Pendant",
        category: 'PENDANTS',
        subcategory: 'Heart Shaped',
        targetGroup: 'Female',
        rating: 4.7,
        tag: 'TRENDING',
        image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=600',
        description: 'An elegant infinity knot twisted into a heart silhouette, embellished with dainty micro-pave diamonds in sleek sterling silver.',
        benefits: ['Symbolizes Everlasting Bond', 'Tarnish-Resistant Coating', 'Perfect for Daily Styling'],
        specifications: [
            { label: 'Stones', value: 'Premium CZ Accents' },
            { label: 'Metal', value: '925 Sterling Silver' },
            { label: 'Chain Length', value: '16 inches + 2 inches extender' }
        ],
        variants: [
            { name: 'Sterling Silver', mrp: 9500, price: 6500, discount: '31%off', stock: 25, sold: 215 }
        ]
    },
    {
        brand: 'HG PREMIUM',
        name: "Royal Blue Sapphire Pendant",
        category: 'PENDANTS',
        subcategory: 'Gemstone',
        targetGroup: 'Female',
        rating: 5.0,
        tag: 'EXCLUSIVE',
        image: 'https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?auto=format&fit=crop&q=80&w=600',
        description: 'An imposing deep Ceylon blue sapphire in an oval crown cut, mounted in classic 4-prong white gold with diamonds accentuating the bail.',
        benefits: ['Ceylon Blue Natural Sapphire', 'Luxury Accent Diamonds on Bail', 'Comes with Gemstone Laboratory Certification'],
        specifications: [
            { label: 'Sapphire', value: '1.80 ct Oval Ceylon Blue' },
            { label: 'Diamonds', value: '0.08 ctw on Bail' },
            { label: 'Metal', value: '18k White Gold' }
        ],
        variants: [
            { name: 'Oval Sapphire Set', mrp: 110000, price: 95000, discount: '13%off', stock: 2, sold: 9 }
        ]
    }
];

const seedPendants = async () => {
    try {
        if (!MONGODB_URI) {
            console.error('MONGODB_URI is not defined in environment.');
            process.exit(1);
        }

        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB for Pendants category & products seeding...');

        // 1. Update Category with Subcategories
        console.log('Updating Pendants category subcategories...');
        const pendantsCat = await Category.findOne({ id: 'pendants' });
        if (pendantsCat) {
            pendantsCat.subcategories = PENDANTS_SUBCATEGORIES;
            await pendantsCat.save();
            console.log('Pendants category subcategories successfully updated!');
        } else {
            console.log('Pendants category not found in Category collection. Creating new one...');
            await Category.create({
                id: 'pendants',
                name: 'PENDANTS',
                department: 'jewellery',
                image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=600',
                status: 'Active',
                showInCollection: true,
                showInNavbar: true,
                subcategories: PENDANTS_SUBCATEGORIES
            });
            console.log('Pendants category created successfully with subcategories!');
        }

        // 2. Insert/Update Products
        console.log('Populating Pendants products database...');
        for (const item of PENDANT_PRODUCTS) {
            const exists = await Product.findOne({ name: item.name });
            if (!exists) {
                console.log(`Inserting pendant product: ${item.name}...`);
                await Product.create(item);
            } else {
                console.log(`Product "${item.name}" already exists. Updating its fields to match our latest premium curation...`);
                await Product.updateOne({ _id: exists._id }, item);
            }
        }

        console.log('Database seeding for Pendants completed successfully! 💎✨');
        process.exit(0);
    } catch (e) {
        console.error('Failed to seed pendants data:', e);
        process.exit(1);
    }
};

seedPendants();
