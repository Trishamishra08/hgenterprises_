const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('./models/Category');
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
            folder: 'HGEnterprises/categories'
        });
        return result.secure_url;
    } catch (error) {
        console.error(`Error uploading ${fileName}:`, error);
        return null;
    }
};

const CATEGORIES_DATA = [
    // JEWELLERY
    {
        id: 'rings',
        name: 'RINGS',
        department: 'jewellery',
        imageFile: 'cat_rings.png',
        status: 'Active',
        showInCollection: true,
        showInNavbar: true
    },
    {
        id: 'pendants',
        name: 'PENDANTS',
        department: 'jewellery',
        imageFile: 'cat_pendant.png',
        status: 'Active',
        showInCollection: true,
        showInNavbar: true
    },
    {
        id: 'earrings',
        name: 'EARRINGS',
        department: 'jewellery',
        imageFile: 'cat_earrings.png',
        status: 'Active',
        showInCollection: true,
        showInNavbar: true
    },
    {
        id: 'necklaces',
        name: 'NECKLACES',
        department: 'jewellery',
        imageFile: 'latest_drop_necklace.png',
        status: 'Active',
        showInCollection: true,
        showInNavbar: true
    },
    {
        id: 'bracelets',
        name: 'BRACELETS',
        department: 'jewellery',
        imageFile: 'latest_drop_bracelet.png',
        status: 'Active',
        showInCollection: true,
        showInNavbar: true
    },
    {
        id: 'mangalsutra',
        name: 'MANGALSUTRA',
        department: 'jewellery',
        imageFile: 'cat_necklaces_emerald.jpg',
        status: 'Active',
        showInCollection: true,
        showInNavbar: true
    },
    // TOOLS
    {
        id: 'jewellery-tools',
        name: 'Hand Tools',
        department: 'tools',
        imageFile: 'jewellery_magnifier.png',
        status: 'Active',
        showInCollection: true,
        showInNavbar: true
    },
    // MACHINES
    {
        id: 'laser-machines',
        name: 'Laser Machines',
        department: 'machines',
        imageFile: 'smart_wax_printer.png',
        status: 'Active',
        showInCollection: true,
        showInNavbar: true
    }
];

const seedCategories = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB...');

        await Category.deleteMany({});
        console.log('Cleared categories.');

        for (const cat of CATEGORIES_DATA) {
            console.log(`Uploading image for category: ${cat.name}...`);
            const imageUrl = await uploadImage(cat.imageFile);
            const { imageFile, ...rest } = cat;
            await Category.create({ ...rest, image: imageUrl || 'https://via.placeholder.com/400' });
        }

        console.log('Seeded categories successfully.');
        process.exit();
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seedCategories();
