import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MoveRight, ArrowRight, Menu } from 'lucide-react';
import { useShop } from '../../../context/ShopContext';
import { motion, AnimatePresence } from 'framer-motion';

import navGiftWomen from '../assets/nav_gift_women.png';
import navGiftGirls from '../assets/nav_gift_girls.png';
import navGiftMens from '../assets/nav_gift_mens.png';
import navGiftCouple from '../assets/nav_gift_couple.png';
import navGiftKids from '../assets/nav_gift_kids.png';

import navOccasionBirthday from '../assets/nav_occasion_birthday.png';
import navOccasionAnniversary from '../assets/nav_occasion_anniversary.png';
import navOccasionWedding from '../assets/nav_occasion_wedding.png';
import navOccasionMothers from '../assets/nav_occasion_mothers.png';
import navOccasionValentine from '../assets/nav_occasion_valentine.png';

const CategoryNav = () => {
    const [hoveredCategory, setHoveredCategory] = useState(null);
    const { toggleMenu } = useShop();

    // 1. Collections (Mega Menu)
    const collectionsItem = {
        id: 'collections',
        name: 'Collections',
        path: '/shop?section=collections',
        type: 'mega-menu',
        introTitle: "Signature Collections",
        introDesc: "Curated series of exquisite pieces, each telling a unique story of elegance and grace.",
        subcategories: [
            { id: 'bridal', name: "Bridal Heritage", path: "bridal", image: "https://images.unsplash.com/photo-1626784215021-2e39ccf971cd?auto=format&fit=crop&q=80&w=400" },
            { id: 'minimalist', name: "Daily Minimalist", path: "minimalist", image: "https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?auto=format&fit=crop&q=80&w=400" },
            { id: 'vintage', name: "Vintage Charm", path: "vintage", image: "https://images.unsplash.com/photo-1626784215021-2e39ccf971cd?auto=format&fit=crop&q=80&w=400" },
            { id: 'modern', name: "Contemporary", path: "modern", image: "https://images.unsplash.com/photo-1543294001-f7cd5d7fb516?auto=format&fit=crop&q=80&w=400" }
        ]
    };

    // 2. Gifts (Mega Menu)
    const giftsItem = {
        id: 'gifts',
        name: 'Gifts',
        path: '/shop?section=gift-guide',
        type: 'mega-menu',
        introTitle: "Gift Guide",
        introDesc: "Find the perfect token of love for the ones who matter most in your life.",
        subcategories: [
            { id: 'gift-for-her', name: "For Her", path: "for-her", image: navGiftWomen },
            { id: 'gift-for-him', name: "For Him", path: "for-him", image: navGiftMens },
            { id: 'gift-anniversary', name: "Anniversary", path: "anniversary", image: navOccasionAnniversary },
            { id: 'gift-birthday', name: "Birthday", path: "birthday", image: navOccasionBirthday },
            { id: 'gift-wedding', name: "Wedding Gift", path: "wedding", image: navOccasionWedding }
        ]
    };

    // 3. Shop By Material (Mega Menu)
    const materialItem = {
        id: 'materials',
        name: 'By Material',
        path: '/shop',
        type: 'mega-menu',
        introTitle: "Shop By Material",
        introDesc: "Our artisans work with the finest metals and stones to create masterpieces.",
        subcategories: [
            { id: 'gold', name: "22k Gold", path: "gold", image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=400" },
            { id: 'diamond', name: "Solitaire Diamond", path: "diamond", image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=400" },
            { id: 'silver', name: "925 Silver", path: "silver", image: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&q=80&w=400" },
            { id: 'platinum', name: "Platinum", path: "platinum", image: "https://images.unsplash.com/photo-1543294001-f7cd5d7fb516?auto=format&fit=crop&q=80&w=400" },
            { id: 'gemstones', name: "Gemstones", path: "gemstones", image: "https://images.unsplash.com/photo-1551028150-64b9f398f678?auto=format&fit=crop&q=80&w=400" }
        ]
    };

    // 4. Other Links
    const shopItem = { id: 'shop', name: 'Shop All', path: '/shop', type: 'link' };
    const blogsItem = { id: 'blogs', name: 'Blogs', path: '/blogs', type: 'link' };
    const aboutUsItem = { id: 'about', name: 'Our Story', path: '/about', type: 'link' };

    // Group Categories by Department for Main Nav
    const navItems = [
        { id: 'jewellery', name: 'Jewellery', path: '/shop?category=jewellery', type: 'link' },
        { id: 'tools', name: 'Tools', path: '/shop?category=tools', type: 'link' },
        { id: 'machines', name: 'Machines', path: '/shop?category=machines', type: 'link' }
    ];


    return (
        <div className="bg-[#FDF5F6] border-b border-[#EBCDD0] hidden md:block sticky top-[125px] z-40 shadow-sm font-sans">
            <div className="container mx-auto px-2">
                <ul className="flex justify-center items-center h-8 space-x-8 relative">
                    {navItems.map((item) => (
                        <li
                            key={item.id}
                            className="h-full flex items-center"
                            onMouseEnter={() => setHoveredCategory(item.id)}
                            onMouseLeave={() => setHoveredCategory(null)}
                        >
                            <Link
                                to={item.path}
                                onClick={() => setHoveredCategory(null)}
                                className={`font-serif text-xs tracking-[0.25em] font-bold italic flex items-center gap-1 transition-all duration-300 relative py-2
                                    ${hoveredCategory === item.id ? 'text-[#D39A9F]' : 'text-black'}
                                `}
                            >
                                {item.name}
                                {/* Underline Effect */}
                                <span className={`absolute bottom-0 left-0 w-full h-[2px] bg-[#D39A9F] transform transition-transform duration-300 ${hoveredCategory === item.id ? 'scale-x-100' : 'scale-x-0'}`}></span>
                            </Link>

                            {/* MEGA MENU - Unified for all 3 types */}
                            <AnimatePresence>
                                {hoveredCategory === item.id && item.type === 'mega-menu' && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute left-0 top-full w-full bg-white shadow-xl border-t border-[#EBCDD0] py-12 min-h-[400px] z-50"
                                    >
                                        <div className="container mx-auto px-8">
                                            <div className="grid grid-cols-5 gap-8">
                                                {/* Left Column: Intro */}
                                                <motion.div
                                                    initial={{ opacity: 0, x: -50 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ duration: 0.4, ease: "easeOut" }}
                                                    className="col-span-1 pr-6 border-r border-gray-100"
                                                >
                                                    <h3 className="font-display text-3xl text-black mb-4">{item.introTitle}</h3>
                                                    <p className="text-gray-500 font-serif italic mb-6 leading-relaxed">
                                                        {item.introDesc}
                                                    </p>
                                                    <Link to="/shop" onClick={() => setHoveredCategory(null)} className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-[#D39A9F] hover:text-black transition-colors group">
                                                        View All Products <MoveRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                                    </Link>
                                                </motion.div>

                                                {/* Right Grid: Subcategories */}
                                                <motion.div
                                                    initial={{ opacity: 0, x: 50 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
                                                    className="col-span-4 grid grid-cols-5 gap-x-6 gap-y-10"
                                                >
                                                    {item.subcategories.map((subCat) => (
                                                        <div key={subCat.id} className="flex flex-col items-center text-center gap-3 group">
                                                            <Link to={item.id === 'shop-by-category' ? `/category/${subCat.path}` : `/shop?filter=${subCat.path}`} onClick={() => setHoveredCategory(null)}>
                                                                <div className="w-20 h-20 rounded-full overflow-hidden border border-gray-100 shadow-sm transition-shadow group-hover:shadow-md mx-auto">
                                                                    <img src={subCat.image} alt={subCat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                                </div>
                                                            </Link>
                                                            <div className="flex flex-col items-center">
                                                                <Link to={item.id === 'shop-by-category' ? `/category/${subCat.path}` : `/shop?filter=${subCat.path}`} onClick={() => setHoveredCategory(null)}>
                                                                    <h4 className="font-display font-bold text-black text-sm group-hover:text-[#D39A9F] transition-colors">{subCat.name}</h4>
                                                                </Link>
                                                                <Link to={item.id === 'shop-by-category' ? `/category/${subCat.path}` : `/shop?filter=${subCat.path}`} onClick={() => setHoveredCategory(null)} className="text-[10px] font-bold text-[#D39A9F] uppercase tracking-wider mt-2 hover:underline opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-1 group-hover:translate-y-0">
                                                                    View Collection
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </motion.div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default CategoryNav;
