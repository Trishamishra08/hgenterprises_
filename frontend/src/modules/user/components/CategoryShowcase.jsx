import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useShop } from '../../../context/ShopContext';
import Skeleton from './Skeleton';
import { resolveCatalogImage } from '../data/catalogImages';

const DEPARTMENT_TABS = [
    { id: 'jewellery', name: 'JEWELLERY' },
    { id: 'tools', name: 'TOOLS' },
    { id: 'machines', name: 'MACHINES' }
];

const CategoryShowcase = () => {
    const { categories, loading } = useShop();
    const [activeTab, setActiveTab] = React.useState('jewellery');

    if (loading) {
        return (
            <section className="pt-10 pb-0 bg-gradient-to-b from-[#1a0507] via-[#2d0a0d] to-[#150405] overflow-hidden">
                <div className="container mx-auto px-6 md:px-12 text-center">
                    <div className="flex justify-center gap-12 mb-10 border-b border-white/10 pb-3">
                        {[1, 2, 3].map(i => <Skeleton key={i} className="h-4 w-24 bg-white/5" />)}
                    </div>
                </div>
            </section>
        );
    }

    // Filter categories based on active department tab
    const filteredCats = (categories || []).filter(cat =>
        cat.department?.toLowerCase() === activeTab.toLowerCase() &&
        cat.status === 'Active' &&
        cat.showInCollection
    );

    return (
        <section className="pt-2 pb-4 bg-gradient-to-b from-[#1a0507] via-[#2d0a0d] to-[#150405] overflow-hidden">
            <div className="container mx-auto px-4 md:px-6 lg:px-20 text-center">

                {/* Refined Department Tabs - Strictly 3 */}
                <div className="flex justify-center gap-6 md:gap-12 mb-2 border-b border-white/10 pb-0.5 overflow-x-auto scrollbar-hide">
                    {DEPARTMENT_TABS.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`text-[14px] md:text-[18px] font-['Cormorant_Garamond',serif] font-semibold tracking-wide lowercase capitalize transition-all duration-500 relative py-2 px-2 whitespace-nowrap ${
                                activeTab === tab.id ? 'text-white' : 'text-white/60 hover:text-white/90'
                            }`}
                        >
                            {tab.name}
                            {activeTab === tab.id && (
                                <motion.div
                                    layoutId="activeTabUnderline"
                                    className="absolute bottom-[-1px] left-0 right-0 h-[1.5px] bg-gold"
                                    initial={false}
                                />
                            )}
                        </button>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6 }}
                        className="flex flex-nowrap justify-center gap-2 md:gap-4 pb-2 overflow-x-auto scrollbar-hide px-1 md:px-2"
                    >
                        {filteredCats.map((cat, index) => {
                            return (
                                <div key={cat.id || cat._id} className="group flex flex-col items-center w-[75px] md:w-[100px] shrink-0">
                                    <Link to={`/collection/${cat.id || cat._id}`} className="block">
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.8, delay: index * 0.1, ease: 'easeOut' }}
                                            className="flex flex-col items-center"
                                        >
                                            {/* Minimalist Circle Image */}
                                            <div className="relative w-16 h-16 md:w-24 md:h-24 rounded-full overflow-hidden border border-white/10 p-0.5 transition-all duration-700 group-hover:border-gold/30 group-hover:shadow-[0_15px_35px_rgba(0,0,0,0.5)] group-hover:scale-[1.05]">
                                                <div className="w-full h-full rounded-full overflow-hidden bg-white/5">
                                                    <img
                                                        src={resolveCatalogImage(cat.image, cat.name, cat.department || activeTab)}
                                                        alt={cat.name}
                                                        className="w-full h-full object-contain bg-white transform transition-transform duration-1000 group-hover:scale-110"
                                                    />
                                                </div>
                                            </div>

                                            {/* Premium Label */}
                                            <span className="mt-3 md:mt-4 font-['Cormorant_Garamond',serif] text-[12px] md:text-[14px] text-[#FAF5F6] font-semibold tracking-wide lowercase capitalize text-center transition-all duration-500 group-hover:text-gold whitespace-nowrap">
                                                {cat.name}
                                            </span>
                                        </motion.div>
                                    </Link>
                                </div>
                            );
                        })}
                        {filteredCats.length === 0 && (
                            <div className="w-full py-20 text-center text-white/30 font-serif text-[10px] uppercase tracking-[0.4em] italic">
                                Segment Initialization Pending
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </section>
    );
};

export default CategoryShowcase;
