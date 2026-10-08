const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const Pack = require('./models/Pack');
const Coupon = require('./models/Coupon');
const User = require('./models/User');
const { cloudinary } = require('./config/cloudinary');
const path = require('path');
const fs = require('fs');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

const assetsPath = path.join(__dirname, '..', 'frontend', 'src', 'modules', 'user', 'assets');

const uploadImage = async (fileName) => {
    try {
        const filePath = path.join(assetsPath, fileName);
        if (!fs.existsSync(filePath)) {
            console.error(`File not found: ${filePath}`);
            return null;
        }
        const result = await cloudinary.uploader.upload(filePath, {
            folder: 'HGEnterprises/products'
        });
        return result.secure_url;
    } catch (error) {
        console.error(`Error uploading ${fileName}:`, error);
        return null;
    }
};

const PRODUCTS_DATA = [
    // JEWELLERY
    {
        name: 'Royal Kundan Gold Necklace',
        category: 'RINGS', // Matching Category name from seedCategories
        subcategory: 'Bridal',
        rating: 4.9,
        tag: 'PREMIUM',
        imageFile: 'latest_drop_necklace.png',
        description: 'Exquisite handcrafted Kundan necklace set in 22k gold.',
        benefits: ['Hallmarked Gold', 'Authentic Kundan', 'Lifetime Polish Warranty'],
        specifications: [
            { label: 'Material', value: '22k Gold' },
            { label: 'Weight', value: '45g' }
        ],
        faqs: [
            { q: 'Is it hallmarked?', a: 'Yes, it comes with BIS Hallmark.' }
        ],
        variants: [
            { name: 'Standard', mrp: 160000, price: 145000, discount: '9%off', stock: 3, sold: 12 }
        ]
    },
    {
        name: 'Classic Diamond Solitaire Ring',
        category: 'RINGS',
        subcategory: 'Engagement',
        rating: 4.8,
        tag: 'ENGAGEMENT',
        imageFile: 'latest_drop_ring.png',
        description: 'A timeless solitaire diamond ring set in 18k white gold.',
        benefits: ['Certified Diamond', '18k White Gold', 'Free Resizing'],
        specifications: [
            { label: 'Diamond', value: '0.50 ct, VVS1' },
            { label: 'Metal', value: '18k White Gold' }
        ],
        faqs: [],
        variants: [
            { name: 'Size 7', mrp: 65000, price: 58000, discount: '11%off', stock: 8, sold: 15 }
        ]
    },
    // MACHINES
    {
        name: 'HG Ultra-Precision Fiber Laser',
        category: 'Laser Machines',
        subcategory: 'Fiber Laser',
        rating: 4.9,
        tag: 'INDUSTRIAL',
        imageFile: 'smart_wax_printer.png',
        description: 'High-precision laser marking and cutting machine for jewellery and industrial applications.',
        benefits: ['Micron Level Precision', 'Low Maintenance', 'Energy Efficient'],
        specifications: [
            { label: 'Power', value: '50W' },
            { label: 'Cooling', value: 'Air Cooled' }
        ],
        faqs: [
            { q: 'What is the lifespan?', a: 'Over 100,000 hours of operations.' }
        ],
        variants: [
            { name: '50W Standard', mrp: 450000, price: 420000, discount: '6%off', stock: 2, sold: 5 }
        ]
    },
    {
        name: 'Automated Wax Multi-Printer',
        category: 'Laser Machines',
        subcategory: '3D Printer',
        rating: 4.7,
        tag: 'NEW LAUNCH',
        imageFile: 'smart_wax_printer.png',
        description: '3D wax printer for high-detail jewellery casting molds.',
        benefits: ['Professional Quality', 'Rapid Prototyping', 'User Friendly'],
        specifications: [
            { label: 'Resolution', value: '25 microns' },
            { label: 'Build Area', value: '100x100mm' }
        ],
        faqs: [],
        variants: [
            { name: 'Pro Edition', mrp: 850000, price: 780000, discount: '8%off', stock: 1, sold: 3 }
        ]
    },
    // TOOLS
    {
        name: 'Professional Jewellers Loupe',
        category: 'Hand Tools',
        subcategory: 'Optics',
        rating: 4.6,
        tag: 'ESSENTIAL',
        imageFile: 'jewellery_magnifier.png',
        description: '10x magnification loupe with achromatic and aplanatic triplet lens.',
        benefits: ['Crystal Clear View', 'Distortion Free', 'Compact Design'],
        specifications: [
            { label: 'Magnification', value: '10x' },
            { label: 'Lens Diameter', value: '21mm' }
        ],
        faqs: [],
        variants: [
            { name: 'Standard', mrp: 2500, price: 1800, discount: '28%off', stock: 25, sold: 150 }
        ]
    },
    {
        name: 'Digital Precision Scale',
        category: 'Hand Tools',
        subcategory: 'Measurement',
        rating: 4.8,
        tag: 'TOP RATED',
        imageFile: 'jewellery_magnifier.png',
        description: 'Ultra-accurate scale for weighing gemstones and precious metals.',
        benefits: ['0.001g Precision', 'Auto-Calibration', 'Backlit Display'],
        specifications: [
            { label: 'Capacity', value: '100g' },
            { label: 'Readability', value: '0.001g' }
        ],
        faqs: [],
        variants: [
            { name: 'Standard', mrp: 5500, price: 4800, discount: '12%off', stock: 15, sold: 45 }
        ]
    }
];

