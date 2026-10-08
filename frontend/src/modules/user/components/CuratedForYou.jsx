import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useShop } from '../../../context/ShopContext';

const CuratedForYou = () => {
    const { homepageSections } = useShop();
    const sectionData = homepageSections?.['curated-for-you'];
    const displayItems = sectionData?.items && sectionData.items.length > 0 ? sectionData.items : [];

    if (displayItems.length === 0) return null;

    return (
        <section className="pt-4 md:pt-6 pb-2 md:pb-4 bg-white overflow-hidden">
            <div className="container mx-auto px-4 md:px-6">

                {/* Section Header */}
                <div className="text-center mb-4 md:mb-6">
                    <span className="text-primary font-serif tracking-[0.2em] font-normal italic text-[10px] md:text-xs mb-0.5 block">
                        Shop By Occasion
                    </span>
                    <h2 className="font-serif text-2xl md:text-3xl font-normal text-dark tracking-tight">
                        {sectionData?.label || "Curated For You"}
                    </h2>
                    <div className="h-[1px] w-12 bg-primary mx-auto opacity-30 mt-2"></div>
                </div>

                {/* Horizontal Scroll / Grid Container */}
                <div className="flex overflow-x-auto pb-4 gap-4 md:gap-8 justify-start md:justify-center scrollbar-hide">
                    {displayItems.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="flex-shrink-0 group"
                        >
                            <Link to={item.path || '/shop'} className="flex flex-col items-center">
                                {/* Circular Image Container */}
                                <div className="w-20 h-20 md:w-36 md:h-36 rounded-full overflow-hidden border-2 border-primary/10 group-hover:border-gold transition-all duration-500 shadow-md md:shadow-lg mb-3 ring-4 ring-white relative isolate">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    {/* Overlay for depth */}
                                    <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors"></div>
                                </div>
                                <h3 className="font-serif text-xs md:text-base text-dark tracking-wide uppercase font-normal group-hover:text-gold transition-colors">
                                    {item.name}
                                </h3>
                                <div className="h-[1px] w-0 bg-gold mt-1 transition-all duration-500 group-hover:w-full opacity-50"></div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CuratedForYou;
