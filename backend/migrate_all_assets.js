const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Media = require('./models/Media');
const Product = require('./models/Product');
const Pack = require('./models/Pack');
const Category = require('./models/Category');
const Banner = require('./models/Banner');
const Coupon = require('./models/Coupon');
const Ticket = require('./models/Ticket');
const path = require('path');
const fs = require('fs');
const { cloudinary } = require('./config/cloudinary');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
const assetsDir = path.join(__dirname, '..', 'frontend', 'src', 'modules', 'user', 'assets');

const uploadFile = async (filePath) => {
    try {
        const fileName = path.basename(filePath);
        const result = await cloudinary.uploader.upload(filePath, {
            folder: 'HGEnterprises/assets',
            resource_type: 'auto' // automatically detect image or video
        });

        await Media.create({
            name: fileName,
            url: result.secure_url,
            public_id: result.public_id,
            format: result.format,
            resource_type: result.resource_type,
            folder: result.folder
        });

        return result.secure_url;
    } catch (error) {
        console.error(`Error uploading ${filePath}:`, error);
        return null;
    }
};

const migrate = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB for migration...');

        // Clear existing media and data
        await Media.deleteMany({});
        await Product.deleteMany({});
        await Pack.deleteMany({});
        await Category.deleteMany({});
        await Banner.deleteMany({});
        await Coupon.deleteMany({});

        // 1. Upload ALL files in the assets directory
        const files = fs.readdirSync(assetsDir);
        const fileMap = {}; // name -> url

        console.log(`Uploading ${files.length} assets to Cloudinary...`);
        for (const file of files) {
            const filePath = path.join(assetsDir, file);
            if (fs.statSync(filePath).isFile()) {
                const url = await uploadFile(filePath);
                if (url) fileMap[file] = url;
            }
        }
        console.log('Finished uploading assets.');

        // 2. Data from mockData/data.js
        const PRODUCTS_DATA_1 = [
            {
                name: 'Royal Kundan Gold Necklace',
                category: 'Jewellery',
                subcategory: 'Necklaces',
                rating: 4.9,
                tag: 'PREMIUM',
                imageFile: 'latest_drop_necklace.png',
                description: 'Exquisite handcrafted Kundan necklace set in 22k gold.',
                benefits: ['Hallmarked Gold', 'Authentic Kundan', 'Lifetime Polish Warranty'],
                specifications: [{ label: 'Material', value: '22k Gold' }, { label: 'Weight', value: '45g' }],
                faqs: [{ q: 'Is it hallmarked?', a: 'Yes, it comes with BIS Hallmark.' }],
                variants: [{ name: 'Standard', mrp: 160000, price: 145000, discount: '9%off', stock: 3, sold: 12 }]
            },
            {
                name: 'Classic Diamond Solitaire Ring',
                category: 'Jewellery',
                subcategory: 'Rings',
                rating: 4.8,
                tag: 'ENGAGEMENT',
                imageFile: 'latest_drop_ring.png',
                description: 'A timeless solitaire diamond ring set in 18k white gold.',
                benefits: ['Certified Diamond', '18k White Gold', 'Free Resizing'],
                specifications: [{ label: 'Diamond', value: '0.50 ct, VVS1' }, { label: 'Metal', value: '18k White Gold' }],
                variants: [{ name: 'Size 7', mrp: 65000, price: 58000, discount: '11%off', stock: 8, sold: 15 }]
            },
            {
                name: 'Empire Diamond Pendant',
                category: 'Jewellery',
                subcategory: 'Pendants',
                rating: 4.9,
                tag: 'ELEGANCE',
                imageFile: 'latest_drop_earrings.png',
                description: 'A striking diamond pendant that captures the light from every angle.',
                benefits: ['IF Clarity Diamonds', '18k Rose Gold', 'Elegant Packaging'],
                specifications: [{ label: 'Diamond', value: '1.2 ct' }, { label: 'Metal', value: '18k Rose Gold' }],
                variants: [{ name: 'Rose Gold', mrp: 95000, price: 82000, discount: '14%off', stock: 5, sold: 8 }]
            },
            {
                name: 'Heritage Gold Bangle',
                category: 'Jewellery',
                subcategory: 'Bracelets',
                rating: 4.7,
                tag: 'HERITAGE',
                imageFile: 'latest_drop_bracelet.png',
                description: 'Traditional solid gold bangle with intricate hand-carved details.',
                benefits: ['Pure 22k Gold', 'Hand-Crafted', 'Traditional Design'],
                specifications: [{ label: 'Metal', value: '22k Gold' }, { label: 'Weight', value: '28g' }],
                variants: [{ name: 'Size 2.4', mrp: 110000, price: 98000, discount: '11%off', stock: 12, sold: 25 }]
            },
            {
                name: 'Pure Silver Anklet Set',
                category: 'Jewellery',
                subcategory: 'Anklets',
                rating: 4.5,
                tag: 'DAILY WEAR',
                imageFile: 'cat_anklets.png',
                description: 'Beautiful 925 sterling silver anklets for everyday elegance.',
                benefits: ['925 Sterling Silver', 'Skin Friendly', 'Durable Links'],
                specifications: [{ label: 'Material', value: '925 Silver' }, { label: 'Length', value: '10 Inches' }],
                variants: [{ name: 'Standard', mrp: 1800, price: 1400, discount: '22%off', stock: 50, sold: 120 }]
            }
        ];

        for (const p of PRODUCTS_DATA_1) {
            const { imageFile, ...rest } = p;
            await Product.create({ ...rest, image: fileMap[imageFile] || imageFile });
        }

        // 3. Data from modules/user/data/data.js
        const CATEGORIES_DATA = [
            {
                id: 'jewellery',
                name: "Jewellery",
                subcategories: [
                    { name: "Rings", imageFile: 'cat_rings_ruby.jpg', path: "rings" },
                    { name: "Pendants", image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=400", path: "pendants" },
                    { name: "Earrings", imageFile: 'cat_earrings_trad.jpg', path: "earrings" },
                    { name: "Necklaces", imageFile: 'cat_necklaces_emerald.jpg', path: "necklaces" },
                    { name: "Bracelets", image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=400", path: "bracelets" },
                    { name: "Mangalsutra", image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80&w=400", path: "mangalsutra" }
                ],
                materialLabel: "By Metal",
                materials: ["Diamond", "Gold", "Platinum"],
                popularTypes: ["Engagement", "Couple Bands", "Office Wear", "Stackable"]
            },
            {
                id: 'tools',
                name: "Tools",
                subcategories: [
                    { name: "Measurement", image: "https://images.unsplash.com/photo-1584947844621-a477341851e3?auto=format&fit=crop&q=80&w=400", path: "measurement" },
                    { name: "Cutting", image: "https://images.unsplash.com/photo-1506459225024-1428097a7e18?auto=format&fit=crop&q=80&w=400", path: "cutting" },
                    { name: "Polishing", image: "https://images.unsplash.com/photo-1615655406736-b37c4fabf923?auto=format&fit=crop&q=80&w=400", path: "polishing" }
                ],
                materialLabel: "By Material",
                materials: ["Stainless Steel", "Hardened Carbon", "Optical Grade"]
            },
            {
                id: 'machines',
                name: "Machines",
                subcategories: [
                    { name: "Cleaning", image: "https://images.unsplash.com/photo-1506459225024-1428097a7e18?auto=format&fit=crop&q=80&w=400", path: "cleaning" },
                    { name: "Casting", image: "https://images.unsplash.com/photo-1605100804763-247f67b3f41e?auto=format&fit=crop&q=80&w=400", path: "casting" },
                    { name: "Laser", image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=400", path: "laser" }
                ],
                materialLabel: "Engine Type",
                materials: ["Ultrasonic", "Hydraulic", "Fiber Laser"]
            }
        ];

        for (const cat of CATEGORIES_DATA) {
            const subcategories = cat.subcategories.map(sub => ({
                ...sub,
                image: sub.imageFile ? (fileMap[sub.imageFile] || sub.imageFile) : sub.image
            }));
            const { subcategories: _, ...rest } = cat;
            await Category.create({ ...rest, subcategories });
        }

        const BANNERS_DATA = [
            {
                id: 1,
                image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=1600",
                title: "The Heritage Collection",
                subtitle: "Luxury Crafted with Precision"
            }
        ];

        await Banner.insertMany(BANNERS_DATA);

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
                contents: [{ productName: 'Royal Temple Necklace', quantity: 1, variant: 'Standard' }]
            }
        ];

        for (const p of PACKS_DATA) {
            const { imageFile, ...rest } = p;
            await Pack.create({ ...rest, image: fileMap[imageFile] || imageFile });
        }

        const COUPONS_DATA = [
            {
                code: 'HGWELCOME',
                type: 'flat',
                value: 1000,
                minOrderValue: 10000,
                validUntil: new Date('2026-12-31'),
                userEligibility: 'new',
                active: true,
                description: 'Flat ₹1000 OFF on your first HG Enterprises order above ₹10000!'
            }
        ];

        await Coupon.insertMany(COUPONS_DATA);

        console.log('Migration completed successfully!');
        process.exit();
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
};

migrate();
