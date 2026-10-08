const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Settings = require('./models/Settings');
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
            return 'https://images.unsplash.com/photo-1616150638538-ffb0679a3fc4?auto=format&fit=crop&q=80&w=800'; // Fallback
        }
        const result = await cloudinary.uploader.upload(filePath, {
            folder: 'HGEnterprises/sections'
        });
        return result.secure_url;
    } catch (error) {
        console.error(`Error uploading ${fileName}:`, error);
        return null;
    }
};

const SECTIONS_DEFAULTS = [
    {
        id: 'category-showcase',
        label: 'Category Showcase',
        items: [
            { id: '1', name: 'Pendants', path: '/category/pendants', imageFile: 'cat_pendant_wine.png', tag: '' },
            { id: '2', name: 'Rings', path: '/category/rings', imageFile: 'cat_ring_wine.png', tag: '' },
            { id: '3', name: 'Earrings', path: '/category/earrings', imageFile: 'cat_earrings_wine.png', tag: '' },
            { id: '4', name: 'Bracelets', path: '/category/bracelets', imageFile: 'cat_bracelet_wine.png', tag: '' },
            { id: '5', name: 'Anklets', path: '/category/anklets', imageFile: 'cat_anklet_wine.png', tag: '' },
            { id: '6', name: 'Chains', path: '/category/chains', imageFile: 'cat_chain_wine.png', tag: '' }
        ]
    },
    {
        id: 'price-range-showcase',
        label: 'Luxury In Range',
        items: [
            { id: 'under-999', name: 'Under ₹999', imageFile: 'price_under_999.png', path: "/shop?price_max=999", tag: '' },
            { id: 'under-1999', name: 'Under ₹1999', imageFile: 'price_under_1999.png', path: "/shop?price_max=1999", tag: '' },
            { id: 'under-2999', name: 'Under ₹2999', imageFile: 'price_under_2999.png', path: "/shop?price_max=2999", tag: '' },
            { id: 'under-3999', name: 'Under ₹3999', imageFile: 'price_under_3999.png', path: "/shop?price_max=3999", tag: '' }
        ]
    },
    {
        id: 'perfect-gift',
        label: 'Find the Perfect Gift',
        items: [
            { id: 'mother', name: "Mother", imageFile: 'gift_mother_silver.png', path: "/shop?recipient=mother", tag: '' },
            { id: 'friends', name: "Friends", imageFile: 'gift_friends_silver.png', path: "/shop?recipient=friends", tag: '' },
            { id: 'wife', name: "Wife", imageFile: 'gift_wife_silver.png', path: "/shop?recipient=wife", tag: '' },
            { id: 'sister', name: "Sister", imageFile: 'gift_sister_silver.png', path: "/shop?recipient=sister", tag: '' }
        ]
    },
    {
        id: 'new-launch',
        label: 'Limited Edition',
        items: [
            { id: 'earrings', name: "Earrings", imageFile: 'new_launch_earrings.png', path: "/category/earrings", tag: '' },
            { id: 'chains', name: "Chains", imageFile: 'new_launch_chains.png', path: "/category/chains", tag: '' },
            { id: 'studs', name: "Studs", imageFile: 'new_launch_studs.png', path: "/category/studs", tag: '' },
            { id: 'bracelets', name: "Bracelets", imageFile: 'new_launch_bracelets.png', path: "/category/bracelets", tag: '' },
            { id: 'anklets', name: "Anklets", imageFile: 'new_launch_anklets.png', path: "/category/anklets", tag: '' }
        ]
    },
    {
        id: 'latest-drop',
        label: 'Latest Drop',
        items: [
            { id: '1', name: "Midnight Silver Ring", price: "₹2,499", imageFile: 'latest_drop_ring.png', path: "/product/midnight-ring", tag: '' },
            { id: '2', name: "Lunar Pendant", price: "₹4,999", imageFile: 'latest_drop_necklace.png', path: "/product/lunar-pendant", tag: '' },
            { id: '3', name: "Noir Drop Earrings", price: "₹3,299", imageFile: 'latest_drop_earrings.png', path: "/product/noir-earrings", tag: '' },
            { id: '4', name: "Obsidian Chain", price: "₹5,999", imageFile: 'latest_drop_bracelet.png', path: "/product/obsidian-chain", tag: '' }
        ]
    },
    {
        id: 'most-gifted',
        label: 'Most Gifted Items',
        items: [
            { id: '1', name: "Earrings", imageFile: 'pink_earrings_1767775466166.png', path: "/shop?category=earrings", tag: '' },
            { id: '2', name: "Bracelets", imageFile: 'pink_bracelets_1767775488371.png', path: "/shop?category=bracelets", tag: '' },
            { id: '3', name: "Chains", imageFile: 'pink_chains_1767775516641.png', path: "/shop?category=chains", tag: '' },
            { id: '4', name: "Anklets", imageFile: 'pink_anklets_1767775536388.png', path: "/shop?category=anklets", tag: '' }
        ]
    },
    {
        id: 'proposal-rings',
        label: 'Proposal Rings',
        items: [
            { id: 'banner', name: "Proposal Rings", imageFile: 'proposal_banner.png', path: "/category/rings", tag: '' }
        ]
    },
    {
        id: 'curated-for-you',
        label: 'Curated For You',
        items: [
            { id: 'haldi', name: 'Haldi', imageFile: 'haldi.png', path: '/category/haldi' },
            { id: 'sangeet', name: 'Sangeet', imageFile: 'sangeet.png', path: '/category/sangeet' },
            { id: 'reception', name: 'Reception', imageFile: 'reception.png', path: '/category/reception' },
            { id: 'bridal', name: 'Gift for Bride', imageFile: 'bridal.png', path: '/category/bridal' },
            { id: 'bridesmaids', name: 'Gift for Bridesmaid', imageFile: 'hero_slide_3.png', path: '/category/bridesmaids' },
        ]
    },
    {
        id: 'style-it-your-way',
        label: 'Style It Your Way',
        items: [
            {
                id: '1', name: "Daily Wear", imageFile: 'banner_daily.png', tag: "Effortless Everyday",
                extraImageFiles: ['cat_pendant.png', 'cat_earrings_wine.png', 'cat_anklets.png']
            },
            {
                id: '2', name: "Office Wear", imageFile: 'banner_office.png', tag: "Professional Chic",
                extraImageFiles: ['silver_earrings_product.png', 'cat_pendant.png', 'cat_ring_wine.png']
            },
            {
                id: '3', name: "Party Wear", imageFile: 'banner_party.png', tag: "Glamour & Shine",
                extraImageFiles: ['cat_earrings_wine.png', 'cat_ring_wine.png', 'cat_anklets.png']
            },
            {
                id: '4', name: "Casual Wear", imageFile: 'trending_heritage.png', tag: "Relaxed Vibes",
                extraImageFiles: ['cat_anklets.png', 'silver_bracelet_product.png', 'gift_sister_silver.png']
            },
        ]
    }
];

const seedSections = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB for seeding sections...');

        let settings = await Settings.findOne();
        if (!settings) {
            settings = new Settings({});
        }

        const homepageSections = {};

        for (const section of SECTIONS_DEFAULTS) {
            console.log(`Processing section: ${section.label}...`);
            const items = [];
            for (const item of section.items) {
                console.log(`  Uploading image for item: ${item.name}...`);
                const imageUrl = await uploadImage(item.imageFile);

                const processedItem = {
                    ...item,
                    image: imageUrl
                };
                delete processedItem.imageFile;

                if (item.extraImageFiles) {
                    const extraImages = [];
                    for (const extraFile of item.extraImageFiles) {
                        const extraUrl = await uploadImage(extraFile);
                        extraImages.push(extraUrl);
                    }
                    processedItem.extraImages = extraImages;
                    delete processedItem.extraImageFiles;
                }

                items.push(processedItem);
            }
            homepageSections[section.id] = {
                id: section.id,
                label: section.label,
                items: items
            };
        }

        settings.homepageSections = homepageSections;
        settings.markModified('homepageSections');
        await settings.save();

        console.log('Homepage sections seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seedSections();
