import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Wrench, Gem } from 'lucide-react';
import { useShop } from '../../../context/ShopContext';
import { getServicesFromSections, slugifyService } from '../data/servicesData';

const GROUP_ICONS = {
    machine: Wrench,
    jewelry: Gem,
};

const ServicesSection = () => {
    const { homepageSections } = useShop();
    const sectionData = useMemo(() => getServicesFromSections(homepageSections), [homepageSections]);
    const groups = sectionData.groups || [];
    const [activeTab, setActiveTab] = useState(groups[0]?.id || 'machine');

    const activeGroup = groups.find((g) => g.id === activeTab) || groups[0];
    const previewItems = (activeGroup?.items || []).slice(0, 6);

    if (!groups.length || !groups.some((g) => g.items?.length)) return null;

    return (
        <section className="py-10 md:py-14 bg-[#FFF5F6] border-y border-[#EBCDD0]/30">
            <div className="container mx-auto px-4 md:px-8 max-w-6xl">
                <div className="text-center mb-6 md:mb-8">
                    <span className="text-[#D39A9F] text-[10px] font-bold uppercase tracking-[0.25em]">Services</span>
                    <h2 className="font-display text-2xl md:text-3xl text-black mt-1 mb-2">{sectionData.label}</h2>
                    <p className="text-gray-500 text-xs md:text-sm font-serif italic max-w-lg mx-auto">{sectionData.subtitle}</p>
                </div>

                <div className="flex justify-center gap-4 md:gap-8 mb-6 border-b border-[#EBCDD0]/50 pb-1">
                    {groups.map((group) => {
                        const Icon = GROUP_ICONS[group.id] || Wrench;
                        return (
                            <button
                                key={group.id}
                                type="button"
                                onClick={() => setActiveTab(group.id)}
                                className={`flex items-center gap-2 text-[11px] md:text-xs font-bold uppercase tracking-widest pb-2 relative transition-colors ${
                                    activeTab === group.id ? 'text-[#8B4356]' : 'text-gray-400 hover:text-gray-600'
                                }`}
                            >
                                <Icon className="w-3.5 h-3.5" strokeWidth={2} />
                                {group.name}
                                {activeTab === group.id && (
                                    <motion.div layoutId="servicesTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D39A9F]" />
                                )}
                            </button>
                        );
                    })}
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.25 }}
                        className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3 mb-6"
                    >
                        {previewItems.map((item) => {
                            const slug = item.slug || slugifyService(item.name);
                            return (
                                <Link
                                    key={item.id}
                                    to={`/services/${activeGroup.id}/${slug}`}
                                    className="group bg-white border border-[#EBCDD0]/40 rounded-xl px-3 py-3 md:px-4 md:py-3.5 hover:border-[#D39A9F] hover:shadow-md transition-all"
                                >
                                    <p className="text-[11px] md:text-xs font-semibold text-black leading-snug group-hover:text-[#8B4356] transition-colors">
                                        {item.name}
                                    </p>
                                </Link>
                            );
                        })}
                    </motion.div>
                </AnimatePresence>

                <div className="text-center">
                    <Link
                        to={`/services?tab=${activeTab}`}
                        className="inline-flex items-center gap-2 bg-black text-white px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-[#8B4356] transition-colors"
                    >
                        View All Services
                        <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default ServicesSection;