const PACKS_DATA = [
    {
        brand: 'HG PREMIUM',
        name: 'Bridal Wedding Set - 22k Gold',
        category: 'Jewellery',
        subcategory: 'Necklaces',
        mrp: 150000,
        price: 135000,
        unitPrice: 'N/A',
        rating: 5.0,
        tag: 'LUXURY',
        discount: '10% OFF',
        imageFile: 'latest_drop_necklace.png',
        description: 'A magnificent 22k gold bridal set including a heavy necklace, long haram, earrings, and maang tikka.',
        contents: [
            { productName: 'Royal Temple Necklace', quantity: 1, variant: 'Standard' }
        ]
    }
];

const COUPONS_DATA = [
    {
        code: 'HGWELCOME',
        type: 'flat',
        value: 1000,
        minOrderValue: 10000,
        maxDiscount: null,
        validFrom: new Date('2026-01-01'),
        validUntil: new Date('2026-12-31'),
        usageLimit: 1000,
        usageCount: 0,
        perUserLimit: 1,
        applicableCategories: [],
        userEligibility: 'new',
        active: true,
        description: 'Flat ₹1000 OFF on your first HG Enterprises order above ₹10000!'
    }
];

const seed = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB for seeding...');

        // Clear existing data
        await Product.deleteMany({});
        await Pack.deleteMany({});
        await Coupon.deleteMany({});
        await User.deleteMany({});

        console.log('Cleared existing data.');

        // Seed Products
        for (const prod of PRODUCTS_DATA) {
            console.log(`Uploading image for product: ${prod.name}...`);
            const imageUrl = await uploadImage(prod.imageFile);
            const { imageFile, ...rest } = prod;
            await Product.create({ ...rest, image: imageUrl });
        }
        console.log('Products seeded.');

        // Seed Packs
        for (const pack of PACKS_DATA) {
            console.log(`Uploading image for pack: ${pack.name}...`);
            const imageUrl = await uploadImage(pack.imageFile);
            const { imageFile, ...rest } = pack;
            await Pack.create({ ...rest, image: imageUrl });
        }
        console.log('Packs seeded.');

        // Seed Coupons
        await Coupon.insertMany(COUPONS_DATA);
        console.log('Coupons seeded.');

        // Seed a sample Admin User
        const bcrypt = require('bcryptjs');
        const hashedPassword = await bcrypt.hash('admin12345', 10);
        await User.create({
            name: 'Super Admin',
            email: 'hgenterprises@gmail.com',
            password: hashedPassword,
            phone: '1234567890',
            role: 'admin'
        });
        console.log('Admin user seeded (hgenterprises@gmail.com).');

        console.log('Seeding completed successfully!');
        process.exit();
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seed();
