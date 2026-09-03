import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Heart, ShoppingBag, User, Store, Menu, X, Bell, ChevronDown, ChevronRight, Home, Gift, Coins, Plus, Minus, MessageCircle, Phone } from 'lucide-react';
import { useShop } from '../../../context/ShopContext';
import hgLogo from '../assets/hg_logo_gold.png';
import hgLogoPremium from '../assets/logo_final.jpg';
import { motion, AnimatePresence } from 'framer-motion';
import RecentlyViewedDropdown from './RecentlyViewedDropdown';
import PopularSearchTags from './PopularSearchTags';

// Premium menu banners and fallbacks
import proposalBanner from '../assets/proposal_banner.png';
import bridalBanner from '../assets/bridal.png';
import customRings from '../assets/cat_rings_custom.png';
import latestEarrings from '../assets/latest_drop_earrings.png';
import latestNecklace from '../assets/latest_drop_necklace.png';
import latestBracelet from '../assets/latest_drop_bracelet.png';
import catNecklacesEmerald from '../assets/cat_necklaces_emerald.jpg';
import jewRingWhite from '../assets/jew_ring_white.png';
import jewEarringsWhite from '../assets/jew_earrings_white.png';
import jewNecklaceWhite from '../assets/jew_necklace_white.png';
import jewBraceletWhite from '../assets/jew_bracelet_white.png';
import jewPendantWhite from '../assets/jew_pendant_white.png';
import toolMeasurementWhite from '../assets/tool_measurement_white.png';
import machineLaserWhite from '../assets/machine_laser_white.png';

// Helper lists for premium multi-column navigation menu
const getPopularTypes = (hoveredSubCat) => {
    const cat = hoveredSubCat?.toLowerCase();
    if (cat === 'rings' || cat === 'ring') {
        return ['Engagement', 'Diamond', 'Couple Bands', 'Plain Gold', 'Office Wear', 'Gemstone', 'Solitaire', 'Cocktail', 'Slider', 'Religious', 'Multi-finger', 'Platinum Bands', 'Navaratna', 'For Men', 'Pearl', 'For Gift'];
    } else if (cat === 'earrings') {
        return ['Studs', 'Jhumkas', 'Drops', 'Hoops', 'Sui Dhaga', 'Chandbali', 'Climbers', 'Ear Cuffs'];
    } else if (cat === 'necklaces' || cat === 'necklace') {
        return ['Choker', 'Kundan', 'Lariat', 'Collar', 'Temple', 'Oxidized', 'Gold Chain', 'Diamond Necklace'];
    } else if (cat === 'pendants' || cat === 'pendant') {
        return ['Solitaire Pendants', 'Heart Pendants', 'Religious Pendants', 'Gemstone Pendants', 'Alphabet Pendants'];
    } else if (cat === 'bracelets' || cat === 'bracelet' || cat === 'bangles' || cat === 'bangle') {
        return ['Gold Bangles', 'Diamond Bracelets', 'Kada', 'Charm Bracelets', 'Tennis Bracelets'];
    } else if (cat === 'mangalsutra') {
        return ['Modern Mangalsutra', 'Traditional Mangalsutra', 'Diamond Mangalsutra', 'Gemstone Mangalsutra'];
    } else if (cat === 'hand tools' || cat === 'jewellery-tools' || cat === 'tools' || cat === 'measurement' || cat === 'cutting' || cat === 'polishing') {
        return ['High Precision', 'Industrial', 'Professional', 'Digital Calipers', 'Eye Loupes', 'Tweezers', 'Diamond Testers', 'Micro Soldering', 'Hand Engravers', 'Cast Iron Vices', 'Pliers Set', 'Precision Files', 'Jewelry Hammers', 'Bench Pins'];
    } else if (cat === 'laser machines' || cat === 'laser-machines' || cat === 'machines' || cat === 'cleaning' || cat === 'casting' || cat === 'laser') {
        return ['Automated Systems', 'High Output', 'Laboratory Grade', 'Pulse Laser', 'Fiber Laser', 'Vacuum Casting', 'Micro Arc Welder', 'Magnetic Polishers', 'Steam Cleaners', 'Gold Refining Systems'];
    }
    return ['All Collections', 'Best Sellers', 'New Launches'];
};

const getPriceRanges = (hoveredSubCat) => {
    const cat = hoveredSubCat?.toLowerCase();
    if (cat === 'rings' || cat === 'ring' || cat === 'earrings' || cat === 'necklaces' || cat === 'necklace' || cat === 'pendants' || cat === 'pendant' || cat === 'bracelets' || cat === 'bracelet' || cat === 'mangalsutra') {
        return [
            { label: 'Below 10,000', min: 0, max: 10000 },
            { label: 'Between 10k - 20k', min: 10000, max: 20000 },
            { label: 'Between 20k - 30k', min: 20000, max: 30000 },
            { label: 'Between 30k - 40k', min: 30000, max: 40000 },
            { label: 'Between 40k - 50k', min: 40000, max: 50000 },
            { label: '50,000 & above', min: 50000, max: 1000000 }
        ];
    } else if (cat === 'hand tools' || cat === 'jewellery-tools' || cat === 'tools' || cat === 'measurement' || cat === 'cutting' || cat === 'polishing') {
        return [
            { label: 'Below 1,000', min: 0, max: 1000 },
            { label: 'Between 1k - 5k', min: 1000, max: 5000 },
            { label: 'Between 5k - 10k', min: 5000, max: 10000 },
            { label: 'Between 10k - 25k', min: 10000, max: 25000 },
            { label: '25,000 & above', min: 25000, max: 500000 }
        ];
    } else {
        return [
            { label: 'Below 15,000', min: 0, max: 15000 },
            { label: 'Between 15k - 50k', min: 15000, max: 50000 },
            { label: 'Between 50k - 1.5 Lakh', min: 50000, max: 150000 },
            { label: '1.5 Lakh & above', min: 150000, max: 5000000 }
        ];
    }
};

