// Product Data for Discovery Experience
import catRingsRuby from '../assets/cat_rings_ruby.jpg';
import catEarringsTrad from '../assets/cat_earrings_trad.jpg';
import catNecklaceEmerald from '../assets/cat_necklaces_emerald.jpg';
import goldOfficeWearEarrings from '../assets/gold_office_wear_earrings.png';
import jewelleryMagnifier from '../assets/jewellery_magnifier.png';
import ultrasonicCleaner from '../assets/ultrasonic_jewellery_cleaner.png';

export const products = [
    {
        id: 'r1',
        name: "Midnight Emerald Solitaire",
        price: 85000,
        originalPrice: 95000,
        category: "Jewellery",
        subCategory: "Rings",
        type: "Engagement",
        metal: "Diamond",
        gender: "Women",
        image: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&q=80&w=800",
        rating: 4.8,
        isNew: true,
        weight: "4.5g"
    },
    {
        id: 'r2',
        name: "Lunar Platinum Band",
        price: 32000,
        originalPrice: 35000,
        category: "Jewellery",
        subCategory: "Rings",
        type: "Couple Bands",
        metal: "Platinum",
        gender: "Men",
        image: "https://images.unsplash.com/photo-1615655406736-b37c4fabf923?auto=format&fit=crop&q=80&w=800",
        rating: 4.7,
        weight: "6.2g"
    },
    {
        id: 'r3',
        name: "Midnight Gold Earrings",
        price: 25000,
        originalPrice: 28000,
        category: "Jewellery",
        subCategory: "Earrings",
        type: "Office Wear",
        metal: "Gold",
        gender: "Women",
        image: goldOfficeWearEarrings,
        rating: 4.9,
        isNew: true,
        weight: "3.8g"
    },
    {
        id: 'e1',
        name: "Midnight Ruby Drops",
        price: 45000,
        originalPrice: 48000,
        category: "Jewellery",
        subCategory: "Earrings",
        metal: "Diamond",
        gender: "Women",
        image: catEarringsTrad,
        rating: 4.5,
        weight: "5.4g"
    },
    {
        id: 'p1',
        name: "Lunar Diamond Pendant",
        price: 55000,
        originalPrice: 62000,
        category: "Jewellery",
        subCategory: "Pendants",
        metal: "Diamond",
        gender: "Women",
        image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800",
        rating: 4.9,
        weight: "2.5g"
    },
    {
        id: 'n1',
        name: "Grand Lunar Necklace",
        price: 135000,
        originalPrice: 150000,
        category: "Jewellery",
        subCategory: "Necklaces",
        metal: "Gold",
        gender: "Women",
        image: catNecklaceEmerald,
        rating: 5.0,
        weight: "12.8g"
    },
    {
        id: 't1',
        name: "Jewellery Magnifier Pro",
        price: 3500,
        category: "Tools",
        subCategory: "Measurement",
        metal: "Optical Grade",
        image: jewelleryMagnifier,
        rating: 4.6,
        weight: "450g"
    },
    {
        id: 'm1',
        name: "Ultrasonic Jewellery Cleaner",
        price: 12000,
        category: "Machines",
        subCategory: "Cleaning",
        metal: "Stainless Steel",
        image: ultrasonicCleaner,
        rating: 4.3,
        weight: "2500g"
    }
];

export const categories = [
    {
        id: 'jewellery',
        name: "Jewellery",
        subcategories: [
            { name: "Rings", image: catRingsRuby, path: "rings" },
            { name: "Pendants", image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=400", path: "pendants" },
            { name: "Earrings", image: catEarringsTrad, path: "earrings" },
            { name: "Necklaces", image: catNecklaceEmerald, path: "necklaces" },
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
        materials: ["Stainless Steel", "Hardened Carbon", "Optical Grade"],
        popularTypes: ["High Precision", "Industrial", "Professional"]
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
        materials: ["Ultrasonic", "Hydraulic", "Fiber Laser"],
        popularTypes: ["Automated", "High Output", "Laboratory"]
    }
];

export const banners = [
    {
        id: 1,
        image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=1600",
        title: "The Heritage Collection",
        subtitle: "Luxury Crafted with Precision"
    }
];
