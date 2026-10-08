import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useShop } from '../../../context/ShopContext';

const MostGifted = () => {
    const { homepageSections } = useShop();

    // Use admin-configured items strictly from the DB
    const sectionData = homepageSections?.['most-gifted'];
    const displayItems = sectionData?.items && sectionData.items.length > 0 ? sectionData.items : [];

    if (displayItems.length === 0) return null;

    return (
        <section className="py-8 md:py-12 bg-bg-light relative overflow-hidden">
            {/* Custom Animation for Reverse/Yoyo Effect */}
            <style>{`
                @keyframes shine-alt {
                    0% { transform: translateX(0) rotate(45deg); }
                    100% { transform: translateX(1200%) rotate(45deg); }
                }
            `}</style>
            <div className="container mx-auto px-2 md:px-4">

                <div className="flex flex-col lg:flex-row gap-4 md:gap-6 h-auto lg:h-[300px]">
                    {/* Feature Banner - Glow in Motion */}
                    <div className="w-full lg:w-[45%] relative rounded-2xl md:rounded-[2rem] overflow-hidden group shadow-md md:shadow-[0_10px_40px_rgba(0,0,0,0.15)] transition-all duration-500 cursor-pointer h-[300px] md:h-auto">
                        <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover"
                        >
                            <source src="/videos/most-gifted.mp4" type="video/mp4" />
                        </video>

                        {/* Shine Effect */}
                        <div className="absolute top-[-200%] left-[-200%] w-[40%] h-[500%] bg-gradient-to-r from-transparent via-white/40 to-transparent transform rotate(45 group-hover:translate-x-[800%] transition-transform duration-1000 z-20 pointer-events-none" />

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent z-10" />

                        {/* Content */}
                        <div className="absolute inset-0 flex flex-col justify-end md:justify-center p-6 md:p-14 z-30 pb-8 md:pb-14">
                            <span className="text-gold text-xs md:text-sm font-serif italic tracking-wide mb-2 md:mb-4 drop-shadow-md">Collection Focus</span>
                            <h2 className="text-2xl md:text-3xl font-serif font-normal italic tracking-wide text-white mb-4 md:mb-6 leading-tight">
                                {sectionData?.label || "Most Gifted Items"}
                            </h2>

                            {/* CTA Button */}
                            <Link
                                to="/shop"
                                className="mt-4 md:mt-8 inline-flex items-center gap-3 bg-white/20 border border-white/30 text-white px-6 md:px-8 py-2.5 md:py-3 rounded-full hover:bg-white hover:text-primary transition-all duration-500 w-fit group/btn backdrop-blur-md"
                            >
                                <span className="font-serif italic font-normal text-xs md:text-sm tracking-widest">Explore Collection</span>
                                <ArrowRight className="w-3 h-3 md:w-4 md:h-4 group-hover/btn:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>

                    {/* Category Cards - Compact for Mobile */}
                    <div className="w-full lg:w-[55%] grid grid-cols-4 md:grid-cols-4 gap-2 md:gap-4 lg:h-full">
                        {displayItems.map((cat, index) => {
                            const itemLabel = cat.name || cat.label;

                            return (
                                <Link
                                    to={cat.path}
                                    key={cat.id}
                                    className="relative rounded-xl md:rounded-2xl overflow-hidden group h-[120px] md:h-full bg-white shadow shadow-[#4A1015]/10 hover:shadow-2xl transition-all duration-500 border border-gray-100 cursor-pointer isolate"
                                >
                                    {/* Product Image */}
                                    <div className="w-full h-full relative">
                                        <img
                                            src={cat.image}
                                            alt={itemLabel}
                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-[2000ms] opacity-90 group-hover:opacity-100"
                                        />
                                        {/* Dynamic Gradient Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 z-10" />
                                    </div>

                                    {/* Text Content */}
                                    <div className="absolute bottom-2 md:bottom-6 left-0 right-0 text-center z-30 px-1 transition-transform duration-500 md:group-hover:-translate-y-2">
                                        <h3 className="font-serif text-[8px] md:text-base tracking-tight text-white font-normal group-hover:text-gold transition-colors duration-300 drop-shadow-md">
                                            {itemLabel}
                                        </h3>
                                        <div className="h-[1px] w-0 bg-gold mx-auto mt-1 md:mt-2 transition-all duration-500 group-hover:w-8" />
                                    </div>
                                </Link>
                            )
                        })}
                    </div>

                </div>
            </div>
        </section>
    );
};

export default MostGifted;