const getMetalsAndStones = (hoveredSubCat) => {
    const cat = hoveredSubCat?.toLowerCase();
    if (cat === 'rings' || cat === 'ring' || cat === 'earrings' || cat === 'necklaces' || cat === 'necklace' || cat === 'pendants' || cat === 'pendant' || cat === 'bracelets' || cat === 'bracelet' || cat === 'mangalsutra') {
        if (cat === 'rings' || cat === 'ring') {
            return [
                { label: 'Diamond Rings', metal: 'Diamond', starting: 'Rs. 7,400/-' },
                { label: 'Gold Rings', metal: 'Gold', starting: 'Rs. 6,300/-' },
                { label: 'White Gold Rings', metal: 'White Gold', starting: 'Rs. 8,900/-' },
                { label: 'Rose Gold Rings', metal: 'Rose Gold', starting: 'Rs. 10,000/-' },
                { label: 'Platinum Rings', metal: 'Platinum', starting: 'Rs. 23,200/-' },
                { label: 'Buy Solitaire Rings', metal: 'Solitaire', starting: 'Rs. 30,000/-' }
            ];
        } else if (cat === 'necklaces' || cat === 'necklace') {
            return [
                { label: 'Diamond Necklaces', metal: 'Diamond', starting: 'Rs. 45,000/-' },
                { label: 'Gold Necklaces', metal: 'Gold', starting: 'Rs. 25,000/-' },
                { label: 'Kundan Choker Sets', metal: 'Kundan', starting: 'Rs. 55,000/-' },
                { label: 'Platinum Necklaces', metal: 'Platinum', starting: 'Rs. 65,000/-' }
            ];
        }
        return [
            { label: 'Diamond Creations', metal: 'Diamond', starting: 'Rs. 12,000/-' },
            { label: 'Gold Classics', metal: 'Gold', starting: 'Rs. 6,300/-' },
            { label: 'White Gold Masterpieces', metal: 'White Gold', starting: 'Rs. 8,900/-' },
            { label: 'Rose Gold Charms', metal: 'Rose Gold', starting: 'Rs. 10,000/-' },
            { label: 'Platinum Collection', metal: 'Platinum', starting: 'Rs. 23,200/-' },
            { label: 'Buy Solitaire Specials', metal: 'Solitaire', starting: 'Rs. 30,000/-' }
        ];
    } else if (cat === 'hand tools' || cat === 'jewellery-tools' || cat === 'tools' || cat === 'measurement' || cat === 'cutting' || cat === 'polishing') {
        return [
            { label: 'Stainless Steel Tools', metal: 'Stainless Steel', starting: 'Rs. 950/-' },
            { label: 'Hardened Carbon Steel', metal: 'Hardened Carbon', starting: 'Rs. 1,500/-' },
            { label: 'Optical Grade Loupes', metal: 'Optical Grade', starting: 'Rs. 2,200/-' },
            { label: 'Tungsten Carbide Cutters', metal: 'Tungsten Carbide', starting: 'Rs. 3,500/-' }
        ];
    } else {
        return [
            { label: 'Ultrasonic Cleaners', metal: 'Ultrasonic', starting: 'Rs. 12,000/-' },
            { label: 'Hydraulic Casting Presses', metal: 'Hydraulic', starting: 'Rs. 85,000/-' },
            { label: 'Fiber Laser engravers', metal: 'Fiber Laser', starting: 'Rs. 1,50,000/-' },
            { label: 'Induction Casting Units', metal: 'Induction', starting: 'Rs. 95,000/-' }
        ];
    }
};

const getCollectionImage = (hoveredSubCat) => {
    const cat = hoveredSubCat?.toLowerCase();
    if (cat === 'rings' || cat === 'ring') return jewRingWhite;
    if (cat === 'earrings') return jewEarringsWhite;
    if (cat === 'necklaces' || cat === 'necklace') return jewNecklaceWhite;
    if (cat === 'pendants' || cat === 'pendant') return jewPendantWhite;
    if (cat === 'bracelets' || cat === 'bracelet') return jewBraceletWhite;
    if (cat === 'hand tools' || cat === 'jewellery-tools' || cat === 'tools' || cat === 'measurement' || cat === 'cutting' || cat === 'polishing') {
        return toolMeasurementWhite;
    }
    if (cat === 'laser machines' || cat === 'laser-machines' || cat === 'machines' || cat === 'cleaning' || cat === 'casting' || cat === 'laser') {
        return machineLaserWhite;
    }
    return jewRingWhite;
};

const getCollectionTitle = (hoveredSubCat) => {
    const cat = hoveredSubCat?.toLowerCase();
    if (cat === 'rings' || cat === 'ring') return 'Liviana - Stacks of Love';
    if (cat === 'earrings') return 'Daily Glam - Delicate Studs';
    if (cat === 'necklaces' || cat === 'necklace') return 'Emerald Heritage - Royal Sets';
    if (cat === 'bracelets' || cat === 'bracelet') return 'Modern Wrists - Elegant Kadas';
    if (cat === 'hand tools' || cat === 'jewellery-tools' || cat === 'tools' || cat === 'measurement' || cat === 'cutting' || cat === 'polishing') {
        return 'HG Precision Tools - Handcrafted';
    }
    if (cat === 'laser machines' || cat === 'laser-machines' || cat === 'machines' || cat === 'cleaning' || cat === 'casting' || cat === 'laser') {
        return 'Smart Wax Printer - Next-Gen';
    }
    return 'Bridal Heritage - Complete Sets';
};

const getMegaMenuDepartment = (activeMegaCategory) => {
    const dept = (activeMegaCategory?.department || 'Jewellery').toLowerCase();
    if (dept === 'machines' || dept === 'machine') return 'machines';
    if (dept === 'tools' || dept === 'tool') return 'tools';
    return 'jewellery';
};

