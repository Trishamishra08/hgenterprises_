import React from 'react';
import { Link } from 'react-router-dom';
import { useShop } from '../../../context/ShopContext';
import haldiImgDefault from '../assets/haldi.png';
import sangeetImgDefault from '../assets/sangeet.png';
import receptionImgDefault from '../assets/reception.png';
import bridalImgDefault from '../assets/bridal.png';
import bridesmaidImgDefault from '../assets/hero_slide_3.png';

const OccasionalSpecial = () => {
    const { homepageSections } = useShop();
    const sectionData = homepageSections?.['curated-for-you'];

    // Default categories if none managed
    const defaultCategories = [
        { id: 'haldi', name: 'Haldi Sparkle', image: haldiImgDefault, path: '/shop?occasion=haldi' },
        { id: 'sangeet', name: 'Sangeet Nights', image: sangeetImgDefault, path: '/shop?occasion=sangeet' },
        { id: 'reception', name: 'Reception Gala', image: receptionImgDefault, path: '/shop?occasion=reception' },
        { id: 'bridal', name: 'Wedding Bliss', image: bridalImgDefault, path: '/shop?occasion=wedding' },
        { id: 'bridesmaid', name: 'Bridesmaid Love', image: bridesmaidImgDefault, path: '/shop?occasion=party' },
    ];

    const displayItems = sectionData?.items && sectionData.items.length > 0 ? sectionData.items : defaultCategories;

    // Helper to get item safe
    const getItem = (index, fallback) => {
        const item = displayItems[index];
        return {
            name: item?.name || item?.label || fallback.name,
            image: item?.image || fallback.image,
            path: item?.path || fallback.path
        };
    };

    // Extract first 5 for the main layout
    const item1 = getItem(0, defaultCategories[0]);
    const item2 = getItem(1, defaultCategories[1]);
    const item3 = getItem(2, defaultCategories[2]);
    const item4 = getItem(3, defaultCategories[3]);
    const item5 = getItem(4, defaultCategories[4]);

    return (
        <section className="py-2 md:py-8 bg-white">
            <div className="container mx-auto px-2 md:px-4">
                {/* Section Header - More Compact */}
                <div className="text-center mb-4 md:mb-6">
                    <span className="text-primary font-serif tracking-[0.2em] font-normal italic text-[10px] md:text-sm mb-1 block">
                        Styled For Her
                    </span>
                    <h2 className="font-serif text-3xl md:text-4xl text-dark font-normal mb-1 md:mb-2 tracking-tight">
                        {sectionData?.label || "Occasion Specials"}
                    </h2>
                    <div className="h-[1px] w-12 bg-primary mx-auto opacity-30 mt-2"></div>
                </div>

                {/* Mobile View: 2-Column Grid - Extra Compact */}
                <div className="grid grid-cols-2 md:hidden gap-2 px-1 mb-6">
                    {displayItems.map((cat, index) => {
                        const label = cat.name || cat.label;
                        return (
                            <Link
                                key={cat.id || index}
                                to={cat.path}
                                className="relative group overflow-hidden rounded-lg flex-shrink-0 w-full aspect-[4/5] cursor-pointer shadow-sm active:scale-95 transition-transform"
                            >
                                <img src={cat.image} alt={label} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-transparent to-transparent"></div>
                                <span className="absolute bottom-2 left-0 right-0 text-white font-serif text-xs tracking-wider text-center px-1 uppercase font-normal">
                                    {label}
                                </span>
                            </Link>
                        )
                    })}
                </div>

                {/* Desktop View: Grid Layout - More Compact Row Height */}
                <div className="hidden md:grid grid-cols-3 gap-4 auto-rows-[180px]">
                    {/* Column 1 - Stacked */}
                    <div className="flex flex-col gap-4 h-full md:row-span-2">
                        <Link to={item1.path} className="relative group overflow-hidden rounded-xl flex-1 cursor-pointer shadow-md hover:shadow-lg transition-all duration-300">
                            <img src={item1.image} alt={item1.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-transparent to-transparent"></div>
                            <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white font-serif text-xl tracking-wider w-full text-center uppercase font-normal">{item1.name}</span>
                        </Link>
                        <Link to={item2.path} className="relative group overflow-hidden rounded-xl flex-1 cursor-pointer shadow-md hover:shadow-lg transition-all duration-300">
                            <img src={item2.image} alt={item2.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-transparent to-transparent"></div>
                            <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white font-serif text-xl tracking-wider w-full text-center uppercase font-normal">{item2.name}</span>
                        </Link>
                    </div>

                    {/* Column 2 - Tall Centerpiece */}
                    <Link to={item3.path} className="relative group overflow-hidden rounded-xl md:row-span-2 shadow-lg hover:shadow-xl transition-all duration-300">
                        <img src={item3.image} alt={item3.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-transparent to-transparent"></div>
                        <span className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white font-serif text-3xl tracking-wider w-full text-center drop-shadow-md uppercase font-normal">{item3.name}</span>
                    </Link>

                    {/* Column 3 - Stacked */}
                    <div className="flex flex-col gap-4 h-full md:row-span-2">
                        <Link to={item4.path} className="relative group overflow-hidden rounded-xl flex-[1.3] cursor-pointer shadow-md hover:shadow-lg transition-all duration-300">
                            <img src={item4.image} alt={item4.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-transparent to-transparent"></div>
                            <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white font-serif text-xl tracking-wider whitespace-nowrap drop-shadow-sm w-full text-center uppercase font-normal">
                                {item4.name}
                            </span>
                        </Link>
                        <Link to={item5.path} className="relative group overflow-hidden rounded-xl flex-[0.7] cursor-pointer shadow-md hover:shadow-lg transition-all duration-300">
                            <img src={item5.image} alt={item5.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-transparent to-transparent"></div>
                            <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white font-serif text-lg tracking-wider whitespace-nowrap drop-shadow-sm w-full text-center uppercase font-normal">
                                {item5.name}
                            </span>
                        </Link>
                    </div>
                </div>

                {/* Additional Items Grid */}
                {displayItems.length > 5 && (
                    <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                        {displayItems.slice(5).map((item, index) => {
                            const label = item.name || item.label;
                            return (
                                <Link
                                    key={item.id || index + 5}
                                    to={item.path}
                                    className="group relative rounded-2xl overflow-hidden aspect-square border border-gray-100 shadow-md"
                                >
                                    <img
                                        src={item.image}
                                        alt={label}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-transparent to-transparent"></div>
                                    <div className="absolute bottom-4 left-0 right-0 text-center">
                                        <h4 className="text-white font-serif text-lg tracking-wider uppercase font-normal">{label}</h4>
                                        <div className="w-8 h-[1px] bg-gold mx-auto mt-1 group-hover:w-16 transition-all duration-500"></div>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                )}
            </div>
        </section>
    );
};

export default OccasionalSpecial;
