const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

const JEWELLERY_PRODUCTS = [
    // --- NECKLACES ---
    {
        brand: 'HG JEWELS',
        name: "Elysian Pearl & Diamond Choker",
        category: 'NECKLACES',
        subcategory: 'Choker',
        targetGroup: 'Female',
        rating: 4.9,
        tag: 'NEW ARRIVAL',
        image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=600',
        hoverImage: 'https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?auto=format&fit=crop&q=80&w=600',
        description: 'An elegant handcrafted choker featuring premium Japanese Akoya pearls cradled by brilliant cut diamond accents in 18k white gold.',
        benefits: ['Lustrous Akoya Pearls', 'GIA Certified Accent Diamonds', 'Luxury Gift Box Included'],
        specifications: [
            { label: 'Pearls', value: '7.5mm - 8.0mm Akoya' },
            { label: 'Diamonds', value: '0.45 ct total weight' },
            { label: 'Metal', value: '18k White Gold' }
        ],
        variants: [
            { name: 'Standard Choker', mrp: 98000, price: 89000, discount: '9%off', stock: 5, sold: 12 }
        ]
    },
    {
        brand: 'HG LUXE',
        name: "Classic 22k Gold Rope Chain",
        category: 'NECKLACES',
        subcategory: 'Gold Chain',
        targetGroup: 'Unisex',
        rating: 4.8,
        tag: 'ESSENTIAL',
        image: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&q=80&w=600',
        description: 'A timeless solid 22k yellow gold rope chain meticulously crafted with diamond-cut facets for maximum sparkle.',
        benefits: ['Hallmarked 22k Gold', 'Durable Lobster Clasp', 'Lifetime Polish Warranty'],
        specifications: [
            { label: 'Metal', value: '22k Yellow Gold' },
            { label: 'Width', value: '3mm' },
            { label: 'Weight', value: '18.5g' }
        ],
        variants: [
            { name: '18 inches', mrp: 112000, price: 95000, discount: '15%off', stock: 8, sold: 45 },
            { name: '20 inches', mrp: 125000, price: 106000, discount: '15%off', stock: 6, sold: 30 }
        ]
    },

    // --- PENDANTS ---
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

    // --- EARRINGS ---
    {
        brand: 'HG PREMIUM',
        name: "Imperial Jhumka Gold Earrings",
        category: 'EARRINGS',
        subcategory: 'Jhumkas',
        targetGroup: 'Female',
        rating: 4.9,
        tag: 'PREMIUM',
        image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&q=80&w=600',
        description: 'Majestic traditional temple jhumkas intricately embellished with detailed gold beads, delicate filigree, and ruby accents.',
        benefits: ['Authentic Antique Finish', 'BIS Hallmarked Gold', 'Secure Screwback Post'],
        specifications: [
            { label: 'Metal', value: '22k Antique Gold' },
            { label: 'Stones', value: 'Natural Ruby Accents' },
            { label: 'Weight', value: '14.8g per pair' }
        ],
        variants: [
            { name: 'Standard Pair', mrp: 95000, price: 82000, discount: '13%off', stock: 3, sold: 19 }
        ]
    },
    {
        brand: 'HG SOLITAIRE',
        name: "Classic Diamond Solitaire Studs",
        category: 'EARRINGS',
        subcategory: 'Studs',
        targetGroup: 'Female',
        rating: 4.8,
        tag: 'CLASSIC',
        image: 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&q=80&w=600',
        description: 'Stunning matching pairs of round brilliant cut diamonds totaling 1.0 carat, set in standard 4-prong platinum crown settings.',
        benefits: ['IGI Certified Diamonds', 'Comfort Guardian Backs', 'Perfect for Daily Luxury'],
        specifications: [
            { label: 'Total Carat', value: '1.00 ctw' },
            { label: 'Clarity', value: 'VS1, Excellent Cut' },
            { label: 'Metal', value: '950 Platinum' }
        ],
        variants: [
            { name: '1.00 ctw Pair', mrp: 110000, price: 98000, discount: '10%off', stock: 5, sold: 34 }
        ]
    },

    // --- BRACELETS ---
    {
        brand: 'HG LUXE',
        name: "The Royal Kada Gold Bangle",
        category: 'BRACELETS',
        subcategory: 'Kada',
        targetGroup: 'Female',
        rating: 5.0,
        tag: 'EXCLUSIVE',
        image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=600',
        description: 'An imposing statement kada featuring deep hand-etched paisley motifs and exquisite openable hinge lock in pure 22k yellow gold.',
        benefits: ['Heavyweight Pure Gold', 'Secure Double-safety Clasp', 'Exquisite Handcrafted Finish'],
        specifications: [
            { label: 'Metal', value: '22k Yellow Gold' },
            { label: 'Weight', value: '28.5g' },
            { label: 'Inner Diameter', value: '2.4 inches' }
        ],
        variants: [
            { name: 'Size 2.4', mrp: 185000, price: 162000, discount: '12%off', stock: 2, sold: 8 },
            { name: 'Size 2.6', mrp: 195000, price: 171000, discount: '12%off', stock: 3, sold: 11 }
        ]
    },
    {
        brand: 'HG JEWELS',
        name: "Elysian Tennis Diamond Bracelet",
        category: 'BRACELETS',
        subcategory: 'Diamond Bracelets',
        targetGroup: 'Female',
        rating: 4.9,
        tag: 'TRENDING',
        image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80&w=600',
        description: 'A dazzling continuous line of 52 precisely matched round brilliant cut diamonds bezel-set in sleek 18k white gold.',
        benefits: ['Seamless Continuous Design', 'Security Clasp with Side Latch', 'Excellent Brilliance & Sparkle'],
        specifications: [
            { label: 'Total Diamonds', value: '3.50 ctw' },
            { label: 'Clarity', value: 'SI1-SI2, G-H Color' },
            { label: 'Metal', value: '18k White Gold' }
        ],
        variants: [
            { name: '7.0 inches', mrp: 280000, price: 245000, discount: '12%off', stock: 2, sold: 14 }
        ]
    },

    // --- MANGALSUTRA ---
    {
        brand: 'HG JEWELS',
        name: "Eternal Bond Diamond Mangalsutra",
        category: 'MANGALSUTRA',
        subcategory: 'Modern',
        targetGroup: 'Female',
        rating: 4.9,
        tag: 'MODERN CLASSIC',
        image: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&q=80&w=600',
        description: 'A contemporary mangalsutra design merging traditional black beads with a sparkling modern diamond cluster pendant set in 18k yellow gold.',
        benefits: ['Contemporary Sleek Styling', 'Ideal for Everyday Wear', 'BIS Hallmarked Gold'],
        specifications: [
            { label: 'Metal', value: '18k Yellow Gold' },
            { label: 'Diamonds', value: '0.28 ct' },
            { label: 'Beads', value: 'Premium Black Tourmaline Beads' }
        ],
        variants: [
            { name: 'Standard 16"', mrp: 48000, price: 42000, discount: '12%off', stock: 6, sold: 52 }
        ]
    }
];

const run = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB for all jewelry categories seeding...');

        // 1. Fix standard seeded Royal Kundan Gold Necklace category to 'NECKLACES'
        console.log('Checking and correcting category for "Royal Kundan Gold Necklace"...');
        const kundanResult = await Product.updateMany(
            { name: /Kundan Gold Necklace/i },
            { $set: { category: 'NECKLACES', subcategory: 'Bridal' } }
        );
        console.log(`Updated ${kundanResult.modifiedCount} product(s) to NECKLACES category.`);

        // 2. Insert new premium items
        for (const item of JEWELLERY_PRODUCTS) {
            const exists = await Product.findOne({ name: item.name });
            if (!exists) {
                console.log(`Inserting premium product: ${item.name}...`);
                await Product.create(item);
            } else {
                console.log(`Product "${item.name}" already exists, skipping.`);
            }
        }

        console.log('All jewelry categories populated successfully with gorgeous products!');
        process.exit(0);
    } catch (e) {
        console.error('Failed to seed jewellery products:', e);
        process.exit(1);
    }
};

run();