const Navbar = () => {
    const { cart, wishlist, user, userNotifications, isMenuOpen, toggleMenu, isSearchOpen, toggleSearch, categories, settings, products } = useShop();
    const location = useLocation();
    const navigate = useNavigate();
    const isHome = location.pathname === '/';

    // Lock body scroll when menu is open
    useEffect(() => {
        if (isMenuOpen) {
            const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
            document.body.style.overflow = 'hidden';
            document.body.style.paddingRight = `${scrollBarWidth}px`;
            document.body.style.height = '100vh';
            
            // Prevent touch scroll on body for mobile
            const preventDefault = (e) => e.preventDefault();
            document.addEventListener('touchmove', preventDefault, { passive: false });
            
            return () => {
                document.body.style.overflow = 'unset';
                document.body.style.paddingRight = '0px';
                document.body.style.height = 'auto';
                document.removeEventListener('touchmove', preventDefault);
            };
        }
    }, [isMenuOpen]);

    // Sidebar Menu Data
    const sidebarMenu = {
        mainCategories: [
            { name: "Jewellery", path: "/shop?category=Jewellery" },
            { name: "Machines", path: "/shop?category=Machines" },
            { name: "Tools", path: "/shop?category=Tools" },
            { name: "Shop All", path: "/shop" }
        ],
        support: (settings?.navbarLinks && settings.navbarLinks.length > 0) ? settings.navbarLinks : [
            { name: "Offers", path: "/offers" },
            { name: "Track Order", path: "/profile/orders" },
            { name: "About Us", path: "/about" },
            { name: "Contact Us", path: "/help" },
            { name: "Blog", path: "/blogs" }
        ]
    };

    const [openSection, setOpenSection] = useState('mainCategories');
    const [activeMegaCategory, setActiveMegaCategory] = useState(categories[0]);
    const [hoveredSubCat, setHoveredSubCat] = useState('Rings');
    const [isMegaOpen, setIsMegaOpen] = useState(false);
    const [isCoinsOpen, setIsCoinsOpen] = useState(false);
    const [isGiftsOpen, setIsGiftsOpen] = useState(false);
    const [activeSidebarDept, setActiveSidebarDept] = useState(null);

    // Sync activeMegaCategory when categories load from the API
    useEffect(() => {
        if (categories.length > 0 && !activeMegaCategory) {
            setActiveMegaCategory(categories[0]);
        }
    }, [categories]);

    // Sync activeMegaCategory when categories load from the API
    useEffect(() => {
        if (categories.length > 0 && !activeMegaCategory) {
            setActiveMegaCategory(categories[0]);
        }
    }, [categories]);

    const toggleSection = (section) => {
        setOpenSection(openSection === section ? null : section);
    };

    return (
        <>
            <div className="w-full bg-white z-[100] relative" data-site-header>
                {/* 1. Top Utility Header - Even more compact */}
                <div className="hidden md:block bg-gray-50/50 border-b border-gray-100 py-0.5">
                    <div className="container mx-auto px-6 flex justify-between items-center text-[10px] font-normal text-gray-400 uppercase tracking-widest">
                        <div className="flex items-center gap-6">
                            <Link to="/help" className="flex items-center gap-1.5 hover:text-primary cursor-pointer transition-colors">
                                <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                                Easy Returns & Refunds
                            </Link>
                        </div>
                        <div className="flex items-center gap-6 divide-x divide-gray-200">
                            <Link to="/profile" className="flex items-center gap-1.5 hover:text-primary cursor-pointer transition-colors px-4 group">
                                <Bell className="w-3 h-3 group-hover:scale-110 transition-transform" />
                                <span>Notifications</span>
                            </Link>
                            <Link to="/about" className="flex items-center gap-1.5 hover:text-primary cursor-pointer transition-colors px-4 group">
                                <Store className="w-3 h-3 group-hover:scale-110 transition-transform" />
                                <span>Find A Store</span>
                            </Link>
                            <div className="flex items-center gap-4 pl-4 lowercase">
                                <Link to="/login" className="hover:text-primary transition-colors hover:underline">Login</Link>
                                <span className="text-gray-200">|</span>
                                <Link to="/signup" className="hover:text-primary transition-colors hover:underline">Signup</Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Main Navigation Bar - Balanced Compactness */}
                <nav className="w-full bg-black border-b border-white/10 shadow-sm sticky top-0 md:relative z-50">
                    <div className="w-full flex items-center justify-between h-7 md:h-9 px-3 md:px-6">

                        {/* Logo & Brand Heading */}
                        <div className="flex items-center gap-2 md:gap-3">
                            <Link to="/" className="flex items-center group flex-shrink-0 gap-2 md:gap-3">
                                <motion.div
                                    animate={{
                                        y: [0, -1, 0],
                                    }}
                                    transition={{
                                        duration: 4,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                    className="relative bg-black"
                                >
                                    <img
                                        src={hgLogoPremium}
                                        alt="HG"
                                        className="h-[20px] md:h-[30px] w-auto object-contain"
                                    />
                                </motion.div>

                                <div className="flex flex-col font-serif">
                                    <span className="text-white text-[10px] md:text-[14px] font-medium tracking-wider leading-none group-hover:text-[#EBCDD0] transition-colors">
                                        Harshad Gauri
                                    </span>
                                    <span className="text-[#FDF5F6]/80 italic text-[7px] md:text-[8px] tracking-normal pb-0 transition-colors group-hover:text-white lowercase">
                                        enterprises
                                    </span>
                                </div>
                            </Link>
                        </div>

                        {/* Centered Search Bar */}
                        <div className="hidden lg:flex flex-1 max-w-2xl mx-6 items-center justify-center">
                            <div className="flex w-full max-w-xl h-[28px] md:h-[30px]">
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="w-full h-full bg-white border-none px-4 text-[11px] focus:outline-none text-black placeholder-gray-500 rounded-l-[4px]"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            window.location.href = `/shop?search=${e.target.value}`;
                                        }
                                    }}
                                />
                                <button 
                                    aria-label="Search" 
                                    className="bg-[#C9A24D] hover:bg-[#b89445] px-5 h-full flex items-center justify-center transition-colors rounded-r-[4px]"
                                    onClick={() => {
                                        const input = document.querySelector('input[placeholder="Search..."]');
                                        if (input && input.value) {
                                            window.location.href = `/shop?search=${input.value}`;
                                        }
                                    }}
                                >
                                    <Search className="h-3.5 w-3.5 text-black" />
                                </button>
                            </div>
                        </div>

                        {/* Icons */}
                        <div className="flex items-center gap-1 md:gap-4">
                            {/* Mobile/Tablet Search Toggle */}
                            <button
                                onClick={() => toggleSearch(!isSearchOpen)}
                                aria-label="Toggle search"
                                className="lg:hidden w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 group transition-colors"
                            >
                                <Search className={`w-5 h-5 transition-colors ${isSearchOpen ? 'text-white' : 'text-white/90 group-hover:text-[#EBCDD0]'}`} />
                            </button>

                            <RecentlyViewedDropdown />

                            <Link to="/notifications" aria-label="View notifications" className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-full hover:bg-white/10 relative group transition-colors">
                                <Bell className="w-4.5 h-4.5 md:w-5 md:h-5 text-white/90 group-hover:text-[#EBCDD0] transition-colors" />
                                <span className="absolute top-2 right-2 w-1.5 h-1.5 md:w-2 md:h-2 bg-primary rounded-full border-2 border-black"></span>
                            </Link>

                            <Link to="/stores" aria-label="Find a store" className="flex w-9 h-9 md:w-10 md:h-10 items-center justify-center rounded-full hover:bg-white/10 group transition-colors">
                                <Store className="w-4.5 h-4.5 md:w-5 md:h-5 text-white/90 group-hover:text-[#EBCDD0] transition-colors" />
                            </Link>

                            <Link to="/wishlist" aria-label="View wishlist" className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-full hover:bg-white/10 relative group transition-colors">
                                <Heart className="w-4.5 h-4.5 md:w-5 md:h-5 text-white/90 group-hover:text-[#EBCDD0] transition-colors" />
                                {wishlist?.length > 0 && (
                                    <span className="absolute top-2 right-2 bg-primary text-white text-[7px] md:text-[8px] w-3 h-3 md:w-3.5 md:h-3.5 flex items-center justify-center rounded-full font-bold">
                                        {wishlist.length}
                                    </span>
                                )}
                            </Link>

                            <Link to="/cart" aria-label="View shopping bag" className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center hover:bg-white/10 rounded-full group transition-colors relative">
                                <ShoppingBag className="w-4.5 h-4.5 md:w-5 md:h-5 text-white/90 group-hover:text-[#EBCDD0] transition-colors" />
                                {cart?.length > 0 && (
                                    <span className="absolute top-2 right-2 bg-primary text-white text-[7px] md:text-[8px] w-3 h-3 md:w-3.5 md:h-3.5 flex items-center justify-center rounded-full font-bold">
                                        {cart.length}
                                    </span>
                                )}
                            </Link>

                            <Link to="/profile" aria-label="View profile" className="hidden md:flex w-10 h-10 items-center justify-center rounded-full hover:bg-white/10 group transition-colors">
                                <User className="w-5 h-5 text-white/90 group-hover:text-[#EBCDD0] transition-colors" />
                            </Link>

                            {/* Top Hamburger Menu (Mobile) - Moved to Right */}
                            <button
                                onClick={() => toggleMenu(!isMenuOpen)}
                                aria-label="Toggle menu"
                                className="md:hidden w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 group transition-colors"
                            >
                                <Menu className="w-5 h-5 text-white group-hover:text-[#EBCDD0] transition-colors" />
                            </button>
                        </div>
                    </div>

                    {/* Mobile Search Bar Expansion */}
                    <AnimatePresence>
                        {isSearchOpen && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                                className="lg:hidden bg-[#1A1A1A] border-t border-white/5 overflow-hidden"
                            >
                                <div className="px-6 py-4">
                                    <div className="relative group/search">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Search className="h-4 w-4 text-gray-500 group-focus-within/search:text-primary transition-colors" />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="What are you looking for?"
                                            className="w-full bg-white/5 border border-white/10 rounded-full py-3 px-6 pl-12 text-sm focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary/40 transition-all text-white placeholder-gray-500"
                                            autoFocus
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    toggleSearch(false);
                                                    // Navigate to shop with search
                                                    window.location.href = `/shop?search=${e.target.value}`;
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* 3. Secondary Navigation Links Row - Ultra Compact & Clean */}
                    <div className="hidden md:block bg-white border-t border-gray-100 py-0.5 shadow-sm relative">
                        <div className="container mx-auto px-6 flex justify-center items-center gap-8 font-sans">
                            <Link to="/" className="text-[11px] font-normal uppercase text-black hover:text-primary transition-all tracking-normal border-b-2 border-transparent hover:border-primary pb-0.5">
                                Home
                            </Link>

                            {/* Categories Interaction - Two-Step Mega Menu */}
                            <div
                                onMouseEnter={() => setIsMegaOpen(true)}
                                onMouseLeave={() => setIsMegaOpen(false)}
                            >
                                <button
                                    aria-label="Open categories menu"
                                    onClick={() => setIsMegaOpen(!isMegaOpen)}
                                    className="flex items-center gap-1 text-[11px] font-normal uppercase text-black hover:text-primary transition-all tracking-normal border-b-2 border-transparent hover:border-primary pb-0.5 cursor-pointer"
                                >
                                    Categories
                                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isMegaOpen ? 'rotate-180' : ''}`} />
                                </button>

                                <div className={`absolute left-0 w-full top-full transition-all duration-500 z-[100] bg-gradient-to-r from-[#FFF5F6] via-[#FFF9FA] to-[#FFF0F3] border-b border-pink-100 shadow-2xl ${isMegaOpen ? 'opacity-100 visible' : 'opacity-0 invisible'} font-mulish`}>
                                    <div className="flex flex-col min-h-[260px] w-full">

                                        {/* Step 1: Main Category Selection Bar - Grouped by Department */}
                                        <div className="bg-pink-100/20 border-b border-pink-100/40 px-10 py-2.5 flex justify-center gap-16 font-mulish">
                                            {['Jewellery', 'Tools', 'Machines'].map((dept) => (
                                                <button
                                                    key={dept}
                                                    onMouseEnter={() => {
                                                        const firstInDept = categories.find(c => (c.department || 'Jewellery').toLowerCase() === dept.toLowerCase());
                                                        if (firstInDept) {
                                                            setActiveMegaCategory(firstInDept);
                                                            setHoveredSubCat(firstInDept.name);
                                                        }
                                                    }}
                                                    aria-label={`View ${dept} department`}
                                                    className={`text-[11px] font-mulish font-bold tracking-[0.25em] uppercase transition-all pb-1 border-b-2 ${(activeMegaCategory?.department || 'Jewellery').toLowerCase() === dept.toLowerCase() ? 'text-primary border-primary' : 'text-gray-400 border-transparent hover:text-black'}`}
                                                >
                                                    {dept}
                                                </button>
                                            ))}
                                        </div>

                                        <div className="flex-1 w-full mx-auto bg-transparent">
                                            <AnimatePresence mode="popLayout">
                                                <motion.div
                                                    key={activeMegaCategory?.id || activeMegaCategory?._id}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                    className="w-full"
                                                >
                                                     <div className="flex w-full bg-transparent min-h-[350px] p-6 text-black font-mulish">
                                                         {/* Left Sub-Sidebar: main categories with micro-indicators */}
                                                         <div className="w-[20%] border-r border-pink-100/60 pr-6 flex flex-col gap-2">
                                                             <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-2">Category Selection</h3>
                                                             {categories
                                                                 .filter(c => (c.department || 'Jewellery').toLowerCase() === (activeMegaCategory?.department || 'Jewellery').toLowerCase())
                                                                 .map((cat) => (
                                                                     <button
                                                                         key={cat.id || cat._id}
                                                                         onMouseEnter={() => setHoveredSubCat(cat.name)}
                                                                         onClick={() => {
                                                                             setIsMegaOpen(false);
                                                                             navigate(`/collection/${cat.id || cat.name.toLowerCase()}`);
                                                                         }}
                                                                         className={`w-full text-left px-3 py-2.5 rounded-lg transition-all duration-300 flex items-center justify-between text-xs font-mulish font-bold tracking-wider ${hoveredSubCat?.toLowerCase() === cat.name?.toLowerCase() ? 'bg-pink-100/50 text-primary pl-4' : 'text-gray-700 hover:bg-pink-50/30'}`}
                                                                     >
                                                                         <span className="uppercase">{cat.name}</span>
                                                                         <ChevronRight className={`w-3.5 h-3.5 transition-transform ${hoveredSubCat?.toLowerCase() === cat.name?.toLowerCase() ? 'translate-x-0.5 text-primary' : 'text-gray-300'}`} />
                                                                     </button>
                                                                 ))
                                                             }
                                                         </div>

                                                         {/* Right Columns: Multi-Column layout based on hovered subcategory */}
                                                         <div className="flex-1 pl-8">
                                                             <AnimatePresence mode="wait">
                                                                 <motion.div
                                                                     key={hoveredSubCat}
                                                                     initial={{ opacity: 0, y: 5 }}
                                                                     animate={{ opacity: 1, y: 0 }}
                                                                     exit={{ opacity: 0, y: -5 }}
                                                                     transition={{ duration: 0.2 }}
                                                                     className="grid grid-cols-4 gap-8 h-full"
                                                                 >
                                                                     {/* Column 1: Popular Types */}
                                                                     <div>
                                                                         <h4 className="text-[10px] font-mulish font-black uppercase tracking-[0.15em] text-primary mb-3 pb-1.5 border-b border-pink-100">
                                                                             Popular {hoveredSubCat} Types
                                                                         </h4>
                                                                         <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                                                                             {getPopularTypes(hoveredSubCat).map((type, idx) => (
                                                                                 <Link
                                                                                     key={idx}
                                                                                     to={`/shop?category=${hoveredSubCat}&subcategory=${type}`}
                                                                                     onClick={() => setIsMegaOpen(false)}
                                                                                     className="text-[10.5px] text-gray-600 hover:text-primary hover:underline transition-colors leading-normal"
                                                                                 >
                                                                                     {type}
                                                                                 </Link>
                                                                             ))}
                                                                         </div>
                                                                         {hoveredSubCat?.toLowerCase() === 'rings' && (
                                                                             <div className="mt-4">
                                                                                 <Link
                                                                                     to="/shop?category=RINGS"
                                                                                     onClick={() => setIsMegaOpen(false)}
                                                                                     className="inline-block border border-black text-black hover:bg-black hover:text-white px-3 py-1.5 font-mulish text-[9px] font-bold uppercase tracking-wider transition-all"
                                                                                 >
                                                                                     VIEW ALL {products?.filter(p => p.category?.toLowerCase() === 'rings').length || '2303'} RING DESIGNS
                                                                                 </Link>
                                                                             </div>
                                                                         )}
                                                                         {(hoveredSubCat?.toLowerCase() === 'hand tools' || hoveredSubCat?.toLowerCase() === 'jewellery-tools' || hoveredSubCat?.toLowerCase() === 'tools') && (
                                                                             <div className="mt-4">
                                                                                 <Link
                                                                                     to="/shop?category=Tools"
                                                                                     onClick={() => setIsMegaOpen(false)}
                                                                                     className="inline-block border border-black text-black hover:bg-black hover:text-white px-3 py-1.5 font-mulish text-[9px] font-bold uppercase tracking-wider transition-all"
                                                                                 >
                                                                                     VIEW ALL PRECISION TOOLS
                                                                                 </Link>
                                                                             </div>
                                                                         )}
                                                                         {(hoveredSubCat?.toLowerCase() === 'laser machines' || hoveredSubCat?.toLowerCase() === 'laser-machines' || hoveredSubCat?.toLowerCase() === 'machines') && (
                                                                             <div className="mt-4">
                                                                                 <Link
                                                                                     to="/shop?category=Machines"
                                                                                     onClick={() => setIsMegaOpen(false)}
                                                                                     className="inline-block border border-black text-black hover:bg-black hover:text-white px-3 py-1.5 font-mulish text-[9px] font-bold uppercase tracking-wider transition-all"
                                                                                 >
                                                                                     VIEW ALL SMART MACHINES
                                                                                 </Link>
                                                                             </div>
                                                                         )}
                                                                     </div>

                                                                     {/* Column 2: Price Range */}
                                                                     <div>
                                                                         <h4 className="text-[10px] font-mulish font-black uppercase tracking-[0.15em] text-primary mb-3 pb-1.5 border-b border-pink-100">
                                                                             By Price Range
                                                                         </h4>
                                                                         <div className="flex flex-col gap-2">
                                                                             {getPriceRanges(hoveredSubCat).map((range, idx) => (
                                                                                 <Link
                                                                                     key={idx}
                                                                                     to={`/shop?category=${hoveredSubCat}&minPrice=${range.min}&maxPrice=${range.max}`}
                                                                                     onClick={() => setIsMegaOpen(false)}
                                                                                     className="text-[10.5px] text-gray-600 hover:text-primary hover:underline transition-colors leading-normal"
                                                                                 >
                                                                                     {range.label}
                                                                                 </Link>
                                                                             ))}
                                                                         </div>
                                                                     </div>

                                                                     {/* Column 3: Metals & Stones / Materials & Tech */}
                                                                     <div>
                                                                         <h4 className="text-[10px] font-mulish font-black uppercase tracking-[0.15em] text-primary mb-3 pb-1.5 border-b border-pink-100">
                                                                             By Build & Tech
                                                                         </h4>
                                                                         <div className="flex flex-col gap-2.5">
                                                                             {getMetalsAndStones(hoveredSubCat).map((item, idx) => (
                                                                                 <Link
                                                                                     key={idx}
                                                                                     to={`/shop?category=${hoveredSubCat}&metal=${item.metal}`}
                                                                                     onClick={() => setIsMegaOpen(false)}
                                                                                     className="group flex flex-col gap-0.5"
                                                                                 >
                                                                                     <span className="text-[10.5px] font-semibold text-gray-800 group-hover:text-primary transition-colors font-bold">
                                                                                         {item.label}
                                                                                     </span>
                                                                                     {item.starting && (
                                                                                         <span className="text-[8.5px] text-gray-400 group-hover:text-primary/70 italic transition-colors">
                                                                                             Starting at {item.starting}
                                                                                         </span>
                                                                                     )}
                                                                                 </Link>
                                                                             ))}
                                                                         </div>
                                                                     </div>

                                                                     {/* Column 4: Browse Collections */}
                                                                     <div className="flex flex-col justify-between">
                                                                         <div>
                                                                             <div className="flex justify-between items-center mb-3 pb-1.5 border-b border-pink-100">
                                                                                 <h4 className="text-[10px] font-mulish font-black uppercase tracking-[0.15em] text-primary">
                                                                                     Browse Collections
                                                                                 </h4>
                                                                                 <Link
                                                                                     to={`/shop?category=${hoveredSubCat}`}
                                                                                     onClick={() => setIsMegaOpen(false)}
                                                                                     className="text-[8.5px] font-bold text-primary hover:underline uppercase tracking-wider"
                                                                                 >
                                                                                     View All &gt;&gt;
                                                                                 </Link>
                                                                             </div>
                                                                             <div className="relative aspect-[1.8] rounded-lg overflow-hidden shadow-md group/banner border border-pink-100">
                                                                                 <img
                                                                                     src={getCollectionImage(hoveredSubCat)}
                                                                                     alt="Collection Banner"
                                                                                     className="w-full h-full object-cover transform transition-transform duration-700 group-hover/banner:scale-110"
                                                                                     crossOrigin="anonymous"
                                                                                 />
                                                                                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-3">
                                                                                     <span className="text-[8px] font-bold text-primary tracking-widest uppercase mb-0.5">Featured Edit</span>
                                                                                     <h5 className="text-white font-mulish italic text-sm leading-tight font-medium">
                                                                                         {getCollectionTitle(hoveredSubCat)}
                                                                                     </h5>
                                                                                 </div>
                                                                             </div>
                                                                         </div>
                                                                     </div>
                                                                 </motion.div>
                                                             </AnimatePresence>
                                                         </div>
                                                     </div>
                                                </motion.div>
                                            </AnimatePresence>
                                        </div>

                                        {/* Explore guide — popular tags + explore links */}
                                        <PopularSearchTags
                                            variant="mega"
                                            department={getMegaMenuDepartment(activeMegaCategory)}
                                            subCategory={hoveredSubCat}
                                            onLinkClick={() => setIsMegaOpen(false)}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Gold Coins Link with Dropdown */}
                            <div
                                onMouseEnter={() => setIsCoinsOpen(true)}
                                onMouseLeave={() => setIsCoinsOpen(false)}
                                className="relative"
                            >
                                <Link
                                    to="/shop?tag=coin"
                                    className="text-[11px] font-normal uppercase text-black hover:text-primary transition-all tracking-normal border-b-2 border-transparent hover:border-primary pb-0.5 flex items-center gap-1 cursor-pointer"
                                >
                                    Gold Coins
                                    <ChevronDown className={`w-3 h-3 transition-transform ${isCoinsOpen ? 'rotate-180' : ''}`} />
                                </Link>

                                <AnimatePresence>
                                    {isCoinsOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute left-1/2 -translate-x-1/2 top-full mt-1 w-[280px] bg-gradient-to-r from-[#FFF5F6] via-[#FFF9FA] to-[#FFF0F3] border border-pink-100 shadow-2xl rounded-xl overflow-hidden z-[110] p-5 grid grid-cols-2 gap-6 text-left"
                                        >
                                            {/* Column 1: 24 Kt */}
                                            <div>
                                                <h4 className="text-[10px] font-mulish font-black uppercase tracking-[0.2em] text-primary mb-3 pb-1 border-b border-pink-100">
                                                    24 Kt (995)
                                                </h4>
                                                <div className="flex flex-col gap-2">
                                                    {['0.5 gram', '1 gram', '2 gram', '5 gram', '10 gram', '20 gram', '50 gram'].map((weight) => (
                                                        <Link
                                                            key={weight}
                                                            to={`/shop?tag=coin&weight=${weight.replace(' gram', 'g')}`}
                                                            onClick={() => setIsCoinsOpen(false)}
                                                            className="text-[10.5px] text-gray-600 hover:text-primary transition-all font-medium font-mulish"
                                                        >
                                                            {weight}
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Column 2: 22 Kt */}
                                            <div>
                                                <h4 className="text-[10px] font-mulish font-black uppercase tracking-[0.2em] text-primary mb-3 pb-1 border-b border-pink-100">
                                                    22 Kt (916)
                                                </h4>
                                                <div className="flex flex-col gap-2">
                                                    {['1 gram', '2 gram', '5 gram', '10 gram', '20 gram', '50 gram'].map((weight) => (
                                                        <Link
                                                            key={weight}
                                                            to={`/shop?tag=coin&weight=${weight.replace(' gram', 'g')}`}
                                                            onClick={() => setIsCoinsOpen(false)}
                                                            className="text-[10.5px] text-gray-600 hover:text-primary transition-all font-medium font-mulish"
                                                        >
                                                            {weight}
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Gifts Link with Dropdown */}
                            <div
                                onMouseEnter={() => setIsGiftsOpen(true)}
                                onMouseLeave={() => setIsGiftsOpen(false)}
                                className="relative"
                            >
                                <Link
                                    to="/shop?tag=gift"
                                    className="text-[11px] font-normal uppercase text-black hover:text-[#3E2723] transition-all tracking-normal border-b-2 border-transparent hover:border-[#3E2723] pb-0.5 flex items-center gap-1 cursor-pointer"
                                >
                                    Gifts
                                    <ChevronDown className={`w-3 h-3 transition-transform ${isGiftsOpen ? 'rotate-180' : ''}`} />
                                </Link>

                                <AnimatePresence>
                                    {isGiftsOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute left-1/2 -translate-x-[40%] top-full mt-1 w-[800px] bg-gradient-to-r from-[#FFF5F6] via-[#FFF9FA] to-[#FFF0F3] border border-pink-100 shadow-2xl rounded-2xl p-6 z-[110] grid grid-cols-4 gap-6 text-left"
                                        >
                                            {/* Column 1: Gifts By Occasion */}
                                            <div>
                                                <h4 className="text-[10px] font-mulish font-black uppercase tracking-[0.2em] text-[#3E2723] mb-4 pb-1.5 border-b border-pink-100 font-bold">
                                                    Gifts By Occasion
                                                </h4>
                                                <div className="flex flex-col gap-2.5">
                                                    {['Anniversary', 'Birthday', 'Engagement', 'Wedding'].map((occ) => (
                                                        <Link
                                                            key={occ}
                                                            to={`/shop?tag=gift&subcategory=${occ}`}
                                                            onClick={() => setIsGiftsOpen(false)}
                                                            className="text-[10.5px] text-gray-600 hover:text-[#3E2723] transition-all font-medium font-mulish"
                                                        >
                                                            {occ}
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Column 2: By Price Range */}
                                            <div>
                                                <h4 className="text-[10px] font-mulish font-black uppercase tracking-[0.2em] text-[#3E2723] mb-4 pb-1.5 border-b border-pink-100 font-bold">
                                                    By Price Range
                                                </h4>
                                                <div className="flex flex-col gap-2.5">
                                                    {[
                                                        { label: 'Below 10,000', min: 0, max: 10000 },
                                                        { label: 'Between 10k-20k', min: 10000, max: 20000 },
                                                        { label: 'Between 20k-30k', min: 20000, max: 30000 },
                                                        { label: 'Between 30k-40k', min: 30000, max: 40000 },
                                                        { label: 'Between 40k-50k', min: 40000, max: 50000 },
                                                        { label: '50,000 and above', min: 50000, max: 500000 }
                                                    ].map((range) => (
                                                        <Link
                                                            key={range.label}
                                                            to={`/shop?tag=gift&minPrice=${range.min}&maxPrice=${range.max}`}
                                                            onClick={() => setIsGiftsOpen(false)}
                                                            className="text-[10.5px] text-gray-600 hover:text-[#3E2723] transition-all font-medium font-mulish"
                                                        >
                                                            {range.label}
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Column 3: Gifts For Special Someone */}
                                            <div>
                                                <h4 className="text-[10px] font-mulish font-black uppercase tracking-[0.2em] text-[#3E2723] mb-4 pb-1.5 border-b border-pink-100 font-bold">
                                                    Gifts For Someone
                                                </h4>
                                                <div className="flex flex-col gap-2.5">
                                                    {[
                                                        { label: 'For HER', price: 'Rs. 2,861/-', tag: 'women' },
                                                        { label: 'For HIM', price: 'Rs. 5,820/-', tag: 'men' },
                                                        { label: 'For SISTER', price: 'Rs. 5,746/-', tag: 'sister' },
                                                        { label: 'For BROTHER', price: 'Rs. 5,820/-', tag: 'brother' },
                                                        { label: 'For MOTHER', price: 'Rs. 5,805/-', tag: 'mother' },
                                                        { label: 'For FATHER', price: 'Rs. 5,820/-', tag: 'father' },
                                                        { label: 'For FRIENDS', price: 'Rs. 4,221/-', tag: 'friends' }
                                                    ].map((someone) => (
                                                        <Link
                                                            key={someone.label}
                                                            to={`/shop?tag=${someone.tag}`}
                                                            onClick={() => setIsGiftsOpen(false)}
                                                            className="group flex flex-col gap-0.5"
                                                        >
                                                            <span className="text-[10.5px] text-gray-800 font-bold font-mulish group-hover:text-[#3E2723] transition-all">
                                                                {someone.label}
                                                            </span>
                                                            <span className="text-[9px] text-gray-400 group-hover:text-[#3E2723]/70 italic transition-all">
                                                                Starting at {someone.price}
                                                            </span>
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Column 4: Elegant Gift Card Promotion */}
                                            <div className="flex flex-col justify-between">
                                                <div>
                                                    <h4 className="text-[10px] font-mulish font-black uppercase tracking-[0.2em] text-[#3E2723] mb-4 pb-1.5 border-b border-pink-100 font-bold">
                                                        Gift Cards
                                                    </h4>
                                                    <div className="relative aspect-[1.4] rounded-xl overflow-hidden shadow-lg border border-pink-100 bg-gradient-to-tr from-[#3E2723] via-[#5D4037] to-[#8D6E63] p-4 flex flex-col justify-between group/giftcard cursor-pointer">
                                                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover/giftcard:scale-125 transition-transform duration-700" />
                                                        <div className="flex justify-between items-start z-10">
                                                            <span className="text-[10px] font-black tracking-widest text-white/90 font-mulish">HARSHAD GAURI</span>
                                                            <span className="text-[8px] bg-white/20 text-white font-bold px-1.5 py-0.5 rounded uppercase tracking-wider font-mulish">E-Gift</span>
                                                        </div>
                                                        <div className="z-10 mt-6 text-left">
                                                            <span className="text-[8px] text-white/60 tracking-wider uppercase block mb-1 font-mulish">Available range</span>
                                                            <span className="text-white text-sm font-bold tracking-wide font-mulish">₹500 - ₹50,000</span>
                                                        </div>
                                                        <div className="z-10 flex justify-between items-end border-t border-white/10 pt-2 text-left">
                                                            <span className="text-[8px] text-white/50 italic font-mulish">Spread Love & Joy</span>
                                                            <span className="text-[8px] font-bold text-[#FFD54F] hover:underline uppercase tracking-wider font-mulish">Buy Now &gt;&gt;</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {((settings?.navbarLinks && settings.navbarLinks.length > 0) ? settings.navbarLinks : [
                                { name: "ABOUT", path: "/about" },
                                { name: "BLOG", path: "/blogs" },
                                { name: "OFFERS", path: "/offers" },
                                { name: "SHOP", path: "/shop" },
                                { name: "CONTACT US", path: "/help" },
                                { name: "TRACK ORDER", path: "/profile/orders" }
                            ])
                            .filter(nav => !["GIFTS", "GOLD COINS"].includes(nav.name.toUpperCase()))
                            .map((nav, idx) => (
                                <Link
                                    key={idx}
                                    to={nav.path}
                                    aria-label={`Go to ${nav.name}`}
                                    className="text-[11px] font-normal uppercase text-black hover:text-primary transition-all tracking-normal border-b-2 border-transparent hover:border-primary pb-0.5"
                                >
                                    {nav.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                </nav>
            </div>

            {/* Sidebar / Drawer */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => toggleMenu(false)}
                            className="fixed inset-0 bg-[#4A1015]/30 z-[110] backdrop-blur-[4px]"
                            data-lenis-prevent
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                            className="fixed top-0 right-0 h-full w-[85%] max-w-[320px] bg-white z-[120] shadow-2xl overflow-hidden flex flex-col font-mulish"
                        >
                            {/* BlueStone Style Header - Themed and Compact */}
                            <div className="bg-black p-4 pt-6 flex items-center justify-between text-white relative border-b border-white/10">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/10">
                                        <User className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[9px] text-white/50 leading-none mb-0.5 uppercase tracking-widest font-bold">Guest User</span>
                                        <div className="flex items-center gap-1.5 text-[13px] font-normal">
                                            <Link to="/login" onClick={() => toggleMenu(false)} className="hover:text-primary transition-colors">Login</Link>
                                            <span className="text-white/30 font-sans">/</span>
                                            <Link to="/signup" onClick={() => toggleMenu(false)} className="hover:text-primary transition-colors">Sign Up</Link>
                                        </div>
                                    </div>
                                </div>
                                <button aria-label="Close menu" onClick={() => toggleMenu(false)} className="p-1.5 hover:bg-white/10 rounded-full transition-all">
                                    <X className="w-5 h-5 text-white" />
                                </button>
                            </div>

                            <div 
                                className="flex-1 overflow-y-auto custom-scrollbar bg-white overscroll-contain pb-40"
                                style={{ touchAction: 'pan-y' }}
                                data-lenis-prevent
                            >
                                {/* Section: Shop For */}
                                <div className="px-5 py-3">
                                    <span className="text-[10px] text-gray-400 tracking-widest font-bold mb-3 block font-mulish">Shop For</span>
                                    <div className="space-y-0 font-mulish">
                                        {sidebarMenu.mainCategories.map((item, idx) => {
                                            const isDept = ['jewellery', 'machines', 'tools'].includes(item.name.toLowerCase());
                                            const isOpen = activeSidebarDept?.toLowerCase() === item.name.toLowerCase();
                                            
                                            const deptCats = categories.filter(c => {
                                                const deptName = item.name.toLowerCase() === 'machines' ? 'machines' : item.name.toLowerCase();
                                                return (c.department || 'Jewellery').toLowerCase() === deptName;
                                            });

                                            return (
                                                <div key={idx} className="border-b border-gray-100 last:border-0">
                                                    <button
                                                        onClick={() => setActiveSidebarDept(isOpen ? null : item.name)}
                                                        className="w-full flex items-center gap-4 py-2 group transition-all"
                                                    >
                                                        {isOpen ? (
                                                            <Minus className="w-4 h-4 text-gray-400 group-hover:text-primary transition-all" />
                                                        ) : (
                                                            <Plus className="w-4 h-4 text-gray-400 group-hover:text-primary transition-all" />
                                                        )}
                                                        <span className={`text-[13px] font-normal transition-all ${isOpen ? 'text-primary' : 'text-gray-800 group-hover:text-primary'}`}>
                                                            {item.name}
                                                        </span>
                                                    </button>
                                                    
                                                    <AnimatePresence initial={false}>
                                                        {isOpen && (
                                                            <motion.div
                                                                initial={{ height: 0, opacity: 0 }}
                                                                animate={{ height: 'auto', opacity: 1 }}
                                                                exit={{ height: 0, opacity: 0 }}
                                                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                                                                className="overflow-hidden bg-gray-50/50"
                                                            >
                                                                <div className="flex flex-col pl-8 pr-5 pb-3">
                                                                    <button
                                                                        onClick={() => {
                                                                            toggleMenu(false);
                                                                            navigate(item.path);
                                                                        }}
                                                                        className="w-full text-left py-1.5 text-sm font-bold text-primary hover:underline uppercase tracking-wider"
                                                                    >
                                                                        View All {item.name === 'Machines' ? 'Machine' : item.name}
                                                                    </button>

                                                                    {deptCats.map((cat) => (
                                                                        <button
                                                                             key={cat.id || cat._id}
                                                                            onClick={() => {
                                                                                toggleMenu(false);
                                                                                navigate(`/shop?category=${encodeURIComponent(cat.name)}`);
                                                                            }}
                                                                            className="w-full text-left py-1.5 text-sm text-gray-600 hover:text-primary transition-all"
                                                                        >
                                                                            {cat.name}
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            );
                                        })}
                                        
                                        {/* BlueStone Style Static Links */}
                                        <div className="border-b border-gray-100">
                                            <Link to="/offers" onClick={() => toggleMenu(false)} className="flex items-center gap-4 py-2 group">
                                                <Plus className="w-4 h-4 text-gray-400 group-hover:text-[#FF6B6B]" />
                                                <span className="text-[13px] font-normal text-[#FF6B6B]">Offers</span>
                                            </Link>
                                        </div>
                                        <div className="border-b border-gray-100">
                                            <Link to="/shop?tag=gift" onClick={() => toggleMenu(false)} className="flex items-center gap-4 py-2 group">
                                                <Plus className="w-4 h-4 text-gray-400 group-hover:text-gray-700" />
                                                <span className="text-[13px] font-normal text-gray-700">Gifting</span>
                                            </Link>
                                        </div>
                                    </div>
                                </div>

                                {/* Monthly Plan Banners */}
                                <div className="my-4 space-y-3 px-5">
                                    <Link to="/gold-mine" onClick={() => toggleMenu(false)} className="flex items-center justify-between bg-pink-50 p-3 rounded-xl border border-pink-100 group transition-all hover:bg-pink-100/50 shadow-sm">
                                        <div className="flex items-center gap-3">
                                            <div className="flex flex-col">
                                                <span className="font-serif text-base font-normal text-[#002147] leading-none">Gold Mine</span>
                                                <div className="w-full h-[1px] bg-[#002147]/30 mt-1"></div>
                                            </div>
                                            <span className="text-[9px] font-normal text-gray-600 tracking-tighter">10 + 1 Monthly Plan</span>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                    
                                    <Link to="/gold-reserve" onClick={() => toggleMenu(false)} className="flex items-center justify-between bg-yellow-50/50 p-3 rounded-xl border border-yellow-100 group transition-all hover:bg-yellow-50 shadow-sm">
                                        <div className="flex items-center gap-3">
                                            <div className="flex flex-col">
                                                <span className="font-serif text-base font-normal text-[#3E2723] leading-none">Gold Reserve</span>
                                                <div className="w-full h-[1px] bg-[#3E2723]/30 mt-1"></div>
                                            </div>
                                            <span className="text-[9px] font-normal text-gray-600 tracking-tighter">10 + 1 Monthly Plan</span>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>

                                {/* More Links */}
                                <div className="px-5 py-3">
                                     <span className="text-[10px] text-gray-400 tracking-widest font-bold mb-3 block">Jewellery Guide</span>
                                     <div className="space-y-2">
                                         {sidebarMenu.support.map((item, idx) => (
                                             <Link
                                                         key={idx}
                                                         to={item.path}
                                                         onClick={() => toggleMenu(false)}
                                                         className="block text-[13px] font-normal text-gray-700 hover:text-primary transition-all capitalize"
                                                     >
                                                         {item.name.toLowerCase()}
                                                     </Link>
                                         ))}
                                     </div>
                                 </div>

                                {/* Locate Store Banner */}
                                <Link to="/stores" onClick={() => toggleMenu(false)} className="mx-5 mb-4 relative rounded-xl overflow-hidden group">
                                    <div className="bg-[#D4AF37]/20 p-3.5 flex items-center gap-4 border border-[#D4AF37]/30">
                                        <div className="w-9 h-9 bg-[#002147] rounded-lg flex items-center justify-center shrink-0">
                                            <Store className="w-5.5 h-5.5 text-white" />
                                        </div>
                                        <span className="text-xs font-normal tracking-[0.15em] text-[#002147]">Locate Our Store</span>
                                    </div>
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all"></div>
                                </Link>

                                {/* Additional Sidebar Options from Image */}
                                <div className="px-5 pb-6 space-y-0 flex flex-col border-t border-gray-100 pt-2">
                                    {[
                                        { name: "Recently Viewed", path: "/recently-viewed", color: "text-[#FF6B6B]" },
                                        { name: "Video Call Cart", path: "/video-call" },
                                        { name: "Track Order", path: "/profile/orders" },
                                        { name: "Jewellery Guide", path: "/guide" },
                                        { name: "Privacy Policy", path: "/privacy" },
                                        { name: "Terms & Conditions", path: "/terms" }
                                    ].map((item, idx) => (
                                        <Link
                                            key={idx}
                                            to={item.path}
                                            onClick={() => toggleMenu(false)}
                                            className={`py-3 border-b border-gray-50 text-[14px] font-normal transition-all ${item.color || 'text-gray-700'} hover:pl-2`}
                                        >
                                            {item.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Sidebar Bottom Action Bar */}
                            <div className="bg-gray-50 border-t border-gray-200 py-3 flex justify-around items-center">
                                <button className="flex flex-col items-center gap-1 group flex-1 border-r border-gray-200">
                                    <MessageCircle className="w-5 h-5 text-gray-500 group-hover:text-primary transition-colors" />
                                    <span className="text-[10px] text-gray-500 font-medium group-hover:text-primary transition-colors">Chat</span>
                                </button>
                                <button className="flex flex-col items-center gap-1 group flex-1">
                                    <Phone className="w-5 h-5 text-gray-500 group-hover:text-primary transition-colors" />
                                    <span className="text-[10px] text-gray-500 font-medium group-hover:text-primary transition-colors">Call</span>
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
            {/* Bottom Nav (Mobile) - Animated & Compact */}
            {/* Bottom Nav (Mobile) - Animated & Compact */}
            <motion.div 
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                className={`md:hidden fixed ${location.pathname.startsWith('/product/') ? 'bottom-24' : 'bottom-6'} left-4 right-4 h-14 bg-white/90 border border-gray-100/50 rounded-[24px] flex items-center justify-around z-[120] shadow-[0_8px_32px_rgba(0,0,0,0.08)] px-1 backdrop-blur-xl`}
            >
                {[
                    { to: "/", icon: Home, label: "Home", match: (p) => p === '/' },
                    { to: "/shop", icon: ShoppingBag, label: "Shop", match: (p, s) => p === '/shop' && !s.includes('tag=') },
                    { to: "/shop?tag=gift", icon: Gift, label: "Gifts", match: (p, s) => s.includes('tag=gift') },
                    { to: "/shop?tag=coin", icon: Coins, label: "Coins", match: (p, s) => s.includes('tag=coin') },
                    { to: "/wishlist", icon: Heart, label: "Favs", match: (p) => p === '/wishlist' },
                    { to: "/profile", icon: User, label: "Me", match: (p) => p === '/profile' }
                ].map((item) => {
                    const isActive = item.match(location.pathname, location.search);
                    return (
                        <Link 
                            key={item.label}
                            to={item.to} 
                            onClick={() => toggleMenu(false)} 
                            className="flex flex-col items-center justify-center flex-1 h-full relative"
                        >
                            <motion.div 
                                whileTap={{ scale: 0.9 }}
                                className={`flex flex-col items-center gap-0.5 transition-all duration-300 ${isActive ? 'scale-110' : 'opacity-70 hover:opacity-100'}`}
                            >
                                <item.icon 
                                    className={`w-5 h-5 transition-colors ${isActive ? 'text-primary' : 'text-gray-500'}`} 
                                    strokeWidth={isActive ? 2.5 : 2}
                                />
                                <span className={`text-[8px] font-bold tracking-tight transition-colors ${isActive ? 'text-primary' : 'text-gray-400'}`}>
                                    {item.label}
                                </span>
                            </motion.div>
                            
                            {isActive && (
                                <motion.div 
                                    layoutId="bottomNavDot"
                                    className="absolute -bottom-1 w-1 h-1 bg-primary rounded-full shadow-[0_0_8px_rgba(var(--primary-rgb),0.6)]"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                        </Link>
                    );
                })}
            </motion.div>
        </>
    );
};

export default Navbar;
