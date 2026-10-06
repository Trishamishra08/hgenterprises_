const mongoose = require('mongoose');

const linkSchema = new mongoose.Schema({
    id: Number,
    name: String,
    path: String
});

const announcementSchema = new mongoose.Schema({
    id: Number,
    icon: String,
    text: String
});


const settingsSchema = new mongoose.Schema({
    // Product Page Policies
    productHeader: { type: String, default: 'ESTIMATED DELIVERY DATE' },
    returnPolicy: { type: String, default: '2 Days Return' },
    exchangePolicy: { type: String, default: '10 Days Exchange' },
    codPolicy: { type: String, default: 'Cash On Delivery' },
    gstPercentage: { type: Number, default: 18 },
    shippingCharge: { type: Number, default: 50 },
    returnWindowDays: { type: Number, default: 7 },     // days after delivery a return can be requested
    exchangeWindowDays: { type: Number, default: 10 },  // days after delivery an exchange can be requested
    codMaxAmount: { type: Number, default: 50000 }, // Cash on Delivery is refused above this order total

    // Value Propositions
    warrantyText: { type: String, default: 'Lifetime Warranty' },
    safetyText: { type: String, default: 'Skin Safe Jewellery' },
    platingText: { type: String, default: '18k Gold Tone Plated' },

    // Announcement Bar
    announcementItems: [announcementSchema],

    // Fraud Alerts
    fraudWarning: { type: String, default: 'BEWARE OF FRAUD: HG Enterprises never asks for confidential banking details over phone or email.' },

    // Contact Info
    address: { type: String, default: '45/2, Golden Plaza, Business District, Jaipur' },
    phone: { type: String, default: '+91 91234 56789' },
    email: { type: String, default: 'hgenterprises@gmail.com' },
    website: { type: String, default: 'www.hgenterprises.com' },

    // Footer Config
    footerTagline: { type: String, default: 'Exquisite Artistry,' },
    footerSubTagline: { type: String, default: 'Individually Crafted for You.' },
    footerDescription: { type: String, default: 'Every piece at HG Enterprises tells a story of modern luxury and timeless craftsmanship.' },

    footerColumn1Title: { type: String, default: 'Experience' },
    footerColumn2Title: { type: String, default: 'Policies' },
    footerColumn3Title: { type: String, default: 'Our World' },

    footerExperienceLinks: [linkSchema],
    footerPoliciesLinks: [linkSchema],
    footerWorldLinks: [linkSchema],

    socialLinks: {
        facebook: { type: String, default: '#' },
        twitter: { type: String, default: '#' },
        instagram: { type: String, default: '#' },
        youtube: { type: String, default: '#' }
    },

    // Admin-managed social pages shown in the footer (Admin → Social Media)
    socialPages: [{
        platform: { type: String, default: 'other' },
        label: { type: String, default: '' },
        url: { type: String, required: true },
        isActive: { type: Boolean, default: true },
    }],

    footerDeliveryText: { type: String, default: 'Safe & Insured Express Worldwide Delivery' },
    footerCopyrightText: { type: String, default: 'HG Enterprises Pvt Ltd. All Rights Reserved.' },

    // Navbar Settings
    navbarLinks: {
        type: [{
            id: Number,
            name: String,
            path: String
        }],
        default: [
            { id: 1, name: 'Shop', path: '/all-products' },
            { id: 2, name: 'Best Sellers', path: '/best-sellers' },
            { id: 3, name: 'New Arrivals', path: '/new-arrivals' },
            { id: 4, name: 'About', path: '/about' }
        ]
    },

    // Dashboard Layout Configuration
    dashboardLayout: {
        type: [
            {
                id: String,
                name: String,
                enabled: { type: Boolean, default: true },
                order: Number
            }
        ],
        default: [
            { id: 'header', name: 'Editorial Header', enabled: true, order: 1 },
            { id: 'sectors', name: 'Sector Specifics', enabled: true, order: 2 },
            { id: 'stats', name: 'Metrics Grid', enabled: true, order: 3 },
            { id: 'analytics', name: 'Analytics & Alerts', enabled: true, order: 4 },
            { id: 'quickActions', name: 'Global Control Grid', enabled: true, order: 5 },
            { id: 'recentOrders', name: 'Fulfillment Section', enabled: true, order: 6 }
        ]
    },

    // Homepage Section Management
    homepageSections: {
        type: mongoose.Schema.Types.Mixed,
        default: {
            'category-showcase': { id: 'category-showcase', label: 'Category Showcase', items: [] },
            'price-range-showcase': { id: 'price-range-showcase', label: 'Luxury In Range', items: [] },
            'perfect-gift': { id: 'perfect-gift', label: 'Find the Perfect Gift', items: [] },
            'new-launch': { id: 'new-launch', label: 'Limited Edition', items: [] },
            'latest-drop': { id: 'latest-drop', label: 'Latest Drop', items: [] },
            'most-gifted': { id: 'most-gifted', label: 'Most Gifted Items', items: [] },
            'proposal-rings': { id: 'proposal-rings', label: 'Proposal Rings', items: [] },
            'curated-for-you': { id: 'curated-for-you', label: 'Curated For You', items: [] },
            'style-it-your-way': { id: 'style-it-your-way', label: 'Style It Your Way', items: [] },
            'services': { id: 'services', label: 'Our Services', subtitle: 'Expert care for your machines & precious jewelry', groups: [] }
        }
    },

    homeTrendingSlides: {
        type: [{
            id: Number,
            subtitle: String,
            title: String,
            titleItalic: String,
            desc: String,
            image: String
        }],
        default: []
    },

    // About Us Content
    aboutContent: {
        type: {
            heroTitle: String,
            heroSubtitle: String,
            mainStory: String,
            missionStatement: String,
            images: [{ id: Number, url: String, label: String }],
            features: [{ id: Number, title: String, description: String }],
            instagramImages: [{ id: Number, url: String }]
        },
        default: {
            heroTitle: 'About Us',
            heroSubtitle: 'Welcome to HG Enterprises, where elegance meets timeless tradition. We are more than just a brand.',
            mainStory: 'Our journey began with a passion for bringing handcrafted excellence to the modern lifestyle.',
            missionStatement: 'At HG Enterprises, we are committed to sustainability, ethical sourcing, and uncompromising quality.',
            images: [
                { id: 1, url: 'https://images.unsplash.com/photo-1543294001-f7cd5d7fb516', label: 'Craftmanship' },
                { id: 2, url: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a', label: 'Exquisite' },
                { id: 3, url: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed', label: 'Luxury' }
            ],
            features: [
                { id: 1, title: 'Free Shipping', description: 'Enjoy free and fast delivery on all orders above ₹2000.' },
                { id: 2, title: 'Premium Quality', description: 'Our products are crafted with 100% authentic materials.' },
                { id: 3, title: 'Secure Checkout', description: 'Shop with confidence using our encrypted payment gateways.' }
            ],
            instagramImages: [
                { id: 1, url: 'https://images.unsplash.com/photo-1600607686527-6fb886090705' },
                { id: 2, url: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a' },
                { id: 3, url: 'https://images.unsplash.com/photo-1535632787350-4e68ef0ac584' }
            ]
        }
    },

    // PDF Brochure Settings (for Machines & Tools product datasheets)
    pdfBrochure: {
        type: {
            companyName: { type: String, default: 'HARSHAD GAURI ENTERPRISES' },
            companyTagline: { type: String, default: 'PRECISION MACHINERY & TOOLING SOLUTIONS' },
            address: { type: String, default: '45/2, Golden Plaza, Business District, Mumbai - 400 001' },
            phone: { type: String, default: '+91 022 4028 3883 / 022 4028 3885' },
            email: { type: String, default: 'sales@hgenterprises.com' },
            website: { type: String, default: 'www.hgenterprises.com' },
            footerBgColor: { type: String, default: '#8B4356' },
            featuresHeading: { type: String, default: 'KEY FEATURES' },
            certificationText: { type: String, default: 'ISO 9001:2015 Certified' },
            footerDisclaimer: { type: String, default: 'This is an authentic technical brochure of Harshad Gauri Enterprises.' }
        },
        default: {
            companyName: 'HARSHAD GAURI ENTERPRISES',
            companyTagline: 'PRECISION MACHINERY & TOOLING SOLUTIONS',
            address: '45/2, Golden Plaza, Business District, Mumbai - 400 001',
            phone: '+91 022 4028 3883 / 022 4028 3885',
            email: 'sales@hgenterprises.com',
            website: 'www.hgenterprises.com',
            footerBgColor: '#8B4356',
            featuresHeading: 'KEY FEATURES',
            certificationText: 'ISO 9001:2015 Certified',
            footerDisclaimer: 'This is an authentic technical brochure of Harshad Gauri Enterprises.'
        }
    }
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);
