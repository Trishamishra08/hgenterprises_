// Product Images - Using User Module Assets
import necklaceAsset from '../modules/user/assets/latest_drop_necklace.png';
import ringAsset from '../modules/user/assets/latest_drop_ring.png';
import earringsAsset from '../modules/user/assets/latest_drop_earrings.png';
import braceletAsset from '../modules/user/assets/latest_drop_bracelet.png';
import ankletAsset from '../modules/user/assets/cat_anklets.png';

const necklaceUrl = necklaceAsset;
const ringUrl = ringAsset;
const earringsUrl = earringsAsset;
const braceletUrl = braceletAsset;
const ankletUrl = ankletAsset;

export const SKUS = [
    { id: 'sku_1', name: 'Gold Necklace 22k', unit: 'pc', price: 45000, category: 'Jewellery' },
    { id: 'sku_2', name: 'Diamond Ring 18k', unit: 'pc', price: 25000, category: 'Jewellery' },
    { id: 'sku_3', name: 'Silver Anklet 925', unit: 'pc', price: 1200, category: 'Jewellery' },
    { id: 'sku_4', name: 'Pearl Earrings', unit: 'pc', price: 8500, category: 'Jewellery' },
];

export const PACKS = [
    {
        id: '1',
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
        image: necklaceUrl,
        description: 'A magnificent 22k gold bridal set including a heavy necklace, long haram, earrings, and maang tikka.',
        contents: [
            { productId: 'p1', productName: 'Royal Temple Necklace', quantity: 1, variant: 'Standard' }
        ]
    }
];

export const PRODUCTS = [
    // --- JEWELLERY ---
    {
        id: 'p1',
        brand: 'HG JEWELS',
        name: 'Royal Kundan Gold Necklace',
        category: 'Jewellery',
        subcategory: 'Necklaces',
        rating: 4.9,
        tag: 'PREMIUM',
        image: necklaceUrl,
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
            { id: 'p1-v1', name: 'Standard', mrp: 160000, price: 145000, discount: '9%off', stock: 3, sold: 12 }
        ]
    },
    {
        id: 'p2',
        brand: 'HG SOLITAIRE',
        name: 'Classic Diamond Solitaire Ring',
        category: 'Jewellery',
        subcategory: 'Rings',
        rating: 4.8,
        tag: 'ENGAGEMENT',
        image: ringUrl,
        description: 'A timeless solitaire diamond ring set in 18k white gold.',
        benefits: ['Certified Diamond', '18k White Gold', 'Free Resizing'],
        specifications: [
            { label: 'Diamond', value: '0.50 ct, VVS1' },
            { label: 'Metal', value: '18k White Gold' }
        ],
        faqs: [],
        variants: [
            { id: 'p2-v1', name: 'Size 7', mrp: 65000, price: 58000, discount: '11%off', stock: 8, sold: 15 }
        ]
    },
    {
        id: 'p3',
        brand: 'HG LUXE',
        name: 'Empire Diamond Pendant',
        category: 'Jewellery',
        subcategory: 'Pendants',
        rating: 4.9,
        tag: 'ELEGANCE',
        image: earringsUrl,
        description: 'A striking diamond pendant that captures the light from every angle.',
        benefits: ['IF Clarity Diamonds', '18k Rose Gold', 'Elegant Packaging'],
        specifications: [
            { label: 'Diamond', value: '1.2 ct' },
            { label: 'Metal', value: '18k Rose Gold' }
        ],
        faqs: [],
        variants: [
            { id: 'p3-v1', name: 'Rose Gold', mrp: 95000, price: 82000, discount: '14%off', stock: 5, sold: 8 }
        ]
    },
    {
        id: 'p4',
        brand: 'HG TREND',
        name: 'Heritage Gold Bangle',
        category: 'Jewellery',
        subcategory: 'Bracelets',
        rating: 4.7,
        tag: 'HERITAGE',
        image: braceletUrl,
        description: 'Traditional solid gold bangle with intricate hand-carved details.',
        benefits: ['Pure 22k Gold', 'Hand-Crafted', 'Traditional Design'],
        specifications: [
            { label: 'Metal', value: '22k Gold' },
            { label: 'Weight', value: '28g' }
        ],
        faqs: [],
        variants: [
            { id: 'p4-v1', name: 'Size 2.4', mrp: 110000, price: 98000, discount: '11%off', stock: 12, sold: 25 }
        ]
    },
    {
        id: 'p5',
        brand: 'HG SILVER',
        name: 'Pure Silver Anklet Set',
        category: 'Jewellery',
        subcategory: 'Anklets',
        rating: 4.5,
        tag: 'DAILY WEAR',
        image: ankletUrl,
        description: 'Beautiful 925 sterling silver anklets for everyday elegance.',
        benefits: ['925 Sterling Silver', 'Skin Friendly', 'Durable Links'],
        specifications: [
            { label: 'Material', value: '925 Silver' },
            { label: 'Length', value: '10 Inches' }
        ],
        faqs: [],
        variants: [
            { id: 'p5-v1', name: 'Standard', mrp: 1800, price: 1400, discount: '22%off', stock: 50, sold: 120 }
        ]
    }
];

export const COUPONS = [
    {
        id: 'COUP-001',
        code: 'HGWELCOME',
        type: 'flat',
        value: 1000,
        minOrderValue: 10000,
        maxDiscount: null,
        validFrom: '2026-01-01',
        validUntil: '2026-12-31',
        usageLimit: 1000,
        usageCount: 0,
        perUserLimit: 1,
        applicableCategories: [],
        userEligibility: 'new',
        active: true,
        description: 'Flat ₹1000 OFF on your first HG Enterprises order above ₹10000!'
    }
];

