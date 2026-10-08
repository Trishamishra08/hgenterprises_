const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Banner = require('./models/Banner');
const { cloudinary } = require('./config/cloudinary');

dotenv.config();

const BANNERS_TO_SEED = [
    {
        badge: 'Daily Essentials',
        title: 'Minimalist Grace Every Day',
        description: 'Statement pieces designed for your everyday lifestyle.',
        btnText: 'Explore Now',
        link: '/shop',
        image: 'https://images.unsplash.com/photo-1626784215021-2e39ccf971cd?auto=format&fit=crop&w=1600&q=80',
        cardImage: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=200',
        status: 'Active',
        startDate: 'Dec 01, 2024',
        endDate: 'Jan 31, 2025',
        secondaryTitle: 'Exquisite Details',
        secondaryLink: '/collections/minimalist'
    },
    {
        badge: 'Wedding Specials',
        title: 'Bridal Elegance Redefined',
        description: 'Timeless silver pieces for your most special moments.',
        btnText: 'Shop Bridal',
        link: '/category/rings',
        image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=1600&q=80',
        cardImage: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=200',
        status: 'Active',
        startDate: 'Dec 20, 2024',
        endDate: 'Feb 28, 2025',
        secondaryTitle: 'Bridal Sets',
        secondaryLink: '/collections/bridal'
    }
];

const seedBanners = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB...');

        // Optional: Clear existing banners if you want a clean seed
        // await Banner.deleteMany({});

        for (const bannerData of BANNERS_TO_SEED) {
            console.log(`Uploading images for: ${bannerData.title}`);

            // Upload primary image
            const mainRes = await cloudinary.uploader.upload(bannerData.image, {
                folder: 'HGEnterprises/banners'
            });

            // Upload secondary (card) image
            const cardRes = await cloudinary.uploader.upload(bannerData.cardImage, {
                folder: 'HGEnterprises/banners'
            });

            const newBanner = new Banner({
                ...bannerData,
                image: mainRes.secure_url,
                cardImage: cardRes.secure_url
            });

            await newBanner.save();
            console.log(`Saved banner: ${newBanner.title}`);
        }

        console.log('Seeding completed successfully!');
        process.exit();
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seedBanners();
