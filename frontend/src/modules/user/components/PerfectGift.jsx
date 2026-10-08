import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useShop } from '../../../context/ShopContext';
import dividerImg from '../assets/ornament-divider.png';

const PerfectGift = () => {
    const { homepageSections } = useShop();

    // Use admin-configured items strictly from the DB
    const sectionData = homepageSections?.['perfect-gift'];
    const displayItems = sectionData?.items && sectionData.items.length > 0 ? sectionData.items : [];

    if (displayItems.length === 0) return null;

    return (
        <section className="py-8 md:py-12 bg-gradient-to-b from-primary to-dark text-white">
            <div className="container mx-auto px-2 md:px-4">
                <div className="text-center mb-8 md:mb-10">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="luxury-heading text-white mb-2"
                    >
                        {sectionData?.label || "Find the Perfect Gift For"}
                    </motion.h2>
                    <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: 80 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="h-[1px] bg-gold mx-auto rounded-full"
                    ></motion.div>
                </div>

                {/* Compact Grid Layout for Mobile, Staggered for Desktop */}
                <div className="grid grid-cols-4 md:flex md:flex-nowrap justify-center gap-2 md:gap-8 px-1 md:px-4 mb-6 md:mb-12">
                    {displayItems.map((item, index) => {
                        // Desktop margin logic (compact):
                        const desktopMargin = (index === 0 || index === 3) ? 'md:mt-0' : 'md:mt-12';
                        const itemLabel = item.name || item.label;

                        return (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className={`w-full ${desktopMargin}`}
                            >
                                <Link
                                    to={item.path}
                                    className="group relative block w-full aspect-square md:aspect-square max-w-[280px] mx-auto rounded-xl md:rounded-[1.5rem] overflow-hidden border border-gold/20 shadow-sm transition-all duration-500 hover:shadow-[0_0_15px_rgba(201,162,77,0.3)] hover:border-gold/60 md:hover:-translate-y-2"
                                >
                                    <div className="absolute inset-0 overflow-hidden">
                                        <img
                                            src={item.image}
                                            alt={`Gift for ${itemLabel}`}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
                                    </div>

                                    <div className="absolute bottom-0 inset-x-0 p-1.5 md:p-6 flex flex-col items-center justify-end h-full text-center">
                                        <div className="relative z-10">
                                            <h3 className="text-[10px] md:text-xl font-serif text-white mb-1 md:mb-2 drop-shadow-md uppercase tracking-wider font-normal">
                                                {itemLabel}
                                            </h3>
                                            <div className="w-6 h-0.5 bg-gold mx-auto rounded-full md:transition-all md:duration-500 md:group-hover:w-24 md:group-hover:bg-white" />
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Divider */}
                <div className="flex justify-center w-full px-4 mt-[-40px] relative z-10">
                    <motion.img
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 3.5 }}
                        transition={{ duration: 0.8 }}
                        src={dividerImg}
                        alt="Decorative Divider"
                        className="h-20 md:h-32 w-auto object-contain opacity-90"
                    />
                </div>
            </div>
        </section>
    );
};

export default PerfectGift;
