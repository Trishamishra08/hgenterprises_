import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useShop } from '../../../context/ShopContext';

const PriceRangeShowcase = () => {
    const { homepageSections } = useShop();
    const navigate = useNavigate();
    const [activeIndex, setActiveIndex] = useState(1); // Set second card active initially for a gorgeous balanced look

    // Use admin-configured items retrieved from the DB strictly
    const sectionData = homepageSections?.['price-range-showcase'];
    const displayItems = sectionData?.items && sectionData.items.length > 0 ? sectionData.items : [];

    if (displayItems.length === 0) {
        return null; // Don't render component if there's no dynamic database content
    }

    const handlePrev = () => {
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : displayItems.length - 1));
    };

    const handleNext = () => {
        setActiveIndex((prev) => (prev < displayItems.length - 1 ? prev + 1 : 0));
    };

    return (
        <section className="pt-2 md:pt-4 pb-4 bg-gradient-to-b from-[#FAF5F6] via-[#F1E1E4] to-[#FAF5F6] overflow-hidden relative">
            <div className="container mx-auto px-4">
                {/* Header Section - Matched to Shop by Recipient Style */}
                <div className="text-center mb-4 md:mb-6">
                    <span className="text-[#c1a05b] font-bold tracking-[0.25em] uppercase text-[10px] md:text-xs mb-1 block">
                        SHOP BY BUDGET
                    </span>
                    <h2 className="text-2xl md:text-3xl font-serif font-semibold text-dark mb-2 tracking-wide" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                        Pick Your <span className="italic text-[#8c2a3e] font-normal">Glam</span>
                    </h2>
                    <div className="h-[1px] w-12 bg-[#c1a05b] mx-auto mt-2"></div>
                </div>
            </div>

            {/* Dynamic Interactive Accordion Carousel with Side Controls */}
            <div className="max-w-[1450px] mx-auto px-4 md:px-12 flex justify-center items-center relative group/carousel">
                
                {/* Floating Left Navigation Chevron */}
                <button 
                    onClick={handlePrev}
                    className="absolute left-2 md:left-6 z-40 bg-white hover:bg-white text-dark p-2 md:p-3 rounded-full shadow-md border border-black/5 hover:border-[#6b252c]/30 hover:scale-105 transition-all duration-300 group/btn"
                    aria-label="Previous Glam"
                >
                    <ChevronLeft className="w-4 h-4 md:w-5 h-5 text-gray-500 group-hover/btn:text-[#6b252c] transition-colors" />
                </button>

                {/* Central Cards Wrapper */}
                <div className="flex justify-center items-center gap-2 sm:gap-3 md:gap-5 w-full py-4 overflow-x-auto no-scrollbar">
                    {displayItems.map((item, index) => {
                        const itemLabel = item.name || item.label;
                        const isActive = index === activeIndex;

                        return (
                            <div
                                key={item.id}
                                onClick={() => {
                                    if (isActive && item.path) {
                                        navigate(item.path);
                                    } else {
                                        setActiveIndex(index);
                                    }
                                }}
                                className={`relative cursor-pointer overflow-hidden transition-all duration-700 ease-in-out shrink-0 ${
                                    isActive 
                                        ? "w-[160px] sm:w-[200px] md:w-[280px] lg:w-[340px] h-[240px] md:h-[340px] grayscale-0 opacity-100 shadow-[0_25px_60px_rgba(107,37,44,0.15)] ring-1 ring-[#6b252c]/10 rounded-tl-[2rem] rounded-br-[2rem] md:rounded-tl-[3rem] md:rounded-br-[3rem] rounded-tr-none rounded-bl-none"
                                        : "w-[45px] sm:w-[80px] md:w-[120px] lg:w-[140px] h-[210px] md:h-[300px] grayscale opacity-45 hover:opacity-75 rounded-tl-[1.5rem] rounded-br-[1.5rem] md:rounded-tl-[2rem] md:rounded-br-[2rem] rounded-tr-none rounded-bl-none"
                                }`}
                            >
                                {/* Image Wrapper */}
                                <div className="absolute inset-0 w-full h-full">
                                    <img
                                        src={item.image}
                                        alt={itemLabel}
                                        className={`w-full h-full object-cover transition-transform duration-[1200ms] ${
                                            isActive ? "scale-105" : "scale-100 hover:scale-105"
                                        }`}
                                    />
                                    {/* Grayscale overlay with luxury dark lens */}
                                    <div className={`absolute inset-0 transition-opacity duration-700 ${
                                        isActive 
                                            ? "bg-gradient-to-t from-black/95 via-black/30 to-transparent opacity-90" 
                                             : "bg-black/20 opacity-100"
                                    }`} />
                                </div>

                                {/* Active Content Card Details */}
                                <div className={`absolute inset-x-0 bottom-0 flex flex-col justify-end p-2 md:p-4 z-20 transition-all duration-500 ${
                                    isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
                                }`}>
                                    <div className="text-center pb-4 md:pb-8">
                                        <span className="text-[7px] md:text-[10px] font-serif text-gold uppercase tracking-[0.4em] mb-1 block">
                                            Exclusive
                                        </span>
                                        <h3 className="text-[10px] sm:text-xs md:text-xl font-serif font-normal text-white uppercase tracking-wider mb-2 drop-shadow-md line-clamp-1">
                                            {itemLabel}
                                        </h3>
                                    </div>

                                    {/* Premium Luxury Pill Button - Centered */}
                                    <div className="absolute bottom-2 md:bottom-4 left-1/2 -translate-x-1/2 z-30">
                                        <Link 
                                            to={item.path} 
                                            className="bg-white text-dark px-2.5 py-1.5 md:px-5 md:py-2.5 rounded-full text-[7px] md:text-[10px] font-bold uppercase tracking-[0.2em] whitespace-nowrap shadow-md hover:bg-[#6b252c] hover:text-white transition-all duration-300"
                                            onClick={(e) => e.stopPropagation()} // Prevent card state clicking trigger on actual CTA redirect
                                        >
                                            Explore Range
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Floating Right Navigation Chevron */}
                <button 
                    onClick={handleNext}
                    className="absolute right-2 md:right-6 z-40 bg-white hover:bg-white text-dark p-2 md:p-3 rounded-full shadow-md border border-black/5 hover:border-[#6b252c]/30 hover:scale-105 transition-all duration-300 group/btn"
                    aria-label="Next Glam"
                >
                    <ChevronRight className="w-4 h-4 md:w-5 h-5 text-gray-500 group-hover/btn:text-[#6b252c] transition-colors" />
                </button>

            </div>
        </section>
    );
};

export default PriceRangeShowcase;
